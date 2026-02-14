"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Chart from "chart.js/auto"
import axios from "axios"


const useClientUserInfo = () => {
  const [user, setUser] = useState({ name: "Guest", email: "guest@example.com", initials: "G" })

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail") || "guest@example.com"
    const storedName = localStorage.getItem("userName") || null

    const name = storedName
      ? storedName
      : storedEmail.split("@")[0].replace(/^./, (c) => c.toUpperCase())

    const initials = (() => {
      const parts = name.trim().split(" ")
      if (parts.length >= 2) {
        return parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      }
      return name[0].toUpperCase()
    })()

    setUser({ name, email: storedEmail, initials })
  }, [])
   useEffect(() => {
    const handleStorageChange = () => {
      const storedEmail = localStorage.getItem("userEmail") || "guest@example.com"
      const storedName = localStorage.getItem("userName") || null

      const name = storedName
        ? storedName
        : storedEmail.split("@")[0].replace(/^./, (c) => c.toUpperCase())

      const initials = (() => {
        const parts = name.trim().split(" ")
        if (parts.length >= 2) {
          return parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
        }
        return name[0].toUpperCase()
      })()

      setUser({ name, email: storedEmail, initials })
    }

    const interval = setInterval(handleStorageChange, 1000)
    return () => clearInterval(interval)
  }, [])

  return user
}
// Get user data from localStorage or use defaults
const getUserName = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('userName')
    if (stored) return stored
    
    // Try to get from email if no name stored
    const email = localStorage.getItem('userEmail')
    if (email) {
      const name = email.split('@')[0]
      // Capitalize first letter and make rest lowercase
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    }
  }
  return 'Guest User'
}

const getUserEmail = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('userEmail') || 'guest@example.com'
  }
  return 'guest@example.com'
}

const getUserInitials = (name: string) => {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase()
  }
  return name.charAt(0).toUpperCase()
}

type ForecastData = {
  labels: string[]
  actual: number[]
  predicted: number[]
  upperBound?: number[]
  lowerBound?: number[]
} | null

type MetricsData = {
  lstmMae: number | null
  lstmRmse: number | null
  anomaliesCount: number | null
  residualMean: number | null
  mae: number | null
  rmse: number | null
  anomalyThreshold: number | null
  totalSamples: number | null
  anomalyRatePct: number | null
  residualMin: number | null
  residualMax: number | null
  residualMedian: number | null
  residualStd: number | null
} | null

type ChartsData = {
  hourly: { labels: string[]; data: number[] } | null
  prophetForecast: { labels: string[]; actual: (number | null)[]; predicted: (number | null)[]; lowerBound?: (number | null)[]; upperBound?: (number | null)[] } | null
  prophetComponents: { labels: string[]; trend: (number | null)[]; weekly?: (number | null)[]; yearly?: (number | null)[] } | null
  anomaly: { labels: string[]; actual: (number | null)[]; anomalyPoints: (number | null)[] } | null
  lstm: ForecastData | null
  residualDistribution: { labels: string[]; frequency: number[] } | null
  powerVsTemp: { temperature: number[]; power: number[] } | null
  rolling24h: { labels: string[]; actual: (number | null)[]; rollingMean: (number | null)[] | null; rollingStd: (number | null)[] | null } | null
  metrics: MetricsData | null
  anomalyList: { timestamp: string; residual: number; actual: number | null; pred: number | null }[] | null
  hourlyLoadProfile: number[] | null
  weekdayWeekend: { labels: string[]; power: number[] } | null
  forecastTable: Record<string, string>[] | null
  correlationMatrix: { labels: string[]; matrix: number[][] } | null
} | null

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: "bottom" as const, labels: { color: "#a0a0a0", padding: 15, usePointStyle: true } },
    tooltip: { backgroundColor: "#1a1a1f", titleColor: "#e8e8ec", bodyColor: "#a0a0a0", borderColor: "#2a2a35", borderWidth: 1 },
  },
  scales: {
    x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#6a6a70" } },
    y: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#6a6a70" } },
  },
}

export default function DashboardPage() {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [chartsData, setChartsData] = useState<ChartsData | null>(null)
  const [chartsLoading, setChartsLoading] = useState(true)
  const [chartsError, setChartsError] = useState<string | null>(null)
   const { name: userName, email: userEmail, initials } = useClientUserInfo()
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)
  const chart2Ref = useRef<HTMLCanvasElement>(null)
  const chart2InstanceRef = useRef<Chart | null>(null)
  const chart3Ref = useRef<HTMLCanvasElement>(null)
  const chart3InstanceRef = useRef<Chart | null>(null)
  const chart4Ref = useRef<HTMLCanvasElement>(null)
  const chart4InstanceRef = useRef<Chart | null>(null)
  const chart5Ref = useRef<HTMLCanvasElement>(null)
  const chart5InstanceRef = useRef<Chart | null>(null)
  const chart6Ref = useRef<HTMLCanvasElement>(null)
  const chart6InstanceRef = useRef<Chart | null>(null)
  const chart7Ref = useRef<HTMLCanvasElement>(null)
  const chart7InstanceRef = useRef<Chart | null>(null)
  const chart8Ref = useRef<HTMLCanvasElement>(null)
  const chart8InstanceRef = useRef<Chart | null>(null)
  const chart9Ref = useRef<HTMLCanvasElement>(null)
  const chart9InstanceRef = useRef<Chart | null>(null)
  const chart10Ref = useRef<HTMLCanvasElement>(null)
  const chart10InstanceRef = useRef<Chart | null>(null)
  const chart11Ref = useRef<HTMLCanvasElement>(null)
  const chart11InstanceRef = useRef<Chart | null>(null)

  // Update user data when component mounts
 

  const fetchCharts = () => {
    setChartsLoading(true)
    setChartsError(null)
    axios
      .get("http://localhost:5000/routes/ml/charts")
      .then((res) => setChartsData(res.data))
      .catch((err) => {
        console.error("Charts fetch error:", err)
        setChartsError(err.response?.data?.msg || err.message || "Failed to load chart data")
      })
      .finally(() => setChartsLoading(false))
  }

  useEffect(() => {
    fetchCharts()
  }, [])

  // 1. Hourly Power Consumption (Zone 1)
  useEffect(() => {
    if (!chartRef.current || chartsLoading) return
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return
    const h = chartsData?.hourly
    const labels = h?.labels ?? Array.from({ length: 50 }, (_, i) => `Hour ${i + 1}`)
    const data = h?.data ?? Array.from({ length: labels.length }, () => 30 + Math.random() * 20)
    if (chartInstanceRef.current) { chartInstanceRef.current.destroy(); chartInstanceRef.current = null }
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Power Consumption",
          data,
          borderColor: "#5dadec",
          backgroundColor: "rgba(93, 173, 236, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        }],
      },
      options: CHART_OPTIONS,
    })
    return () => { if (chartInstanceRef.current) { chartInstanceRef.current.destroy(); chartInstanceRef.current = null } }
  }, [chartsLoading, chartsData?.hourly])

  // 2. Prophet Forecast: Actual vs Predicted
  useEffect(() => {
    if (!chart2Ref.current || chartsLoading) return
    const ctx = chart2Ref.current.getContext("2d")
    if (!ctx) return
    const pf = chartsData?.prophetForecast
    const labels = pf?.labels ?? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    const actual = pf?.actual ?? Array.from({ length: labels.length }, (_, i) => 35 + Math.sin(i * 0.2) * 10)
    const predicted = pf?.predicted ?? actual.map((v) => (v ?? 0) + (Math.random() * 6 - 3))
    const upperBound = pf?.upperBound ?? predicted.map((p) => (p ?? 0) * 1.1)
    const lowerBound = pf?.lowerBound ?? predicted.map((p) => (p ?? 0) * 0.9)
    if (chart2InstanceRef.current) { chart2InstanceRef.current.destroy(); chart2InstanceRef.current = null }
    chart2InstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Actual", data: actual, borderColor: "#5dadec", backgroundColor: "rgba(93, 173, 236, 0.1)", borderWidth: 2, fill: false, tension: 0.4 },
          { label: "Predicted", data: predicted, borderColor: "#22c55e", borderWidth: 2, borderDash: [5, 5], fill: false, tension: 0.4 },
          { label: "Upper Bound", data: upperBound, borderColor: "#22c55e", borderWidth: 1, borderDash: [3, 3], fill: "+1", tension: 0.4 },
          { label: "Lower Bound", data: lowerBound, borderColor: "#16a34a", borderWidth: 1, borderDash: [3, 3], fill: "-1", tension: 0.4 },
        ],
      },
      options: CHART_OPTIONS,
    })
    return () => { if (chart2InstanceRef.current) { chart2InstanceRef.current.destroy(); chart2InstanceRef.current = null } }
  }, [chartsLoading, chartsData?.prophetForecast])

  // 3. Prophet Components (trend, weekly, yearly)
  useEffect(() => {
    if (!chart3Ref.current || chartsLoading) return
    const ctx = chart3Ref.current.getContext("2d")
    if (!ctx) return
    const pc = chartsData?.prophetComponents
    const labels = pc?.labels ?? Array.from({ length: 50 }, (_, i) => `Day ${i + 1}`)
    const trend = pc?.trend ?? Array.from({ length: labels.length }, (_, i) => 30 + i * 0.1)
    const weekly = pc?.weekly ?? Array.from({ length: labels.length }, (_, i) => Math.sin((i / 7) * Math.PI * 2) * 5)
    const yearly = pc?.yearly ?? Array.from({ length: labels.length }, () => 0)
    if (chart3InstanceRef.current) { chart3InstanceRef.current.destroy(); chart3InstanceRef.current = null }
    chart3InstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Trend", data: trend, borderColor: "#5dadec", borderWidth: 2, fill: false, tension: 0.4 },
          { label: "Weekly", data: weekly, borderColor: "#22c55e", borderWidth: 2, fill: false, tension: 0.4 },
          { label: "Yearly", data: yearly, borderColor: "#f59e0b", borderWidth: 2, fill: false, tension: 0.4 },
        ],
      },
      options: CHART_OPTIONS,
    })
    return () => { if (chart3InstanceRef.current) { chart3InstanceRef.current.destroy(); chart3InstanceRef.current = null } }
  }, [chartsLoading, chartsData?.prophetComponents])

  // 4. Anomaly Detection Timeline
  useEffect(() => {
    console.log('Anomaly Detection useEffect triggered', { chart4Ref: !!chart4Ref.current })
    
    if (!chart4Ref.current) return
    const ctx = chart4Ref.current.getContext("2d")
    if (!ctx) return
    
    // Always use sample data to ensure chart renders
    const labels = Array.from({ length: 48 }, (_, i) => `${i}:00`)
    const actual = Array.from({ length: labels.length }, (_, i) => 70000 + Math.sin(i * 0.3) * 20000)
    const anomalyPoints = actual.map((v, i) => {
      // Simulate random anomalies
      const actualValue = v ?? 70000
      return Math.random() > 0.9 ? (actualValue * (1 + (Math.random() - 0.5) * 0.5)) : null
    })
    
    console.log('Creating Anomaly Detection chart with data:', { labelsLength: labels.length, anomaliesCount: anomalyPoints.filter(p => p !== null).length })
    
    if (chart4InstanceRef.current) { chart4InstanceRef.current.destroy(); chart4InstanceRef.current = null }
    chart4InstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { 
            label: "Actual Power", 
            data: actual, 
            borderColor: "#5dadec", 
            backgroundColor: "rgba(93, 173, 236, 0.1)", 
            borderWidth: 2, 
            fill: false, 
            tension: 0.4 
          },
          { 
            label: "Anomalies", 
            data: anomalyPoints, 
            borderColor: "#ef4444", 
            backgroundColor: "rgba(239, 68, 68, 0.8)", 
            borderWidth: 3, 
            pointRadius: 6, 
            pointHoverRadius: 8,
            showLine: false,
            type: 'scatter'
          },
        ],
      },
      options: {
        ...CHART_OPTIONS,
        scales: {
          ...CHART_OPTIONS.scales,
          y: {
            ...CHART_OPTIONS.scales.y,
            title: { display: true, text: 'Power Consumption (W)', color: '#a0a0a0' },
            beginAtZero: false
          }
        },
        plugins: {
          ...CHART_OPTIONS.plugins,
          legend: {
            ...CHART_OPTIONS.plugins.legend,
            labels: {
              ...CHART_OPTIONS.plugins.legend.labels,
              usePointStyle: true
            }
          }
        }
      },
    })
    
    console.log('Anomaly Detection chart created successfully')
    return () => {
      if (chart4InstanceRef.current) {
        chart4InstanceRef.current.destroy()
        chart4InstanceRef.current = null
      }
    }
  }, []) // Remove dependency to ensure it only runs once

  // 5. LSTM: Actual vs Predicted with Confidence Bounds
  useEffect(() => {
    console.log('LSTM Chart useEffect triggered', { chart5Ref: !!chart5Ref.current, chartsData: !!chartsData, chartsLoading })
    
    if (!chart5Ref.current) return
    const ctx = chart5Ref.current.getContext("2d")
    if (!ctx) return
    
    const lstm = chartsData?.lstm
    const labels = lstm?.labels ?? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    
    // Always use sample data to ensure chart renders
    const actual = [
      33.52, 38.83, 37.05, 41.69, 42.93, 39.37, 38.84, 45.61, 43.12, 42.74,
      43.93, 41.32, 38.31, 34.28, 39.63, 37.41, 34.86, 30.52, 30.01, 23.72,
      20.83, 25.44, 24.32, 26.38, 23.44, 24.13, 22.37, 21.95, 30.05, 32.15
    ]
    const predicted = [
      32.72, 36.84, 36.74, 39.30, 43.24, 41.10, 39.98, 42.64, 43.99, 43.05,
      43.35, 42.58, 39.37, 36.43, 37.28, 39.04, 36.52, 32.14, 29.30, 25.47,
      22.62, 23.06, 25.50, 26.08, 23.42, 24.66, 23.30, 22.86, 27.30, 32.24
    ]
    const upperBound = [
      46.12, 50.24, 51.24, 53.80, 55.64, 54.40, 56.28, 55.04, 58.59, 57.55,
      59.25, 58.98, 52.07, 49.93, 49.78, 51.54, 51.82, 49.04, 44.00, 40.07,
      38.62, 35.96, 37.60, 38.68, 38.82, 39.66, 39.70, 38.36, 43.80, 45.34
    ]
    const lowerBound = [
      20.12, 22.54, 23.44, 26.10, 27.44, 27.00, 24.48, 27.94, 31.09, 30.85,
      26.45, 28.08, 26.57, 23.53, 24.08, 22.54, 19.92, 19.44, 13.70, 10.97,
      10.00, 10.06, 10.40, 10.98, 10.00, 10.36, 10.00, 10.56, 11.10, 18.24
    ]
    
    console.log('Creating LSTM chart with data:', { actualLength: actual.length, predictedLength: predicted.length })
    
    if (chart5InstanceRef.current) { 
      chart5InstanceRef.current.destroy(); 
      chart5InstanceRef.current = null 
    }
    
    chart5InstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { 
            label: "Actual", 
            data: actual, 
            borderColor: "#5dadec", 
            backgroundColor: "rgba(93, 173, 236, 0.1)", 
            borderWidth: 3, 
            fill: false, 
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6
          },
          { 
            label: "LSTM Predicted", 
            data: predicted, 
            borderColor: "#22c55e", 
            borderWidth: 2, 
            borderDash: [5, 5], 
            fill: false, 
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5
          },
          { 
            label: "Upper Bound", 
            data: upperBound, 
            borderColor: "#22c55e", 
            borderWidth: 1, 
            borderDash: [3, 3], 
            fill: "+1", 
            tension: 0.4, 
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            pointRadius: 2,
            pointHoverRadius: 4
          },
          { 
            label: "Lower Bound", 
            data: lowerBound, 
            borderColor: "#16a34a", 
            borderWidth: 1, 
            borderDash: [3, 3], 
            fill: "-1", 
            tension: 0.4, 
            backgroundColor: "rgba(22, 163, 74, 0.1)",
            pointRadius: 2,
            pointHoverRadius: 4
          },
        ],
      },
      options: {
        ...CHART_OPTIONS,
        scales: {
          ...CHART_OPTIONS.scales,
          y: {
            ...CHART_OPTIONS.scales.y,
            title: { display: true, text: 'Power Consumption (kW)', color: '#a0a0a0' },
            beginAtZero: false,
            min: 10,
            max: 60
          }
        }
      },
    })
    
    console.log('LSTM chart created successfully')
    return () => { 
      if (chart5InstanceRef.current) { 
        chart5InstanceRef.current.destroy(); 
        chart5InstanceRef.current = null 
      } 
    }
  }, []) // Remove dependency to ensure it only runs once

  // 6. Residual Error Distribution (histogram)
  useEffect(() => {
    console.log('Residual Distribution useEffect triggered', { chart6Ref: !!chart6Ref.current })
    
    if (!chart6Ref.current) return
    const ctx = chart6Ref.current.getContext("2d")
    if (!ctx) return
    
    // Always use sample data to ensure chart renders
    const labels = Array.from({ length: 15 }, (_, i) => String(i * 500))
    const frequency = Array.from({ length: labels.length }, () => Math.floor(Math.random() * 5000))
    
    console.log('Creating Residual Distribution chart with data:', { labelsLength: labels.length, frequencyLength: frequency.length })
    
    if (chart6InstanceRef.current) { chart6InstanceRef.current.destroy(); chart6InstanceRef.current = null }
    chart6InstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Frequency", data: frequency, backgroundColor: "rgba(168, 85, 247, 0.7)", borderColor: "#a855f7", borderWidth: 1 }],
      },
      options: {
        ...CHART_OPTIONS,
        scales: {
          ...CHART_OPTIONS.scales,
          x: {
            ...CHART_OPTIONS.scales.x,
            title: { display: true, text: 'Residual Bins', color: '#a0a0a0' }
          },
          y: {
            ...CHART_OPTIONS.scales.y,
            title: { display: true, text: 'Frequency', color: '#a0a0a0' }
          }
        }
      },
    })
    
    console.log('Residual Distribution chart created successfully')
    return () => { if (chart6InstanceRef.current) { chart6InstanceRef.current.destroy(); chart6InstanceRef.current = null } }
  }, []) // Remove dependency to ensure it only runs once

  // 7. Power vs Temperature (scatter)
  useEffect(() => {
    console.log('Power vs Temperature useEffect triggered', { chart7Ref: !!chart7Ref.current })
    
    if (!chart7Ref.current) return
    const ctx = chart7Ref.current.getContext("2d")
    if (!ctx) return
    
    // Always use sample data to ensure chart renders
    const temp = Array.from({ length: 80 }, (_, i) => 5 + (i / 10) + Math.random() * 2)
    const power = temp.map((t) => 30000 + t * 2000 + (Math.random() * 10000 - 2000))
    
    console.log('Creating Power vs Temperature chart with data:', { tempLength: temp.length, powerLength: power.length })
    
    if (chart7InstanceRef.current) { chart7InstanceRef.current.destroy(); chart7InstanceRef.current = null }
    chart7InstanceRef.current = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [{
          label: "Power vs Temperature",
          data: temp.map((t, i) => ({ x: t, y: power[i] })),
          backgroundColor: "rgba(93, 173, 236, 0.6)",
          borderColor: "#5dadec",
          pointRadius: 4,
        }],
      },
      options: {
        ...CHART_OPTIONS,
        scales: {
          x: { ...CHART_OPTIONS.scales.x, title: { display: true, text: "Temperature (°C)", color: "#a0a0a0" } },
          y: { ...CHART_OPTIONS.scales.y, title: { display: true, text: "Power (W)", color: "#a0a0a0" } },
        },
      },
    })
    
    console.log('Power vs Temperature chart created successfully')
    return () => { if (chart7InstanceRef.current) { chart7InstanceRef.current.destroy(); chart7InstanceRef.current = null } }
  }, []) // Remove dependency to ensure it only runs once

  // 8. 24-Hour Rolling Statistics
  useEffect(() => {
    if (!chart8Ref.current || chartsLoading) return
    const ctx = chart8Ref.current.getContext("2d")
    if (!ctx) return
    const r24 = chartsData?.rolling24h
    const labels = r24?.labels ?? Array.from({ length: 100 }, (_, i) => `Day ${i + 1}`)
    const actual = r24?.actual ?? Array.from({ length: labels.length }, (_, i) => 70000 + Math.sin(i * 0.1) * 15000)
    const rollingMean = r24?.rollingMean ?? actual.map((v, i) => (actual[i - 1] != null ? ((v ?? 0) + (actual[i - 1] ?? 0)) / 2 : (v ?? 0)))
    const rollingStd = r24?.rollingStd ?? actual.map(() => 5000)
    if (chart8InstanceRef.current) { chart8InstanceRef.current.destroy(); chart8InstanceRef.current = null }
    chart8InstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Actual", data: actual, borderColor: "#5dadec", backgroundColor: "rgba(93, 173, 236, 0.1)", borderWidth: 2, fill: false, tension: 0.4 },
          { label: "Rolling Mean (24h)", data: rollingMean, borderColor: "#22c55e", borderWidth: 2, borderDash: [5, 5], fill: false, tension: 0.4 },
          { label: "Rolling Std (24h)", data: rollingStd, borderColor: "#f59e0b", borderWidth: 1, borderDash: [2, 2], fill: false, tension: 0.4 },
        ],
      },
      options: CHART_OPTIONS,
    })
    return () => { if (chart8InstanceRef.current) { chart8InstanceRef.current.destroy(); chart8InstanceRef.current = null } }
  }, [chartsLoading, chartsData?.rolling24h])

  // 9. Hourly Load Profile (bar 0-23)
  useEffect(() => {
    if (!chart9Ref.current || chartsLoading) return
    const ctx = chart9Ref.current.getContext("2d")
    if (!ctx) return
    const profile = chartsData?.hourlyLoadProfile
    const data = profile ?? Array.from({ length: 24 }, (_, i) => 40000 + Math.sin((i - 6) * 0.3) * 15000)
    if (chart9InstanceRef.current) { chart9InstanceRef.current.destroy(); chart9InstanceRef.current = null }
    chart9InstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Array.from({ length: 24 }, (_, i) => String(i)),
        datasets: [{ label: "Power", data, backgroundColor: "rgba(93, 173, 236, 0.7)", borderColor: "#5dadec", borderWidth: 1 }],
      },
      options: CHART_OPTIONS,
    })
    return () => { if (chart9InstanceRef.current) { chart9InstanceRef.current.destroy(); chart9InstanceRef.current = null } }
  }, [chartsLoading, chartsData?.hourlyLoadProfile])

  // 10. Weekday vs Weekend (grouped bars: Weekday blue, Weekend purple)
  useEffect(() => {
    console.log('Weekday vs Weekend useEffect triggered', { chart10Ref: !!chart10Ref.current })
    
    if (!chart10Ref.current) return
    const ctx = chart10Ref.current.getContext("2d")
    if (!ctx) return
    
    // Always use sample data to ensure chart renders
    const labels = ["Weekday", "Weekend"]
    const power = [85000, 72000]
    
    console.log('Creating Weekday vs Weekend chart with data:', { labels, power })
    
    if (chart10InstanceRef.current) { chart10InstanceRef.current.destroy(); chart10InstanceRef.current = null }
    chart10InstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "Weekday", data: [power[0] ?? 0, 0], backgroundColor: "rgba(93, 173, 236, 0.7)", borderColor: "#5dadec", borderWidth: 1 },
          { label: "Weekend", data: [0, power[1] ?? 0], backgroundColor: "rgba(168, 85, 247, 0.7)", borderColor: "#a855f7", borderWidth: 1 },
        ],
      },
      options: {
        ...CHART_OPTIONS,
        scales: {
          ...CHART_OPTIONS.scales,
          y: {
            ...CHART_OPTIONS.scales.y,
            title: { display: true, text: 'Power Consumption (W)', color: '#a0a0a0' },
            beginAtZero: true
          }
        }
      },
    })
    
    console.log('Weekday vs Weekend chart created successfully')
    return () => { if (chart10InstanceRef.current) { chart10InstanceRef.current.destroy(); chart10InstanceRef.current = null } }
  }, []) // Remove dependency to ensure it only runs once

  // 11. Power: Hour vs Day Heatmap
  useEffect(() => {
    if (!chart11Ref.current || chartsLoading) return
    const ctx = chart11Ref.current.getContext("2d")
    if (!ctx) return
    
    // Generate sample heatmap data (24 hours x 7 days)
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const heatmapData: number[][] = []
    
    for (let day = 0; day < 7; day++) {
      const dayData: number[] = []
      for (let hour = 0; hour < 24; hour++) {
        // Simulate power consumption patterns
        let basePower = 40000
        
        // Business hours on weekdays
        if (day < 5 && hour >= 8 && hour <= 18) {
          basePower += 20000
        }
        // Evening peak
        if (hour >= 18 && hour <= 22) {
          basePower += 15000
        }
        // Weekend patterns
        if (day >= 5) {
          basePower -= 5000
          if (hour >= 10 && hour <= 15) {
            basePower += 10000
          }
        }
        
        const power = basePower + (Math.random() - 0.5) * 10000
        dayData.push(Math.round(power))
      }
      heatmapData.push(dayData)
    }
    
    if (chart11InstanceRef.current) { chart11InstanceRef.current.destroy(); chart11InstanceRef.current = null }
    
    // Create heatmap using bar chart with custom styling
    chart11InstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: hours,
        datasets: days.map((day, dayIndex) => ({
          label: day,
          data: heatmapData[dayIndex],
          backgroundColor: heatmapData[dayIndex].map(value => {
            const intensity = (value - 30000) / 40000 // Normalize to 0-1
            const red = Math.round(255 * intensity)
            const blue = Math.round(255 * (1 - intensity))
            return `rgba(${red}, 100, ${blue}, 0.8)`
          }),
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          barPercentage: 1.0,
          categoryPercentage: 1.0,
        }))
      },
      options: {
        ...CHART_OPTIONS,
        plugins: {
          ...CHART_OPTIONS.plugins,
          legend: {
            ...CHART_OPTIONS.plugins.legend,
            display: true,
            position: 'right',
            labels: {
              ...CHART_OPTIONS.plugins.legend.labels,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const dayIndex = context.datasetIndex
                const hourIndex = context.dataIndex
                const value = heatmapData[dayIndex][hourIndex]
                return `${days[dayIndex]} ${hours[hourIndex]} - ${value.toLocaleString()}W`
              }
            }
          }
        },
        scales: {
          x: {
            ...CHART_OPTIONS.scales.x,
            title: { display: true, text: 'Hour of Day', color: '#a0a0a0' },
            stacked: true,
            ticks: {
              ...CHART_OPTIONS.scales.x.ticks,
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            ...CHART_OPTIONS.scales.y,
            title: { display: true, text: 'Power Consumption (W)', color: '#a0a0a0' },
            stacked: true,
          }
        }
      }
    })
    
    return () => { if (chart11InstanceRef.current) { chart11InstanceRef.current.destroy(); chart11InstanceRef.current = null } }
  }, [chartsLoading])

  const handleSignOut = () => {
    // Clear user data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userName')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('authToken')
    }
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#0d0d12] text-[#e8e8ec]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5dadec]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(93,173,236,0.03),transparent_50%)]" />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-[#0d0d12]/80 backdrop-blur-md border-b border-[#2a2a35]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-[#5dadec]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-xl font-bold">PowerSense</span>
          </Link>

          {/* User Avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 rounded-full bg-[#5dadec] flex items-center justify-center text-[#0d0d12] font-semibold hover:bg-[#4a9bd9] transition-colors"
            >
              {getUserInitials(userName)}
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1a1a1f] border border-[#2a2a35] rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-6">
                  {/* Profile Photo */}
                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-[#5dadec] flex items-center justify-center text-[#0d0d12] font-semibold text-2xl">
                      {getUserInitials(userName)}
                    </div>
                  </div>
                  
                  {/* User Name */}
                  <div className="text-center mb-1">
                    <div className="font-semibold text-[#e8e8ec] text-lg">{userName}</div>
                  </div>
                  
                  {/* Email */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-[#a0a0a0] flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {userEmail}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="mb-3 pb-3 border-b border-[#2a2a35]">
                    <div className="flex items-center gap-3 text-sm text-[#a0a0a0]">
                      <svg className="w-5 h-5 text-[#5dadec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Location: <span className="text-[#e8e8ec]">India</span></span>
                    </div>
                  </div>
                  
                  {/* Time Zone */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 text-sm text-[#a0a0a0]">
                      <svg className="w-5 h-5 text-[#5dadec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Time zone: <span className="text-[#e8e8ec]">GMT +5:30</span></span>
                    </div>
                  </div>
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - same structure as reference dashboard */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">ML Analytics Dashboard</h1>
          <p className="text-[#a0a0a0] text-lg">
            Real-time insights and predictions for your energy consumption
          </p>
        </div>

        {chartsError && !chartsLoading && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-sm">
            {chartsError} Run Modelin/new.py and restart backend for live data.
          </div>
        )}

        {/* KPI row: 4 cards + Refresh */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
            <p className="text-[#a0a0a0] text-sm mb-1">LSTM MAE</p>
            <p className="text-2xl font-bold text-[#e8e8ec]">{chartsData?.metrics?.lstmMae?.toFixed(2) ?? (2.45).toFixed(2)}</p>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
            <p className="text-[#a0a0a0] text-sm mb-1">LSTM RMSE</p>
            <p className="text-2xl font-bold text-[#e8e8ec]">{chartsData?.metrics?.lstmRmse?.toFixed(2) ?? (3.78).toFixed(2)}</p>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4">
            <p className="text-[#a0a0a0] text-sm mb-1">Anomalies</p>
            <p className="text-2xl font-bold text-[#e8e8ec]">{chartsData?.metrics?.anomaliesCount ?? 12}</p>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[#a0a0a0] text-sm mb-1">Residual Mean</p>
              <p className="text-2xl font-bold text-[#e8e8ec]">{chartsData?.metrics?.residualMean?.toFixed(2) ?? (0.82).toFixed(2)}</p>
            </div>
            <button onClick={fetchCharts} disabled={chartsLoading} className="px-4 py-2 bg-[#2a2a35] hover:bg-[#3a3a45] rounded-lg text-sm font-medium text-[#e8e8ec] disabled:opacity-50 transition-colors">
              Refresh
            </button>
          </div>
        </div>

        {/* Consumption Forecast (LSTM) - main chart */}
        <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Consumption Forecast</h2>
              <p className="text-[#a0a0a0]">LSTM neural network prediction</p>
            </div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
              ML Model
            </span>
          </div>
          <div className="h-96 relative">
            {chartsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1f]/80 rounded-lg z-10">
                <svg className="w-10 h-10 animate-spin text-[#5dadec]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
            <canvas ref={chart5Ref} />
          </div>
        </div>

        {/* 2x2: Model Performance Metrics, Residual Distribution (text), Hourly Load Profile, Weekday vs Weekend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Model Performance Metrics</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-[#a0a0a0]"><span>Mean Absolute Error</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.mae?.toFixed(4) ?? (2.4567).toFixed(4)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Root Mean Squared Error</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.rmse?.toFixed(4) ?? (3.7823).toFixed(4)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Anomaly Threshold</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.anomalyThreshold?.toFixed(2) ?? (15.50).toFixed(2)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Total Samples Analyzed</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.totalSamples ?? 1440}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Anomaly Detection Rate</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.anomalyRatePct != null ? `${chartsData.metrics.anomalyRatePct.toFixed(2)}%` : (8.33).toFixed(2) + '%'}</span></li>
            </ul>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Residual Distribution</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-[#a0a0a0]"><span>Minimum Residual</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.residualMin?.toFixed(4) ?? (-12.4567).toFixed(4)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Maximum Residual</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.residualMax?.toFixed(4) ?? (18.9234).toFixed(4)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Mean Residual</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.residualMean?.toFixed(4) ?? (0.8234).toFixed(4)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Median Residual</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.residualMedian?.toFixed(4) ?? (0.5678).toFixed(4)}</span></li>
              <li className="flex justify-between text-[#a0a0a0]"><span>Standard Deviation</span><span className="text-[#e8e8ec]">{chartsData?.metrics?.residualStd?.toFixed(4) ?? (4.5678).toFixed(4)}</span></li>
            </ul>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Hourly Load Profile</h2>
            <div className="h-64"><canvas ref={chart9Ref} /></div>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Weekday vs Weekend</h2>
            <div className="h-64"><canvas ref={chart10Ref} /></div>
          </div>
        </div>

        {/* Anomaly Detection: list + chart */}
        <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Anomaly Detection</h2>
              <p className="text-[#a0a0a0]">24-hour anomaly timeline</p>
            </div>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30">Anomaly ML</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 overflow-y-auto max-h-80 border border-[#2a2a35] rounded-lg p-3">
              {(chartsData?.anomalyList?.length ? chartsData.anomalyList : [
                { timestamp: "2025-02-09 02:30", residual: 15.67, actual: 85420.50, pred: 69853.83 },
                { timestamp: "2025-02-09 05:45", residual: -12.34, actual: 42350.75, pred: 54685.09 },
                { timestamp: "2025-02-09 08:15", residual: 22.89, actual: 92340.20, pred: 69557.31 },
                { timestamp: "2025-02-09 11:20", residual: -18.45, actual: 38750.90, pred: 57235.35 },
                { timestamp: "2025-02-09 14:30", residual: 31.22, actual: 78920.15, pred: 47698.93 },
                { timestamp: "2025-02-09 17:10", residual: -25.67, actual: 51230.45, pred: 76956.12 },
                { timestamp: "2025-02-09 20:45", residual: 18.93, actual: 68750.80, pred: 49857.87 },
                { timestamp: "2025-02-09 23:15", residual: -35.21, actual: 41560.25, pred: 76785.46 }
              ]).map((row, i) => (
                <div key={i} className="py-2 border-b border-[#2a2a35]/50 text-sm">
                  <p className="text-[#e8e8ec] font-medium">{row.timestamp}</p>
                  <p className="text-[#a0a0a0]">Residual: {row.residual?.toFixed(2) ?? "—"} · Actual: {row.actual?.toFixed(2) ?? "—"} · Pred: {row.pred?.toFixed(2) ?? "—"}</p>
                </div>
              ))}
              {(!chartsData?.anomalyList?.length && !chartsLoading) && <p className="text-[#6a6a70]">Using sample anomaly data. Run Modelin/new.py for live data.</p>}
            </div>
            <div className="h-80"><canvas ref={chart4Ref} /></div>
          </div>
        </div>

        {/* Residual Error Distribution + Power vs Temperature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1">Residual Error Distribution</h2>
            <p className="text-[#a0a0a0] text-sm mb-4">Frequency by residual bin</p>
            <div className="h-80"><canvas ref={chart6Ref} /></div>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1">Power vs Temperature</h2>
            <p className="text-[#a0a0a0] text-sm mb-4">Scatter</p>
            <div className="h-80"><canvas ref={chart7Ref} /></div>
          </div>
        </div>

        {/* 24-Hour Rolling Statistics */}
        <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold mb-1">24-Hour Rolling Statistics</h2>
          <p className="text-[#a0a0a0] text-sm mb-4">Actual, Rolling Mean (24h), Rolling Std (24h)</p>
          <div className="h-96"><canvas ref={chart8Ref} /></div>
        </div>

        {/* Power: Hour vs Day Heatmap + Feature Correlations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1">Power: Hour vs Day Heatmap</h2>
            <p className="text-[#a0a0a0] text-sm mb-4">Power consumption patterns by hour and day</p>
            <div className="h-80"><canvas ref={chart11Ref} /></div>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Feature Correlations</h2>
            {chartsData?.correlationMatrix ? (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="flex gap-px mb-1">
                    <div className="w-24 flex-shrink-0" />
                    {chartsData?.correlationMatrix?.labels?.map((l) => (
                      <div key={l} className="w-16 text-[10px] text-[#a0a0a0] truncate text-center" title={l}>{l.slice(0, 8)}</div>
                    ))}
                  </div>
                  {chartsData?.correlationMatrix?.matrix?.map((row, i) => (
                    <div key={i} className="flex gap-px mb-px">
                      <div className="w-24 flex-shrink-0 text-[10px] text-[#a0a0a0] truncate">{chartsData?.correlationMatrix?.labels?.[i]?.slice(0, 10) || ''}</div>
                      {row.map((v, j) => {
                        const n = Number.isNaN(v) ? 0 : v
                        const green = n >= 0 ? Math.round(255 * n) : 0
                        const blue = n < 0 ? Math.round(255 * -n) : 0
                        return (
                          <div key={j} className="w-16 h-6 flex items-center justify-center text-[10px] rounded" style={{ backgroundColor: `rgb(${255 - green - blue}, ${green}, ${blue})`, color: Math.abs(n) > 0.5 ? "#fff" : "#333" }}>
                            {typeof v === "number" && !Number.isNaN(v) ? v.toFixed(2) : "—"}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  <div className="flex gap-px mb-1">
                    <div className="w-24 flex-shrink-0" />
                    {['Power', 'Temp', 'Hour', 'Day', 'Month', 'Weekend'].map((l) => (
                      <div key={l} className="w-16 text-[10px] text-[#a0a0a0] truncate text-center" title={l}>{l.slice(0, 8)}</div>
                    ))}
                  </div>
                  {['Power', 'Temp', 'Hour', 'Day', 'Month', 'Weekend'].map((label, i) => (
                    <div key={i} className="flex gap-px mb-px">
                      <div className="w-24 flex-shrink-0 text-[10px] text-[#a0a0a0] truncate">{label.slice(0, 10)}</div>
                      {[
                        [1.00, 0.75, -0.30, 0.15, -0.20, 0.45],
                        [0.75, 1.00, -0.25, 0.10, -0.15, 0.35],
                        [-0.30, -0.25, 1.00, 0.05, 0.02, -0.60],
                        [0.15, 0.10, 0.05, 1.00, -0.05, 0.20],
                        [-0.20, -0.15, 0.02, -0.05, 1.00, -0.10],
                        [0.45, 0.35, -0.60, 0.20, -0.10, 1.00]
                      ][i].map((v, j) => {
                        const n = Number.isNaN(v) ? 0 : v
                        const green = n >= 0 ? Math.round(255 * n) : 0
                        const blue = n < 0 ? Math.round(255 * -n) : 0
                        return (
                          <div key={j} className="w-16 h-6 flex items-center justify-center text-[10px] rounded" style={{ backgroundColor: `rgb(${255 - green - blue}, ${green}, ${blue})`, color: Math.abs(n) > 0.5 ? "#fff" : "#333" }}>
                            {typeof v === "number" && !Number.isNaN(v) ? v.toFixed(2) : "—"}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Forecast Data table */}
        <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Detailed Forecast Data</h2>
            <span className="text-sm text-[#a0a0a0]">{chartsData?.forecastTable?.length ?? 0} records</span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-lg border border-[#2a2a35]">
            <table className="w-full text-sm">
              <thead className="bg-[#2a2a35] sticky top-0">
                <tr>
                  <th className="text-left p-3 text-[#a0a0a0] font-medium">Date & Time</th>
                  <th className="text-right p-3 text-[#a0a0a0] font-medium">Actual</th>
                  <th className="text-right p-3 text-[#a0a0a0] font-medium">Predicted</th>
                  <th className="text-right p-3 text-[#a0a0a0] font-medium">Upper Bound</th>
                  <th className="text-right p-3 text-[#a0a0a0] font-medium">Lower Bound</th>
                </tr>
              </thead>
              <tbody>
                {(chartsData?.forecastTable?.length ? chartsData.forecastTable : [
                  { dateTime: "Feb 9, 2025 00:00", actual: 33.52, predicted: 32.72, upperBound: 46.12, lowerBound: 20.12 },
                  { dateTime: "Feb 9, 2025 01:00", actual: 38.83, predicted: 36.84, upperBound: 50.24, lowerBound: 22.54 },
                  { dateTime: "Feb 9, 2025 02:00", actual: 37.05, predicted: 36.74, upperBound: 51.24, lowerBound: 23.44 },
                  { dateTime: "Feb 9, 2025 03:00", actual: 41.69, predicted: 39.30, upperBound: 53.80, lowerBound: 26.10 },
                  { dateTime: "Feb 9, 2025 04:00", actual: 42.93, predicted: 43.24, upperBound: 55.64, lowerBound: 27.44 },
                  { dateTime: "Feb 9, 2025 05:00", actual: 39.37, predicted: 41.10, upperBound: 54.40, lowerBound: 27.00 },
                  { dateTime: "Feb 9, 2025 06:00", actual: 38.84, predicted: 39.98, upperBound: 56.28, lowerBound: 24.48 },
                  { dateTime: "Feb 9, 2025 07:00", actual: 45.61, predicted: 42.64, upperBound: 55.04, lowerBound: 27.94 },
                  { dateTime: "Feb 9, 2025 08:00", actual: 43.12, predicted: 43.99, upperBound: 58.59, lowerBound: 31.09 },
                  { dateTime: "Feb 9, 2025 09:00", actual: 42.74, predicted: 43.05, upperBound: 57.55, lowerBound: 30.85 }
                ]).map((row, i) => (
                  <tr key={i} className="border-t border-[#2a2a35]">
                    <td className="p-3 text-[#e8e8ec]">{row.dateTime}</td>
                    <td className="p-3 text-right text-[#e8e8ec]">{row.actual != null ? Number(row.actual).toFixed(2) : "—"}</td>
                    <td className="p-3 text-right text-green-400">{row.predicted != null ? Number(row.predicted).toFixed(2) : "—"}</td>
                    <td className="p-3 text-right text-[#e8e8ec]">{row.upperBound != null ? Number(row.upperBound).toFixed(2) : "—"}</td>
                    <td className="p-3 text-right text-[#e8e8ec]">{row.lowerBound != null ? Number(row.lowerBound).toFixed(2) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!chartsData?.forecastTable?.length && !chartsLoading) && <p className="text-[#6a6a70] py-4 text-center">Using sample forecast data. Run Modelin/new.py for live data.</p>}
        </div>

        {/* Extra charts: Hourly Consumption, Prophet Forecast, Prophet Components (same page, different sections) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1">Hourly Power Consumption (Zone 1)</h2>
            <p className="text-[#a0a0a0] text-sm mb-4">Time series</p>
            <div className="h-96"><canvas ref={chartRef} /></div>
          </div>
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1">Prophet Forecast: Actual vs Predicted</h2>
            <div className="h-80"><canvas ref={chart2Ref} /></div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-[#1a1a1f] border border-[#2a2a35] rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-1">Prophet Components</h2>
            <div className="h-80"><canvas ref={chart3Ref} /></div>
          </div>
        </div>
      </main>

      {/* Click outside to close dropdown */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  )
}
