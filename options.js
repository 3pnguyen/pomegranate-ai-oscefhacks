const DEFAULTS = {
  apiKey: "",
  models: ["anthropic/claude-sonnet-5.5", "nvidia/nemotron-3-ultra-550b-a55b:free", "baidu/ernie-5.5-flash-preview:free"],
  model: "anthropic/claude-sonnet-5.5",
  effort: "low",
};
const $ = (id) => document.getElementById(id);

chrome.storage.local.get(DEFAULTS).then((s) => {
  $("key").value = s.apiKey;
  $("models").value = s.models.join("\n");
  $("model").value = s.model;
  $("effort").value = s.effort;
});

$("save").onclick = async () => {
  const models = $("models").value.split("\n").map((m) => m.trim()).filter(Boolean);
  const model = $("model").value.trim() || models[0] || DEFAULTS.model;
  await chrome.storage.local.set({
    apiKey: $("key").value.trim(),
    models,
    model,
    effort: $("effort").value,
  });
  $("ok").hidden = false;
  setTimeout(() => ($("ok").hidden = true), 1800);
};

document.getElementById("back").addEventListener('click', () => 
  window.location.href = "popup.html"
);
