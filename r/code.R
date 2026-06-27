# r/code.R
# Pure R computation layer.
# This file is intentionally valid standalone R so it can be tested in RStudio.

validate_dashboard_inputs <- function(n, dist, p1, p2, bins) {
  if (!is.numeric(n) || length(n) != 1 || is.na(n) || n <= 0) {
    stop("n must be a positive number")
  }
  if (!dist %in% c("normal", "uniform", "exponential")) {
    stop("Unknown distribution")
  }
  if (!is.numeric(p1) || length(p1) != 1 || is.na(p1)) {
    stop("Parameter 1 must be numeric")
  }
  if (dist != "exponential" && (!is.numeric(p2) || length(p2) != 1 || is.na(p2))) {
    stop("Parameter 2 must be numeric")
  }
  if (dist == "normal" && p2 <= 0) {
    stop("For the normal distribution, sd must be greater than 0")
  }
  if (dist == "uniform" && p2 <= p1) {
    stop("For the uniform distribution, max must be greater than min")
  }
  if (dist == "exponential" && p1 <= 0) {
    stop("For the exponential distribution, rate must be greater than 0")
  }
  if (!is.numeric(bins) || length(bins) != 1 || is.na(bins) || bins < 1) {
    stop("bins must be a positive number")
  }
  invisible(TRUE)
}

generate_data <- function(n, dist, p1, p2 = NA_real_) {
  n <- as.integer(n)
  if (dist == "normal") return(rnorm(n, mean = p1, sd = p2))
  if (dist == "uniform") return(runif(n, min = p1, max = p2))
  if (dist == "exponential") return(rexp(n, rate = p1))
  stop("Unknown distribution")
}

analyze_data <- function(x) {
  c(
    n = length(x),
    mean = mean(x),
    sd = sd(x),
    min = min(x),
    q1 = unname(quantile(x, 0.25)),
    median = median(x),
    q3 = unname(quantile(x, 0.75)),
    max = max(x)
  )
}

summary_text <- function(x) {
  paste(capture.output(print(summary(x))), collapse = "\n")
}

analysis_report <- function(n, dist, p1, p2, bins) {
  validate_dashboard_inputs(n, dist, p1, p2, bins)
  set.seed(123)
  x <- generate_data(n, dist, p1, p2)
  analyze_data(x)
}

summary_report <- function(n, dist, p1, p2, bins) {
  validate_dashboard_inputs(n, dist, p1, p2, bins)
  set.seed(123)
  x <- generate_data(n, dist, p1, p2)
  summary_text(x)
}

plot_histogram_svg <- function(x, bins, title = "Histogram") {
  f <- tempfile(fileext = ".svg")
  svg(filename = f, width = 7, height = 4.2, bg = "white")

  hist(
    x,
    breaks = bins,
    col = "steelblue",
    border = "white",
    main = title,
    xlab = "Value",
    ylab = "Frequency"
  )

  dev.off()
  paste(readLines(f, warn = FALSE), collapse = "\n")
}

plot_report_svg <- function(n, dist, p1, p2, bins, title = "Histogram") {
  validate_dashboard_inputs(n, dist, p1, p2, bins)
  set.seed(123)
  x <- generate_data(n, dist, p1, p2)
  plot_histogram_svg(x, bins, title)
}
