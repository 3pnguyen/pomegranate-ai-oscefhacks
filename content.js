(() => {
  if (window.__pomegranate) return;
  window.__pomegranate = true;

  // ---------- Shadow DOM host (isolates our UI from page CSS) ----------
  const host = document.createElement("div");
  host.id = "pomegranate-host";
  host.style.cssText = [
    "all: initial",
    "position: fixed",
    "top: 0",
    "left: 0",
    "width: 0",
    "height: 0",
    "z-index: 2147483647",
  ].join("; ");
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
<style>
:host {
  all: initial;
}

* {
  box-sizing: border-box;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
}

[hidden] { display: none !important; }

.c {
  --bg: #fff;
  --fg: #1d1d1f;
  --mut: #6b6b73;
  --line: #e4e4e8;
  --acc: #ff5633;
  --accfg: #fff;
  --chip: #f3f3f7;
  --user: #eef0ff;
}

@media (prefers-color-scheme: dark) {
  .c {
    --bg: #1b1b1f;
    --fg: #ececf0;
    --mut: #9a9aa5;
    --line: #34343b;
    --acc: #f55f5f;
    --accfg: #10101a;
    --chip: #2a2a31;
    --user: #262a4a;
  }
}

#fab {
  position: fixed;
  padding: 6px 10px;
  border: 0;
  border-radius: 999px;
  background: var(--acc);
  color: var(--accfg);
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 4px 14px #0004;
}

#menu, #side {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--fg);
}

#menu {
  width: 300px;
  max-height: 360px;
  border: 1px solid var(--line);
  border-radius: 12px;
  box-shadow: 0 10px 30px #0005;
  overflow: hidden;
}

#side {
  top: 0;
  right: 0;
  height: 100vh;
  width: min(420px, 100vw);
  border-left: 1px solid var(--line);
  box-shadow: -8px 0 30px #0004;
}

.search {
  border: 0;
  border-bottom: 1px solid var(--line);
  padding: 10px 12px;
  background: transparent;
  color: var(--fg);
  font-size: 14px;
  outline: none;
}

.list { overflow: auto; padding: 4px; }
.cat { padding: 8px 8px 4px; color: var(--mut); font-size: 11px; text-transform: uppercase; letter-spacing: .05em; }
.item { display: block; width: 100%; padding: 8px; border: 0; border-radius: 8px; background: transparent; color: var(--fg); text-align: left; font-size: 14px; cursor: pointer; }
.item:hover, .item.sel { background: var(--chip); }

.head { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--line); }
.head b { flex: 1; font-size: 14px; }
.x { border: 0; background: transparent; color: var(--mut); font-size: 20px; cursor: pointer; }
.ctl { display: flex; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--line); }
.ctl select { flex: 1; min-width: 0; padding: 6px; border: 1px solid var(--line); border-radius: 8px; background: var(--bg); color: var(--fg); font-size: 12px; }
.ctl label { display: flex; flex: 1; flex-direction: column; min-width: 0; gap: 2px; color: var(--mut); font-size: 10px; }
.ctx { max-height: 84px; margin: 10px 12px 0; padding: 8px 10px; overflow: auto; border-left: 3px solid var(--acc); border-radius: 6px; background: var(--chip); color: var(--mut); font-size: 12px; }
.ctx img { display: block; max-width: 100%; max-height: 120px; border-radius: 6px; }
.log { flex: 1; overflow: auto; padding: 12px; }
.you { display: inline-block; margin: 10px 0 6px; padding: 6px 10px; border-radius: 10px; background: var(--user); font-size: 12px; }
.ai { font-size: 14px; line-height: 1.55; }
.ai p { margin: .5em 0; }
.ai ul, .ai ol { margin: .4em 0; padding-left: 1.3em; }
.ai h1, .ai h2, .ai h3, .ai h4 { margin: .8em 0 .3em; font-size: 14px; }
.ai code { padding: 1px 4px; border-radius: 4px; background: var(--chip); font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; }
.ai pre { overflow: auto; padding: 8px; border-radius: 8px; background: var(--chip); }
.ai pre code { padding: 0; background: none; }
.ai img.diagram { width: 100%; border: 1px solid var(--line); border-radius: 8px; background: #fff; }
.err { color: #d33; font-size: 13px; }
.picker { flex: 1; overflow: auto; padding: 0 12px 12px; }
.foot { padding: 8px 12px; border-top: 1px solid var(--line); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { padding: 5px 10px; border: 1px solid var(--line); border-radius: 999px; background: var(--chip); color: var(--fg); font-size: 12px; cursor: pointer; }
.chip:hover { border-color: var(--acc); }
.chip:disabled { opacity: .5; cursor: default; }
.attempt { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
.attempt textarea { width: 100%; min-height: 70px; padding: 8px; border: 1px solid var(--line); border-radius: 8px; resize: vertical; background: var(--bg); color: var(--fg); font-size: 13px; }
.go { align-self: flex-end; padding: 6px 12px; border: 0; border-radius: 8px; background: var(--acc); color: var(--accfg); font-size: 13px; cursor: pointer; }
.note { margin-top: 6px; color: var(--mut); font-size: 11px; }
#snip { position: fixed; inset: 0; background: #0003; cursor: crosshair; }
#snip .hint { position: fixed; top: 12px; left: 50%; padding: 6px 12px; border-radius: 999px; transform: translateX(-50%); background: #000c; color: #fff; font-size: 13px; }
#snip .rect { position: fixed; display: none; border: 2px solid #ff6c6c; background: #7c78ff22; }
</style>
<div class="c">
  <button id="fab" hidden>✦ Explain ▾</button>
  <div id="menu" hidden></div>
  <aside id="side" hidden></aside>
  <div id="snip" hidden></div>
</div>`;
  document.documentElement.appendChild(host);
  const $ = (id) => root.getElementById(id);

  // ---------- State ----------
  let settings = { models: [], model: "", effort: "low", hasKey: true };
  let ctx = null; // { text } or { image }
  let history = []; // API messages (user/assistant)
  let busy = false;
  let port = null;
  let sel = "";

  const loadSettings = async () => {
    settings = await chrome.runtime.sendMessage({ type: "settings" });
  };

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // ---------- Safe mini-markdown ----------
  function render(text) {
    const svgs = [], codes = [];
    text = text.replace(/```svg\s*\n([\s\S]*?)```/g, (_, s) => {
      svgs.push(s);
      return `\n@@SVG${svgs.length - 1}@@\n`;
    });
    text = text.replace(/```\w*\n([\s\S]*?)```/g, (_, c) => {
      codes.push(c);
      return `\n@@CODE${codes.length - 1}@@\n`;
    });
    // Hide a still-streaming (unclosed) svg/code block behind a placeholder
    text = text.replace(/```svg[\s\S]*$/, "\n*Drawing diagram…*\n").replace(/```[\s\S]*$/, "\n*…*\n");
    const inline = (s) =>
      esc(s)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
        .replace(/(^|\W)\*([^*\n]+)\*(?=\W|$)/g, "$1<i>$2</i>");
    const out = [];
    let list = null;
    const flush = () => {
      if (list) {
        out.push(`</${list}>`);
        list = null;
      }
    };
    for (const line of text.split("\n")) {
      let m;
      if ((m = line.match(/^@@(SVG|CODE)(\d+)@@$/))) {
        flush();
        if (m[1] === "SVG") {
          let svg = svgs[+m[2]];
          if (!/xmlns=/.test(svg)) {
            svg = svg.replace(/<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
          }
          out.push(
            `<img class="diagram" alt="diagram" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}">`,
          );
        } else {
          out.push(`<pre><code>${esc(codes[+m[2]])}</code></pre>`);
        }
      } else if ((m = line.match(/^\s*[-*]\s+(.*)/))) {
        if (list !== "ul") {
          flush();
          out.push("<ul>");
          list = "ul";
        }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
        if (list !== "ol") {
          flush();
          out.push("<ol>");
          list = "ol";
        }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if ((m = line.match(/^#{1,4}\s+(.*)/))) {
        flush();
        out.push(`<h3>${inline(m[1])}</h3>`);
      } else if (!line.trim()) {
        flush();
      } else {
        flush();
        out.push(`<p>${inline(line)}</p>`);
      }
    }
    flush();
    return out.join("");
  }

  // ---------- Picker (shared by dropdown + sidebar) ----------
  function buildPicker(container, onPick, withSearch = true) {
    container.innerHTML = "";
    const search = document.createElement("input");
    search.className = "search";
    search.placeholder = "Search prompts…";

    const list = document.createElement("div");
    list.className = "list";
    if (withSearch) container.appendChild(search);
    container.appendChild(list);
    const items = TF_PROMPTS;
    const draw = (q = "") => {
      list.innerHTML = "";
      let last = "";
      const matches = items.filter((p) =>
        (p.label + p.cat).toLowerCase().includes(q.toLowerCase()),
      );

      for (const p of matches) {
        if (p.cat !== last) {
          const h = document.createElement("div");
          h.className = "cat";
          h.textContent = p.cat;
          list.appendChild(h);
          last = p.cat;
        }

        const b = document.createElement("button");
        b.className = "item";
        b.textContent = p.label;
        b.onclick = () => onPick(p);
        list.appendChild(b);
      }
    };
    search.oninput = () => draw(search.value);
    search.onkeydown = (e) => {
      if (e.key === "Enter") list.querySelector(".item")?.click();
      if (e.key === "Escape") hideMenu();
    };
    draw();
    return search;
  }

  // ---------- Highlight → button → dropdown ----------
  const hideFab = () => ($("fab").hidden = true);
  const hideMenu = () => ($("menu").hidden = true);

  document.addEventListener("mouseup", (e) => {
    if (e.composedPath().includes(host)) return;
    setTimeout(() => {
      const s = getSelection();
      const t = s ? s.toString().trim() : "";
      if (t.length < 2 || !s.rangeCount) return hideFab();
      sel = t.slice(0, 6000);
      const r = s.getRangeAt(0).getBoundingClientRect();
      const fab = $("fab");
      fab.style.left = Math.max(8, Math.min(r.left, innerWidth - 120)) + "px";
      fab.style.top = Math.min(r.bottom + 8, innerHeight - 44) + "px";
      fab.hidden = false;
    }, 10);
  });
  document.addEventListener("mousedown", (e) => {
    if (e.composedPath().includes(host)) return;
    hideFab();
    hideMenu();
  });

  $("fab").onclick = async () => {
    await loadSettings();
    const menu = $("menu");
    const fab = $("fab");
    menu.style.left = Math.max(8, Math.min(parseFloat(fab.style.left), innerWidth - 310)) + "px";
    menu.style.top = Math.max(8, Math.min(parseFloat(fab.style.top) + 34, innerHeight - 370)) + "px";
    menu.hidden = false;
    hideFab();
    const search = buildPicker(menu, (p) => {
      hideMenu();
      openSidebar({ text: sel });
      ask(p.label, p.text);
    });
    search.focus();
  };

  // ---------- Sidebar ----------
  function openSidebar(newCtx) {
    ctx = newCtx;
    history = [];
    busy = false;

    if (port) {
      try {
        port.disconnect();
      } catch {}
      port = null;
    }
    const side = $("side");
    side.hidden = false;
    side.innerHTML = `
      <div class="head"><b>Pomegranate AI</b><button class="x" id="close" title="Close">×</button></div>
      <div class="ctl">
        <label>Model<select id="model"></select></label>
        <label>Thinking<select id="effort">
          <option value="off">Off</option><option value="low">Low</option>
          <option value="medium">Medium</option><option value="high">High</option></select></label>
      </div>
      <div class="ctx" id="ctx"></div>
      <div class="picker" id="picker"></div>
      <div class="log" id="log" hidden></div>
      <div class="foot" id="foot" hidden></div>`;
    $("close").onclick = closeSidebar;

    const ms = $("model");
    const models = settings.models.includes(settings.model) ? settings.models : [settings.model, ...settings.models];
    ms.innerHTML = models.map((m) => `<option value="${esc(m)}">${esc(m)}</option>`).join("");
    ms.value = settings.model;
    ms.onchange = () => {
      settings.model = ms.value;
      chrome.runtime.sendMessage({ type: "save", patch: { model: ms.value } });
    };
    $("effort").value = settings.effort;
    $("effort").onchange = () => {
      settings.effort = $("effort").value;
      chrome.runtime.sendMessage({
        type: "save",
        patch: { effort: settings.effort },
      });
    };

    const c = $("ctx");
    if (ctx.image) {
      const im = document.createElement("img");
      im.src = ctx.image;
      c.appendChild(im);
    } else {
      c.textContent = ctx.text.length > 300 ? ctx.text.slice(0, 300) + "…" : ctx.text;
    }

    if (!settings.hasKey) {
      $("picker").innerHTML = `<p class="err">Add your OpenRouter API key to get started.</p><button class="go" id="optbtn">Open settings</button>`;
      $("optbtn").onclick = () => chrome.runtime.sendMessage({ type: "open-options" });
    } else if (ctx.image) {
      buildPicker($("picker"), (p) => ask(p.label, p.text), false);
    } else {
      $("picker").hidden = true;
      $("log").hidden = false;
    }
  }
  function closeSidebar() {
    if (port) {
      try {
        port.disconnect();
      } catch {}
      port = null;
    }
    $("side").hidden = true;
    history = [];
    ctx = null;
  }

  // ---------- Asking ----------
  function ask(label, promptText) {
    if (busy || !ctx) return;
    busy = true;
    $("picker").hidden = true;
    $("log").hidden = false;
    $("foot").hidden = false;
    renderFoot(true);

    let content = promptText;
    if (history.length === 0) {
      const page = `\n\n(Page: ${document.title})`;
      content = ctx.image
        ? [
            { type: "text", text: promptText + page },
            { type: "image_url", image_url: { url: ctx.image } },
          ]
        : `${promptText}\n\nHighlighted text:\n"""\n${ctx.text}\n"""${page}`;
    }
    history.push({ role: "user", content });

    const log = $("log");
    const you = document.createElement("div");
    you.className = "you";
    you.textContent = label;

    const ai = document.createElement("div");
    ai.className = "ai";
    ai.textContent = "Thinking…";
    log.append(you, document.createElement("br"), ai);
    log.scrollTop = log.scrollHeight;

    let acc = "";
    let raf = 0;
    const paint = () => {
      raf = 0;
      ai.innerHTML = render(acc);
      log.scrollTop = log.scrollHeight;
    };

    port = chrome.runtime.connect({ name: "ask" });
    port.onMessage.addListener((m) => {
      if (m.t === "delta") {
        acc += m.text;
        if (!raf) raf = requestAnimationFrame(paint);
      } else if (m.t === "error") {
        ai.innerHTML = `<span class="err">${esc(m.text)}</span>`;
        history.pop();
        finish();
      } else if (m.t === "done") {
        paint();
        history.push({ role: "assistant", content: acc });
        finish();
      }
    });
    port.postMessage({ messages: history, model: settings.model, effort: settings.effort });
    function finish() {
      busy = false;
      try {
        port.disconnect();
      } catch {}
      port = null;
      renderFoot(false);
    }
  }

  function renderFoot(disabled) {
    const foot = $("foot");
    foot.innerHTML = `<div class="chips"></div><div class="attempt" id="attempt" hidden>
      <textarea id="att" placeholder="Write your own answer or reasoning first…"></textarea>
      <button class="go" id="attgo">Check my attempt</button></div>
      <div class="note">Follow-ups are curated on purpose. Try the question yourself before revealing answers.</div>`;
    const chips = foot.querySelector(".chips");
    const add = (label, fn) => {
      const b = document.createElement("button");
      b.className = "chip";
      b.textContent = label;
      b.disabled = disabled;
      b.onclick = fn;
      chips.appendChild(b);
    };
    add("✍ Check my attempt", () => {
      $("attempt").hidden = !$("attempt").hidden;
      $("att").focus();
    });
    for (const f of TF_FOLLOWUPS) add(f.label, () => ask(f.label, f.text));
    $("attgo").onclick = () => {
      const v = $("att").value.trim();
      if (!v) return;
      ask("My attempt", `Here is my attempt:\n"""\n${v.slice(0, 4000)}\n"""\nTell me what is right, what to rethink, and only then confirm the correct solution.`);
    };
  }

  // ---------- Screenshot snip ----------
  function startSnip(dataUrl) {
    hideFab(); hideMenu();
    const s = $("snip");
    s.innerHTML = `<div class="hint">Drag to select a diagram · Esc to cancel</div><div class="rect"></div>`;
    s.hidden = false;
    const rect = s.querySelector(".rect");
    let x0 = 0, y0 = 0, drag = false;
    const end = () => { s.hidden = true; s.onmousedown = s.onmousemove = s.onmouseup = null; document.removeEventListener("keydown", onKey, true); };
    const onKey = (e) => { if (e.key === "Escape") { e.preventDefault(); end(); } };
    document.addEventListener("keydown", onKey, true);
    const box = (e) => ({ x: Math.min(x0, e.clientX), y: Math.min(y0, e.clientY), w: Math.abs(e.clientX - x0), h: Math.abs(e.clientY - y0) });
    s.onmousedown = (e) => { drag = true; x0 = e.clientX; y0 = e.clientY; rect.style.display = "block"; };
    s.onmousemove = (e) => {
      if (!drag) return; const b = box(e);
      Object.assign(rect.style, { left: b.x + "px", top: b.y + "px", width: b.w + "px", height: b.h + "px" });
    };
    s.onmouseup = (e) => {
      if (!drag) return; drag = false;
      const b = box(e); end();
      if (b.w < 12 || b.h < 12) return;
      const img = new Image();
      img.onload = async () => {
        const k = img.naturalWidth / innerWidth;
        let w = b.w * k, h = b.h * k;
        const cap = Math.min(1, 1600 / Math.max(w, h));
        const cv = document.createElement("canvas");
        cv.width = Math.round(w * cap); cv.height = Math.round(h * cap);
        cv.getContext("2d").drawImage(img, b.x * k, b.y * k, w, h, 0, 0, cv.width, cv.height);
        await loadSettings();
        openSidebar({ image: cv.toDataURL("image/png") });
      };
      img.src = dataUrl;
    };
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "start-snip") startSnip(msg.dataUrl);
  });

  loadSettings();
})();
