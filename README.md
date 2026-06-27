# Reactive webR Dashboard

This project is a lightweight Shiny-like analytical dashboard using:

- `webR` for running R in the browser
- pure JavaScript for reactive input handling
- SVG output for plots
- a separate `r/code.R` file that can also be tested directly in RStudio

## Project structure

```text
webr_reactive_dashboard/
├── index.html
├── main.js
├── r/
│   └── code.R
├── components/
│   ├── state.js
│   ├── reactive.js
│   └── router.js
├── pages/
│   ├── dashboard.js
│   ├── summary.js
│   ├── plot.js
│   └── code.js
└── styles/
    └── styles.css
```

## Run locally

Because the app loads `r/code.R` via `fetch()`, open it through a local HTTP server.

From inside the project folder, run:

```bash
python -m http.server
```

Then open:

```text
http://localhost:8000
```

## Test R code in RStudio

Open `r/code.R` in RStudio and run:

```r
source("r/code.R")
set.seed(123)
x <- generate_data(300, "normal", 0, 1)
analyze_data(x)
summary_text(x)
plot_histogram_svg(x, 25, "Normal distribution")
```

The R file contains computation only. JavaScript handles UI and reactivity.
