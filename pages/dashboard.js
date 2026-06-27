import { state, getDistributionLabel, validateInputs, setStatus } from "../components/state.js";

export async function renderDashboard(app, token) {
  app.innerHTML = `
    <h2>Dashboard</h2>
    <p class="hint">Metrics are recomputed automatically whenever inputs change.</p>
    <div id="metrics" class="metrics">Computing...</div>
  `;

  try {
    validateInputs();
    setStatus("Updating dashboard...", "busy");

    const { distribution, n, param1, param2, bins } = state.inputs;
    const result = await state.webR.evalR(`
      analysis_report(${n}, ${JSON.stringify(distribution)}, ${param1}, ${Number.isFinite(param2) ? param2 : "NA_real_"}, ${bins})
    `);
    const js = await result.toJs();

    if (token !== state.renderToken) return;

    const cards = js.values.map((v, i) => `
      <div class="card">
        <div class="card-label">${js.names[i]}</div>
        <div class="card-value">${Number(v).toFixed(4)}</div>
      </div>
    `).join("");

    document.getElementById("metrics").innerHTML = `
      <div class="page-note">
        <strong>${getDistributionLabel()}</strong>, n = ${n}, bins = ${bins}
      </div>
      <div class="card-grid">${cards}</div>
    `;

    setStatus("Dashboard updated ✅", "ok");
  } catch (err) {
    if (token !== state.renderToken) return;
    document.getElementById("metrics").innerHTML = `<div class="error">${err.message}</div>`;
    setStatus("Input error ❌", "error");
  }
}
