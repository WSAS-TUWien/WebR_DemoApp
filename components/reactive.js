import { state, setValidation, validateInputs } from "./state.js";
import { renderCurrentPage } from "./router.js";

export function initReactiveInputs() {
  const distributionEl = document.getElementById("distribution");
  const nEl = document.getElementById("n");
  const nValueEl = document.getElementById("nValue");
  const param1El = document.getElementById("param1");
  const param2El = document.getElementById("param2");
  const param1HelpEl = document.getElementById("param1Help");
  const param2HelpEl = document.getElementById("param2Help");
  const binsEl = document.getElementById("bins");
  const binsValueEl = document.getElementById("binsValue");

  function syncInputState() {
    state.inputs.distribution = distributionEl.value;
    state.inputs.n = Number(nEl.value);
    state.inputs.param1 = Number(param1El.value);
    state.inputs.param2 = param2El.value === "" ? NaN : Number(param2El.value);
    state.inputs.bins = Number(binsEl.value);

    nValueEl.textContent = String(state.inputs.n);
    binsValueEl.textContent = String(state.inputs.bins);

    if (state.inputs.distribution === "normal") {
      param2El.disabled = false;
      param1HelpEl.textContent = "Mean for normal distribution";
      param2HelpEl.textContent = "Standard deviation for normal distribution";
    }

    if (state.inputs.distribution === "uniform") {
      param2El.disabled = false;
      param1HelpEl.textContent = "Minimum value";
      param2HelpEl.textContent = "Maximum value";
    }

    if (state.inputs.distribution === "exponential") {
      param2El.disabled = true;
      param1HelpEl.textContent = "Rate parameter";
      param2HelpEl.textContent = "Unused for exponential distribution";
    }
  }

  function scheduleReactiveUpdate() {
    syncInputState();

    try {
      validateInputs();
      setValidation("");
    } catch (err) {
      setValidation(err.message);
      return;
    }

    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => {
      renderCurrentPage();
    }, 250);
  }

  // If distribution changes, reset parameters to sensible defaults.
  distributionEl.addEventListener("change", () => {
    if (distributionEl.value === "normal") {
      param1El.value = 0;
      param2El.value = 1;
    }
    if (distributionEl.value === "uniform") {
      param1El.value = 0;
      param2El.value = 1;
    }
    if (distributionEl.value === "exponential") {
      param1El.value = 1;
      param2El.value = "";
    }
    scheduleReactiveUpdate();
  });

  [nEl, param1El, param2El, binsEl].forEach(el => {
    el.addEventListener("input", scheduleReactiveUpdate);
    el.addEventListener("change", scheduleReactiveUpdate);
  });

  syncInputState();
}
