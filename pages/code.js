import { state, getDistributionLabel, setStatus } from "../components/state.js";

export async function renderCode(app, token) {
  const { distribution, n, param1, param2, bins } = state.inputs;
  const p2 = Number.isFinite(param2) ? param2 : "NA_real_";
  const title = `Histogram: ${getDistributionLabel()}`;

  const generatedCode = `# Generated R calls for the current UI state
# This is the same R API used by the JavaScript pages.

source("r/code.R")

analysis_report(${n}, "${distribution}", ${param1}, ${p2}, ${bins})

summary_report(${n}, "${distribution}", ${param1}, ${p2}, ${bins})

svg_markup <- plot_report_svg(
  n = ${n},
  dist = "${distribution}",
  p1 = ${param1},
  p2 = ${p2},
  bins = ${bins},
  title = "${title}"
)
`;

  app.innerHTML = `
    <h2>R Code</h2>
    <p class="hint">Copy this into RStudio after opening the project root.</p>
    <pre>${generatedCode}</pre>
  `;

  setStatus("Generated R code shown", "ok");
}
