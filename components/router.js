import { state } from "./state.js";
import { renderDashboard } from "../pages/dashboard.js";
import { renderSummary } from "../pages/summary.js";
import { renderPlot } from "../pages/plot.js";
import { renderCode } from "../pages/code.js";

const pageRenderers = {
  dashboard: renderDashboard,
  summary: renderSummary,
  plot: renderPlot,
  code: renderCode
};

export function initRouter() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => loadPage(btn.dataset.page));
  });
}

export function loadPage(page) {
  state.activePage = page;

  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  renderCurrentPage();
}

export async function renderCurrentPage() {
  const app = document.getElementById("app");
  const renderer = pageRenderers[state.activePage] || renderDashboard;
  const token = ++state.renderToken;
  await renderer(app, token);
}
