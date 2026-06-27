import { state, getDistributionLabel, validateInputs, setStatus } from "../components/state.js";

export async function renderPlot(app, token) {
  app.innerHTML = `
    <h2>Plot</h2>
    <p class="hint">The SVG histogram updates automatically.</p>
    <div id="plotBox" class="plot-box">Drawing plot...</div>
  `;

  try {
    validateInputs();
    setStatus("Updating plot...", "busy");

    const { distribution, n, param1, param2, bins } = state.inputs;
    const title = `Histogram: ${getDistributionLabel()}`;

    const svg = await state.webR.evalRString(`
      plot_report_svg(${n}, ${JSON.stringify(distribution)}, ${param1}, ${Number.isFinite(param2) ? param2 : "NA_real_"}, ${bins}, ${JSON.stringify(title)})
    `);

    if (token !== state.renderToken) return;
    document.getElementById("plotBox").innerHTML = svg;
    setStatus("Plot updated ✅", "ok");
  } catch (err) {
    if (token !== state.renderToken) return;
    document.getElementById("plotBox").innerHTML = `<div class="error">${err.message}</div>`;
    setStatus("Input error ❌", "error");
  }
}
