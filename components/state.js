export const state = {
  webR: null,
  ready: false,
  activePage: "dashboard",
  renderToken: 0,
  debounceTimer: null,
  inputs: {
    distribution: "normal",
    n: 300,
    param1: 0,
    param2: 1,
    bins: 25
  }
};

export function setStatus(text, kind = "info") {
  const el = document.getElementById("status");
  el.textContent = text;
  el.className = `status ${kind}`;
}

export function setValidation(text) {
  const el = document.getElementById("validation");
  el.textContent = text || "";
}

export function getDistributionLabel() {
  const dist = state.inputs.distribution;
  if (dist === "normal") return "Normal distribution";
  if (dist === "uniform") return "Uniform distribution";
  if (dist === "exponential") return "Exponential distribution";
  return "Distribution";
}

export function validateInputs() {
  const { distribution, n, param1, param2, bins } = state.inputs;

  if (!Number.isFinite(n) || n <= 0) throw new Error("n must be positive.");
  if (!Number.isFinite(param1)) throw new Error("Parameter 1 must be numeric.");
  if (!Number.isFinite(bins) || bins < 1) throw new Error("Bins must be positive.");

  if (distribution !== "exponential" && !Number.isFinite(param2)) {
    throw new Error("Parameter 2 must be numeric.");
  }
  if (distribution === "normal" && param2 <= 0) {
    throw new Error("For normal distribution, standard deviation must be greater than 0.");
  }
  if (distribution === "uniform" && param2 <= param1) {
    throw new Error("For uniform distribution, maximum must be greater than minimum.");
  }
  if (distribution === "exponential" && param1 <= 0) {
    throw new Error("For exponential distribution, rate must be greater than 0.");
  }
}

export function rString(value) {
  return JSON.stringify(String(value));
}
