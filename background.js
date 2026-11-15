// All AI traffic goes through OpenRouter, from here (the API key never reaches page scripts).
const DEFAULTS = {
  apiKey: "",
  // Editable on the options page. Verify slugs at https://openrouter.ai/models
  models: ["anthropic/claude-sonnet-4.5", "openai/gpt-5-mini", "google/gemini-2.5-flash"],
  model: "anthropic/claude-sonnet-4.5",
  effort: "low", // off | low | medium | high
};

const SYSTEM_PROMPT =
`You are an AI tutor integrated into a learning extension. Your ultimate goal is to build the learner's understanding and facilitate critical thinking, never to replace it.
Follow these core directives:
- FACILITATE, DON'T SOLVE (CRITICAL): Do not simply hand out answers. You are a tool to guide learning, not an answer key. Only provide direct answers if the learner has already demonstrated clear proficiency in the specific topic.
- Prevent Academic Dishonesty: Never write essays, complete assignments, or generate ready-to-submit work. Guide the learner to their own conclusions instead.
- Be Concise and Concrete: Maximize learning efficiency by using short paragraphs, brief lists, and clear language. Avoid lengthy, verbose explanations.
- Check for Understanding: After explaining a concept, naturally follow up with a brief, targeted question or activity to test the learner's comprehension.
- Scaffold Practice: When providing practice or quiz questions, DO NOT include the answers. Provide a hint only if explicitly asked, and reveal the final answer only if explicitly asked.
- Evaluate Attempts Constructively: When a learner shares their work, first validate what they did correctly, then point out exactly what they need to rethink. Only confirm the final solution after they have worked through the correction.
- Diagram Constraints: When asked for a diagram, output ONE self-contained SVG inside a fenced block starting with \`\`\`svg. Use a viewBox (approx. 0 0 640 400), a light background <rect>, readable font sizes (14+), no scripts, and no external references. Follow the block with a 1-2 sentence caption.
- Math Formatting: Write all math in plain text or Unicode. Do not use LaTeX delimiters.`;

async function getSettings() {
  const s = await chrome.storage.local.get(DEFAULTS);
  return { ...DEFAULTS, ...s };
}

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());

chrome.runtime.onInstalled.addListener(async (d) => {
  if (d.reason === "install") chrome.runtime.openOptionsPage();
});

// Screenshot keybind: capture the visible tab, hand it to the page to crop.
chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "capture-diagram") return;
  try {
    if (!tab) [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
    await chrome.tabs.sendMessage(tab.id, { type: "start-snip", dataUrl });
  } catch (e) {
    console.warn("Pomegranate AI: capture failed (restricted page?)", e);
  }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === "settings") {
    getSettings().then((s) => {
      const { apiKey, ...rest } = s;
      sendResponse({ ...rest, hasKey: !!apiKey });
    });
    return true;
  }
  if (msg.type === "save") {
    chrome.storage.local.set(msg.patch).then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg.type === "open-options") {
    chrome.runtime.openOptionsPage();
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "ask") return;
  const ctrl = new AbortController();
  port.onDisconnect.addListener(() => ctrl.abort());
  port.onMessage.addListener((req) => stream(port, req, ctrl.signal));
});

async function stream(port, { messages, model, effort }, signal) {
  const send = (m) => { try { port.postMessage(m); } catch {} };
  try {
    const { apiKey } = await getSettings();
    if (!apiKey) return send({ t: "error", text: "No OpenRouter API key set. Open the extension settings to add one." });

    const body = {
      model,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    };
    if (effort && effort !== "off") body.reasoning = { effort };

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Pomegranate AI",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      let detail = "";
      try { detail = (await res.json())?.error?.message || ""; } catch {}
      return send({ t: "error", text: `OpenRouter error ${res.status}${detail ? ": " + detail : ""}` });
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const line of lines) {
        const l = line.trim();
        if (!l.startsWith("data:")) continue;
        const data = l.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const j = JSON.parse(data);
          if (j.error) return send({ t: "error", text: j.error.message || "Model error" });
          const text = j.choices?.[0]?.delta?.content;
          if (text) send({ t: "delta", text });
        } catch {}
      }
    }
    send({ t: "done" });
  } catch (e) {
    if (e.name !== "AbortError") send({ t: "error", text: String(e.message || e) });
  }
}
