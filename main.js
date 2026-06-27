import { WebR } from "https://webr.r-wasm.org/latest/webr.mjs";
import { state, setStatus } from "./components/state.js";
import { initReactiveInputs } from "./components/reactive.js";
import { initRouter, loadPage } from "./components/router.js";

async function initApp() {
  try {
    setStatus("Initializing webR...", "busy");

    state.webR = new WebR();
    await state.webR.init();

    setStatus("Loading R code...", "busy");
    const response = await fetch("r/code.R");
    if (!response.ok) {
      throw new Error("Could not load r/code.R. Are you running via a local HTTP server?");
    }

    const rCode = await response.text();
    await state.webR.evalR(rCode);

    state.ready = true;
    setStatus("webR ready ✅", "ok");

    initRouter();
    initReactiveInputs();
    loadPage("dashboard");
  } catch (err) {
    setStatus("Startup error ❌", "error");
    document.getElementById("app").innerHTML = `
      <h2>Startup error</h2>
      <div class="error">${err.message}</div>
      <p>If you opened index.html directly, start a local server:</p>
      <pre>python -m http.server</pre>
      <p>Then open the localhost URL shown in your terminal.</p>
    `;
  }
}

initApp();
