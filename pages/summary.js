import { state, validateInputs, setStatus } from "../components/state.js";

export async function renderSummary(app, token) {
  app.innerHTML = `
    <h2>Summary</h2>
    <p class="hint">The textual R summary updates automatically.</p>
    <pre id="summaryOut">Computing...</pre>
  `;

  try {
    validateInputs();
    setStatus("Updating summary...", "busy");

    const { distribution, n, param1, param2, bins } = state.inputs;
    const text = await state.webR.evalRString(`
      summary_report(${n}, ${JSON.stringify(distribution)}, ${param1}, ${Number.isFinite(param2) ? param2 : "NA_real_"}, ${bins})
    `);

    if (token !== state.renderToken) return;
    document.getElementById("summaryOut").textContent = text;
    setStatus("Summary updated ✅", "ok");
  } catch (err) {
    if (token !== state.renderToken) return;
    document.getElementById("summaryOut").textContent = `Error: ${err.message}`;
    setStatus("Input error ❌", "error");
  }
}
