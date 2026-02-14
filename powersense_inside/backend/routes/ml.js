const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const MODELIN_DIR = path.join(__dirname, "..", "Modelin");

function parseCSVLine(line) {
  return line.split(",").map((s) => s.trim());
}

function readCSV(fileName) {
  const csvPath = path.join(MODELIN_DIR, fileName);
  if (!fs.existsSync(csvPath)) return null;
  const text = fs.readFileSync(csvPath, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return null;
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length < headers.length) continue;
    const obj = {};
    headers.forEach((h, j) => (obj[h] = row[j]));
    rows.push(obj);
  }
  return { headers, rows };
}

/** Hourly Power Consumption (Zone 1) - last 200 points for chart */
function getHourlyConsumption() {
  const out = readCSV("hourly_consumption.csv");
  if (!out) return null;
  const rows = out.rows.slice(-200);
  const dateIdx = out.headers.findIndex((h) => /date|datetime|ds/i.test(h));
  const powerIdx = out.headers.findIndex((h) => /power|global|y/i.test(h));
  if (dateIdx === -1 || powerIdx === -1) return null;
  const labels = rows.map((r) => {
    const v = r[out.headers[dateIdx]];
    try {
      const d = new Date(v);
      return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" });
    } catch {
      return v;
    }
  });
  const data = rows.map((r) => parseFloat(r[out.headers[powerIdx]])).filter((n) => !Number.isNaN(n));
  if (labels.length !== data.length) return null;
  return { labels, data };
}

/** Prophet Forecast: Actual vs Predicted */
function getProphetForecast() {
  const out = readCSV("prophet_forecast.csv");
  if (!out) return null;
  const rows = out.rows.slice(-150);
  const get = (key) => out.headers.findIndex((h) => h === key || h.toLowerCase().includes(key));
  const dsIdx = get("ds");
  const yIdx = out.headers.findIndex((h) => h === "y" || h === "actual");
  const yhatIdx = out.headers.findIndex((h) => h === "yhat");
  const lowerIdx = out.headers.findIndex((h) => /lower/i.test(h));
  const upperIdx = out.headers.findIndex((h) => /upper/i.test(h));
  if (dsIdx === -1 || yhatIdx === -1) return null;
  const labels = rows.map((r) => {
    try {
      const d = new Date(r[out.headers[dsIdx]]);
      return isNaN(d.getTime()) ? r[out.headers[dsIdx]] : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return r[out.headers[dsIdx]];
    }
  });
  const actual = rows.map((r) => parseFloat(r[out.headers[yIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100));
  const predicted = rows.map((r) => parseFloat(r[out.headers[yhatIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100));
  const lowerBound = lowerIdx >= 0 ? rows.map((r) => parseFloat(r[out.headers[lowerIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100)) : null;
  const upperBound = upperIdx >= 0 ? rows.map((r) => parseFloat(r[out.headers[upperIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100)) : null;
  return { labels, actual, predicted, lowerBound, upperBound };
}

/** Prophet components: trend, weekly, yearly */
function getProphetComponents() {
  const out = readCSV("prophet_components.csv");
  if (!out) return null;
  const rows = out.rows.slice(-150);
  const dsIdx = out.headers.findIndex((h) => h === "ds");
  const trendIdx = out.headers.findIndex((h) => /trend/i.test(h));
  const weeklyIdx = out.headers.findIndex((h) => /weekly/i.test(h));
  const yearlyIdx = out.headers.findIndex((h) => /yearly/i.test(h));
  if (dsIdx === -1 || trendIdx === -1) return null;
  const labels = rows.map((r) => {
    try {
      const d = new Date(r[out.headers[dsIdx]]);
      return isNaN(d.getTime()) ? r[out.headers[dsIdx]] : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return r[out.headers[dsIdx]];
    }
  });
  const trend = rows.map((r) => parseFloat(r[out.headers[trendIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100));
  const weekly = weeklyIdx >= 0 ? rows.map((r) => parseFloat(r[out.headers[weeklyIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100)) : null;
  const yearly = yearlyIdx >= 0 ? rows.map((r) => parseFloat(r[out.headers[yearlyIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100)) : null;
  return { labels, trend, weekly, yearly };
}

/** Anomaly Detection: timeline (actual) + anomaly points */
function getAnomalyData() {
  const out = readCSV("anomaly_timeline.csv");
  if (!out) return null;
  const rows = out.rows.slice(-200);
  const dsIdx = out.headers.findIndex((h) => h === "ds");
  const yIdx = out.headers.findIndex((h) => h === "y");
  const anomalyIdx = out.headers.findIndex((h) => /anomaly/i.test(h));
  if (dsIdx === -1 || yIdx === -1) return null;
  const labels = rows.map((r) => {
    try {
      const d = new Date(r[out.headers[dsIdx]]);
      return isNaN(d.getTime()) ? r[out.headers[dsIdx]] : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return r[out.headers[dsIdx]];
    }
  });
  const actual = rows.map((r) => parseFloat(r[out.headers[yIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100));
  const anomalyPoints = anomalyIdx >= 0 ? rows.map((r, i) => (r[out.headers[anomalyIdx]] === "True" || r[out.headers[anomalyIdx]] === "true" ? actual[i] : null)) : null;
  return { labels, actual, anomalyPoints: anomalyPoints || [] };
}

/** Residual Error Distribution (histogram) */
function getResidualDistribution() {
  const out = readCSV("residual_distribution.csv");
  if (!out) return null;
  const binIdx = out.headers.findIndex((h) => /bin|center/i.test(h));
  const freqIdx = out.headers.findIndex((h) => /freq/i.test(h));
  if (binIdx === -1 || freqIdx === -1) return null;
  const labels = out.rows.map((r) => String(parseFloat(r[out.headers[binIdx]]).toFixed(0)));
  const frequency = out.rows.map((r) => parseFloat(r[out.headers[freqIdx]])).filter((n) => !Number.isNaN(n));
  if (labels.length !== frequency.length) return null;
  return { labels, frequency };
}

/** Power vs Temperature (scatter) - sample for chart */
function getPowerVsTemperature() {
  const out = readCSV("power_vs_temperature.csv");
  if (!out) return null;
  const tempIdx = out.headers.findIndex((h) => /temp/i.test(h));
  const powerIdx = out.headers.findIndex((h) => /power|global/i.test(h));
  if (tempIdx === -1 || powerIdx === -1) return null;
  const rows = out.rows.slice(-500);
  const temperature = rows.map((r) => parseFloat(r[out.headers[tempIdx]])).filter((n) => !Number.isNaN(n));
  const power = rows.map((r) => parseFloat(r[out.headers[powerIdx]])).filter((n) => !Number.isNaN(n));
  if (temperature.length !== power.length) return null;
  return { temperature, power };
}

/** Metrics (KPI + model performance + residual stats) */
function getMetrics() {
  const out = readCSV("metrics.csv");
  if (!out || !out.rows.length) return null;
  const r = out.rows[0];
  const getNum = (key) => {
    const i = out.headers.findIndex((h) => h.toLowerCase().includes(key));
    if (i < 0) return null;
    const v = parseFloat(r[out.headers[i]]);
    return Number.isNaN(v) ? null : v;
  };
  const getInt = (key) => {
    const v = getNum(key);
    return v != null ? Math.round(v) : null;
  };
  return {
    lstmMae: getNum("lstm_mae"),
    lstmRmse: getNum("lstm_rmse"),
    anomaliesCount: getInt("anomalies_count"),
    residualMean: getNum("residual_mean"),
    mae: getNum("mae"),
    rmse: getNum("rmse"),
    anomalyThreshold: getNum("anomaly_threshold"),
    totalSamples: getInt("total_samples"),
    anomalyRatePct: getNum("anomaly_rate"),
    residualMin: getNum("residual_min"),
    residualMax: getNum("residual_max"),
    residualMedian: getNum("residual_median"),
    residualStd: getNum("residual_std"),
  };
}

/** Anomaly list for scrollable table */
function getAnomalyList() {
  const out = readCSV("anomaly_list.csv");
  if (!out) return null;
  const tsIdx = out.headers.findIndex((h) => /timestamp|ds/i.test(h));
  const resIdx = out.headers.findIndex((h) => /residual/i.test(h));
  const actIdx = out.headers.findIndex((h) => /actual|^y$/i.test(h));
  const predIdx = out.headers.findIndex((h) => /pred/i.test(h));
  if (tsIdx === -1 || resIdx === -1) return null;
  return out.rows.slice(0, 100).map((row) => ({
    timestamp: row[out.headers[tsIdx]],
    residual: parseFloat(row[out.headers[resIdx]]),
    actual: actIdx >= 0 ? parseFloat(row[out.headers[actIdx]]) : null,
    pred: predIdx >= 0 ? parseFloat(row[out.headers[predIdx]]) : null,
  }));
}

/** Hourly load profile (24 values) */
function getHourlyLoadProfile() {
  const out = readCSV("hourly_load_profile.csv");
  if (!out) return null;
  const powerIdx = out.headers.findIndex((h) => /power/i.test(h));
  if (powerIdx === -1) return null;
  const power = out.rows.map((r) => parseFloat(r[out.headers[powerIdx]])).filter((n) => !Number.isNaN(n));
  return power.length === 24 ? power : out.rows.map((r) => parseFloat(r[out.headers[powerIdx]]));
}

/** Weekday vs Weekend */
function getWeekdayWeekend() {
  const out = readCSV("weekday_weekend.csv");
  if (!out) return null;
  const labelIdx = out.headers.findIndex((h) => /label/i.test(h));
  const powerIdx = out.headers.findIndex((h) => /power/i.test(h));
  if (labelIdx === -1 || powerIdx === -1) return null;
  const labels = out.rows.map((r) => r[out.headers[labelIdx]]);
  const power = out.rows.map((r) => parseFloat(r[out.headers[powerIdx]]));
  return { labels, power };
}

/** Forecast table sample */
function getForecastTable() {
  const out = readCSV("forecast_table.csv");
  if (!out) return null;
  return out.rows.slice(0, 50).map((row) => {
    const obj = {};
    out.headers.forEach((h, i) => (obj[h] = row[i]));
    return obj;
  });
}

/** Correlation matrix (labels + rows of values) */
function getCorrelationMatrix() {
  const csvPath = path.join(MODELIN_DIR, "correlation_matrix.csv");
  if (!fs.existsSync(csvPath)) return null;
  const text = fs.readFileSync(csvPath, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return null;
  const headers = parseCSVLine(lines[0]);
  const hasIndex = !headers[0] || headers[0].toLowerCase().includes("unnamed");
  const labels = hasIndex ? headers.slice(1).filter(Boolean) : headers.filter(Boolean);
  const matrix = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const values = hasIndex ? row.slice(1) : row;
    matrix.push(values.slice(0, labels.length).map((v) => parseFloat(v)));
  }
  return { labels, matrix };
}

/** 24-Hour Rolling Statistics */
function getRolling24h() {
  const out = readCSV("rolling_24h.csv");
  if (!out) return null;
  const dsIdx = out.headers.findIndex((h) => h === "ds" || /date/i.test(h));
  const actualIdx = out.headers.findIndex((h) => /actual/i.test(h));
  const meanIdx = out.headers.findIndex((h) => /rolling_mean|mean/i.test(h));
  const stdIdx = out.headers.findIndex((h) => /rolling_std|std/i.test(h));
  if (actualIdx === -1) return null;
  const labels = out.rows.map((r) => {
    const v = dsIdx >= 0 ? r[out.headers[dsIdx]] : "";
    try {
      const d = new Date(v);
      return isNaN(d.getTime()) ? v : d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" });
    } catch {
      return v;
    }
  });
  const actual = out.rows.map((r) => parseFloat(r[out.headers[actualIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100));
  const rollingMean = meanIdx >= 0 ? out.rows.map((r) => parseFloat(r[out.headers[meanIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100)) : null;
  const rollingStd = stdIdx >= 0 ? out.rows.map((r) => parseFloat(r[out.headers[stdIdx]])).map((n) => (Number.isNaN(n) ? null : Math.round(n * 100) / 100)) : null;
  return { labels, actual, rollingMean, rollingStd };
}

/**
 * Read predicted_results.csv (LSTM actual vs predicted) from Modelin.
 * Returns { labels, actual, predicted, upperBound, lowerBound } for dashboard.
 */
function getForecastFromPredictedResults() {
  const csvPath = path.join(MODELIN_DIR, "predicted_results.csv");
  if (!fs.existsSync(csvPath)) return null;

  const text = fs.readFileSync(csvPath, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return null;

  const headers = parseCSVLine(lines[0]);
  const actualIdx = headers.findIndex((h) => /actual/i.test(h));
  const predictedIdx = headers.findIndex((h) => /predicted/i.test(h));
  if (actualIdx === -1 || predictedIdx === -1) return null;

  const labels = [];
  const actual = [];
  const predicted = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length <= Math.max(actualIdx, predictedIdx)) continue;
    const a = parseFloat(row[actualIdx]);
    const p = parseFloat(row[predictedIdx]);
    if (Number.isNaN(a) || Number.isNaN(p)) continue;
    labels.push(String(labels.length + 1));
    actual.push(Math.round(a * 100) / 100);
    predicted.push(Math.round(p * 100) / 100);
  }

  if (labels.length === 0) return null;

  const upperBound = predicted.map((p) => Math.round((p * 1.08) * 100) / 100);
  const lowerBound = predicted.map((p) => Math.round((p * 0.92) * 100) / 100);

  return { labels, actual, predicted, upperBound, lowerBound };
}

/**
 * Read forecast_output.csv (Prophet) from Modelin and sample last 30 rows.
 */
function getForecastFromProphetOutput() {
  const csvPath = path.join(MODELIN_DIR, "forecast_output.csv");
  if (!fs.existsSync(csvPath)) return null;

  const text = fs.readFileSync(csvPath, "utf8");
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return null;

  const headers = parseCSVLine(lines[0]);
  const dsIdx = headers.findIndex((h) => h === "ds" || h === "date");
  const yhatIdx = headers.findIndex((h) => /yhat/i.test(h) && !/lower|upper/i.test(h));
  const lowerIdx = headers.findIndex((h) => /yhat_lower|lower/i.test(h));
  const upperIdx = headers.findIndex((h) => /yhat_upper|upper/i.test(h));
  if (yhatIdx === -1) return null;

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length <= yhatIdx) continue;
    const yhat = parseFloat(row[yhatIdx]);
    if (Number.isNaN(yhat)) continue;
    const ds = dsIdx >= 0 ? row[dsIdx] : String(i);
    const lower = lowerIdx >= 0 ? parseFloat(row[lowerIdx]) : yhat * 0.9;
    const upper = upperIdx >= 0 ? parseFloat(row[upperIdx]) : yhat * 1.1;
    rows.push({ ds, yhat, lower: Number.isNaN(lower) ? yhat * 0.9 : lower, upper: Number.isNaN(upper) ? yhat * 1.1 : upper });
  }

  const take = Math.min(30, rows.length);
  const slice = rows.length - take <= 0 ? rows : rows.slice(-take);

  const labels = slice.map((r) => {
    try {
      const d = new Date(r.ds);
      return isNaN(d.getTime()) ? r.ds : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return r.ds;
    }
  });
  const predicted = slice.map((r) => Math.round(r.yhat * 100) / 100);
  const lowerBound = slice.map((r) => Math.round(r.lower * 100) / 100);
  const upperBound = slice.map((r) => Math.round(r.upper * 100) / 100);
  const actual = slice.map((r) => Math.round(r.yhat * 100) / 100);

  return { labels, actual, predicted, upperBound, lowerBound };
}

/**
 * GET /forecast - Return consumption forecast for dashboard from Modelin outputs.
 */
router.get("/forecast", (req, res) => {
  try {
    let data = getForecastFromPredictedResults();
    if (!data) data = getForecastFromProphetOutput();

    if (!data || !data.labels || !data.predicted) {
      return res.status(404).json({
        msg: "No forecast data found. Run Modelin/new.py to generate predicted_results.csv or forecast_output.csv.",
      });
    }

    res.json(data);
  } catch (err) {
    console.error("ML forecast route error:", err);
    res.status(500).json({
      msg: "Failed to get consumption forecast.",
      error: err.message,
    });
  }
});

/**
 * GET /charts - Return all 5 chart datasets for the dashboard (same page, different sections).
 * Response: { hourly, prophetForecast, prophetComponents, anomaly, lstm } (any can be null).
 */
router.get("/charts", (req, res) => {
  try {
    const lstm = getForecastFromPredictedResults() || getForecastFromProphetOutput();
    res.json({
      hourly: getHourlyConsumption(),
      prophetForecast: getProphetForecast(),
      prophetComponents: getProphetComponents(),
      anomaly: getAnomalyData(),
      lstm: lstm ? { labels: lstm.labels, actual: lstm.actual, predicted: lstm.predicted, upperBound: lstm.upperBound, lowerBound: lstm.lowerBound } : null,
      residualDistribution: getResidualDistribution(),
      powerVsTemp: getPowerVsTemperature(),
      rolling24h: getRolling24h(),
      metrics: getMetrics(),
      anomalyList: getAnomalyList(),
      hourlyLoadProfile: getHourlyLoadProfile(),
      weekdayWeekend: getWeekdayWeekend(),
      forecastTable: getForecastTable(),
      correlationMatrix: getCorrelationMatrix(),
    });
  } catch (err) {
    console.error("ML charts route error:", err);
    res.status(500).json({
      msg: "Failed to get chart data.",
      error: err.message,
    });
  }
});

module.exports = router;
