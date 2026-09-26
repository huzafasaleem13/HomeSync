import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Battery,
  CheckCircle2,
  Leaf,
  Minus,
  Plus,
  Sun,
  Target,
  TrendingDown,
  Zap,
} from "lucide-react";

const energyZones = [
  {
    id: "solar",
    name: "Solar panels",
    location: "Rooftop array",
    currentOutput: "3.2 kW",
    dailyGeneration: "18.4 kWh",
    status: "Generating",
    color: "bg-[#d8c5a8]",
    icon: Sun,
  },
  {
    id: "grid",
    name: "Grid supply",
    location: "Main meter",
    currentOutput: "1.8 kW",
    dailyGeneration: "12.6 kWh",
    status: "Connected",
    color: "bg-[#c9baaa]",
    icon: Zap,
  },
  {
    id: "battery",
    name: "Home battery",
    location: "Garage unit",
    currentOutput: "0.4 kW",
    dailyGeneration: "6.2 kWh",
    status: "Charging · 78%",
    color: "bg-[#b9c4ac]",
    icon: Battery,
  },
];

const chartData = {
  "24h": {
    label: "Hourly generation vs. consumption",
    totalConsumption: "24.6 kWh",
    solarGeneration: "18.4 kWh",
    peak: "4.1 kW at 2:00 PM",
    unit: "kW",
    points: [
      { label: "00:00", solar: 0, consumption: 0.8 },
      { label: "04:00", solar: 0, consumption: 0.6 },
      { label: "08:00", solar: 1.4, consumption: 2.1 },
      { label: "12:00", solar: 3.8, consumption: 2.8 },
      { label: "16:00", solar: 2.9, consumption: 2.4 },
      { label: "20:00", solar: 0.2, consumption: 3.2 },
    ],
  },
  "7d": {
    label: "Daily generation vs. consumption",
    totalConsumption: "168.2 kWh",
    solarGeneration: "124.5 kWh",
    peak: "28.4 kWh on Thursday",
    unit: "kWh",
    points: [
      { label: "Mon", solar: 16.2, consumption: 22.4 },
      { label: "Tue", solar: 18.0, consumption: 24.1 },
      { label: "Wed", solar: 14.5, consumption: 21.8 },
      { label: "Thu", solar: 20.1, consumption: 28.4 },
      { label: "Fri", solar: 19.4, consumption: 23.5 },
      { label: "Sat", solar: 17.8, consumption: 25.0 },
      { label: "Sun", solar: 18.5, consumption: 23.0 },
    ],
  },
  "30d": {
    label: "Weekly generation vs. consumption",
    totalConsumption: "712.4 kWh",
    solarGeneration: "528.0 kWh",
    peak: "192.1 kWh in Week 2",
    unit: "kWh",
    points: [
      { label: "W1", solar: 122.0, consumption: 174.2 },
      { label: "W2", solar: 145.2, consumption: 192.1 },
      { label: "W3", solar: 130.5, consumption: 171.8 },
      { label: "W4", solar: 130.3, consumption: 174.3 },
    ],
  },
};

const roomConsumption = [
  { id: "kitchen", name: "Kitchen", current: "1.2 kW", daily: "7.8 kWh", percentage: 38 },
  { id: "living", name: "Living room", current: "0.8 kW", daily: "5.2 kWh", percentage: 28 },
  { id: "bedroom", name: "Master bedroom", current: "0.3 kW", daily: "2.1 kWh", percentage: 12 },
  { id: "bathroom", name: "Bathroom", current: "0.2 kW", daily: "1.4 kWh", percentage: 8 },
  { id: "entrance", name: "Entrance", current: "0.1 kW", daily: "0.6 kWh", percentage: 4 },
];

const energyEvents = [
  { time: "3:42 PM", text: "Solar output peaked at 4.1 kW", type: "Generation" },
  { time: "1:15 PM", text: "Battery fully charged", type: "Storage" },
  { time: "9:30 AM", text: "Grid import started", type: "Grid" },
];

export default function EnergyPanel() {
  const [selectedZoneId, setSelectedZoneId] = useState("solar");
  const [ecoMode, setEcoMode] = useState(true);
  const [timeframe, setTimeframe] = useState("24h");
  const [monthlyBudgetGoal, setMonthlyBudgetGoal] = useState(350);

  // Budget calculations
  const currentMonthUsage = 218.4;
  const cycleDays = 30;
  const daysElapsed = 19;
  const daysRemaining = cycleDays - daysElapsed;
  const percentUsed = Math.min(100, Math.round((currentMonthUsage / monthlyBudgetGoal) * 100));
  const rawPercent = Math.round((currentMonthUsage / monthlyBudgetGoal) * 100);
  const remainingKwh = Math.max(0, monthlyBudgetGoal - currentMonthUsage);
  const projectedUsage = Math.round((currentMonthUsage / daysElapsed) * cycleDays);
  const dailyAllowance = remainingKwh > 0 ? (remainingKwh / daysRemaining).toFixed(1) : "0.0";
  const todayUsage = 5.4;
  const todayAllowanceRatio =
    remainingKwh > 0 ? Math.min(100, Math.round((todayUsage / (remainingKwh / daysRemaining)) * 100)) : 100;

  // Threshold status (green <75%, amber 75-90%, red >90%)
  const isBudgetWarning = percentUsed >= 75 && percentUsed < 90;
  const isBudgetExceeded = percentUsed >= 90;

  const budgetStatusBadge = isBudgetExceeded
    ? {
        label: "Budget alert",
        className:
          "border-rose-800/30 bg-rose-50 text-rose-800 dark:border-rose-400/30 dark:bg-rose-950 dark:text-rose-400",
        barClass: "bg-rose-600 dark:bg-rose-500",
        Icon: AlertTriangle,
      }
    : isBudgetWarning
      ? {
          label: "Approaching target",
          className:
            "border-amber-800/30 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-400",
          barClass: "bg-amber-600 dark:bg-amber-500",
          Icon: AlertTriangle,
        }
      : {
          label: "On track",
          className:
            "border-emerald-800/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400",
          barClass: "bg-emerald-600 dark:bg-emerald-500",
          Icon: CheckCircle2,
        };

  const handleAdjustBudget = (delta) => {
    setMonthlyBudgetGoal((prev) => Math.max(150, Math.min(800, prev + delta)));
  };

  const selectedZone = energyZones.find((zone) => zone.id === selectedZoneId);
  const currentChart = chartData[timeframe];
  const maxVal = Math.max(
    ...currentChart.points.map((p) => Math.max(p.solar, p.consumption)),
  ) * 1.15;

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Resource monitoring
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Energy management
          </h2>
        </div>

        <div
          className={`flex items-center gap-2 border px-3 py-2 text-sm font-semibold ${
            ecoMode
              ? "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400"
              : "border-stone-400 bg-[#f7f4ed] text-stone-600 dark:border-stone-600 dark:bg-[#292524] dark:text-stone-400"
          }`}
        >
          <Leaf className="h-3.5 w-3.5" />
          {ecoMode ? "Eco mode active" : "Eco mode off"}
        </div>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {/* Main zone status card */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <selectedZone.icon className="h-5 w-5 text-stone-700 dark:text-stone-300" />
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {selectedZone.name}
                  </p>
                  <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                    {selectedZone.location}
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-700 dark:bg-emerald-500" />
                {selectedZone.status}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-stone-300 pt-5 dark:border-stone-700">
              <div>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Current output
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {selectedZone.currentOutput}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Today&apos;s total
                </p>
                <p className="mt-1 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {selectedZone.dailyGeneration}
                </p>
              </div>
            </div>
          </div>

          {/* Zone selection buttons */}
          <div className="grid gap-3 sm:grid-cols-3">
            {energyZones.map((zone) => {
              const isSelected = zone.id === selectedZoneId;
              const ZoneIcon = zone.icon;

              return (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`border p-4 text-left transition-colors duration-200 ${
                    isSelected
                      ? "border-stone-700 bg-stone-200 dark:border-stone-500 dark:bg-stone-700"
                      : "border-stone-300 bg-[#f7f4ed] hover:bg-stone-100 dark:border-stone-700 dark:bg-[#292524] dark:hover:bg-stone-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`h-1.5 w-10 ${zone.color}`} />
                    <ZoneIcon className="h-3.5 w-3.5 text-stone-500 dark:text-stone-400" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {zone.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {zone.currentOutput}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Energy Usage & Generation Visual Chart */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-700/80">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-stone-500 dark:text-stone-400" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                    Energy analytics
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {currentChart.label}
                  </h3>
                </div>
              </div>

              {/* Timeframe selector tabs */}
              <div className="flex gap-1">
                {["24h", "7d", "30d"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeframe(t)}
                    className={`border px-3 py-1 text-xs font-semibold uppercase transition-colors duration-200 ${
                      timeframe === t
                        ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                        : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Legend */}
            <div className="mt-4 flex items-center justify-end gap-5 text-xs text-stone-600 dark:text-stone-400">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-stone-400 bg-[#d8c5a8] dark:border-stone-500 dark:bg-[#c5b9aa]" />
                Solar generated
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 border border-stone-600 bg-stone-700 dark:border-stone-400 dark:bg-stone-300" />
                Home consumption
              </span>
            </div>

            {/* Bar Chart Canvas */}
            <div className="mt-6 flex h-48 items-end gap-2 border-b border-stone-300 px-2 pb-2 dark:border-stone-700 sm:gap-6">
              {currentChart.points.map((point) => {
                const solarH = Math.max(4, Math.round((point.solar / maxVal) * 100));
                const consH = Math.max(4, Math.round((point.consumption / maxVal) * 100));

                return (
                  <div key={point.label} className="group relative flex h-full flex-1 flex-col items-center justify-end">
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-8 z-10 hidden whitespace-nowrap border border-stone-400 bg-[#f5f1e8] px-2 py-1 text-[10px] font-semibold text-stone-800 shadow-sm group-hover:block dark:border-stone-600 dark:bg-[#201d1b] dark:text-stone-200">
                      Solar: {point.solar} {currentChart.unit} · Use: {point.consumption} {currentChart.unit}
                    </div>

                    {/* Bars column with fixed height */}
                    <div className="flex h-36 w-full items-end justify-center gap-1.5 sm:gap-2.5">
                      {/* Solar bar */}
                      <div
                        className="w-3 sm:w-4 bg-[#d8c5a8] transition-all duration-300 dark:bg-[#d8c5a8]"
                        style={{
                          height: `${point.solar > 0 ? solarH : 2}%`,
                          minHeight: point.solar > 0 ? "4px" : "2px",
                          opacity: point.solar > 0 ? 1 : 0.35,
                        }}
                        title={`Solar: ${point.solar} ${currentChart.unit}`}
                      />
                      {/* Consumption bar */}
                      <div
                        className="w-3 sm:w-4 bg-stone-700 transition-all duration-300 dark:bg-stone-300"
                        style={{
                          height: `${point.consumption > 0 ? consH : 2}%`,
                          minHeight: point.consumption > 0 ? "4px" : "2px",
                        }}
                        title={`Consumption: ${point.consumption} ${currentChart.unit}`}
                      />
                    </div>

                    {/* X-axis label */}
                    <span className="mt-2 text-[11px] font-medium text-stone-500 dark:text-stone-400">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Timeframe stats summary footer */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-stone-200/80 pt-3 text-center dark:border-stone-700/80">
              <div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Total consumption</p>
                <p className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {currentChart.totalConsumption}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Solar generation</p>
                <p className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {currentChart.solarGeneration}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Peak interval</p>
                <p className="mt-0.5 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {currentChart.peak}
                </p>
              </div>
            </div>
          </div>

          {/* Energy Goals & Budgeting */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-700/80">
              <div className="flex items-center gap-2.5">
                <Target className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                    Energy goals & budget
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    Monthly consumption target
                  </h3>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${budgetStatusBadge.className}`}
              >
                <budgetStatusBadge.Icon className="h-3.5 w-3.5" />
                <span>
                  {budgetStatusBadge.label} · {rawPercent}%
                </span>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {/* Target Limit with +/- Adjuster */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-3 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Monthly target
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {monthlyBudgetGoal}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">kWh</span>
                </div>
                {/* Adjuster buttons */}
                <div className="mt-2.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleAdjustBudget(-25)}
                    disabled={monthlyBudgetGoal <= 150}
                    aria-label="Decrease target budget by 25 kWh"
                    className="flex h-6 flex-1 items-center justify-center border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-200 disabled:opacity-40 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustBudget(25)}
                    disabled={monthlyBudgetGoal >= 800}
                    aria-label="Increase target budget by 25 kWh"
                    className="flex h-6 flex-1 items-center justify-center border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-200 disabled:opacity-40 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Month to Date Usage */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-3 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Month to date
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {currentMonthUsage}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">kWh</span>
                </div>
                <p className="mt-2.5 text-[11px] text-stone-500 dark:text-stone-400">
                  Day {daysElapsed} of {cycleDays} ({daysRemaining}d left)
                </p>
              </div>

              {/* Remaining Allowance */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-3 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Remaining
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-1">
                  <span
                    className={`text-xl font-semibold tracking-tight ${
                      remainingKwh === 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-stone-900 dark:text-stone-100"
                    }`}
                  >
                    {remainingKwh.toFixed(1)}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">kWh</span>
                </div>
                <p className="mt-2.5 text-[11px] text-stone-500 dark:text-stone-400">
                  {Math.max(0, 100 - rawPercent)}% allowance left
                </p>
              </div>

              {/* Daily Target Allowance */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-3 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Daily allowance
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-1">
                  <span className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    {dailyAllowance}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400">kWh/d</span>
                </div>
                <p className="mt-2.5 text-[11px] text-stone-500 dark:text-stone-400">
                  Today: {todayUsage} kWh ({todayAllowanceRatio}%)
                </p>
              </div>
            </div>

            {/* Visual Progress Bar Section */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-400">
                <span>
                  Usage progress: {currentMonthUsage} / {monthlyBudgetGoal} kWh
                </span>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {rawPercent}%
                </span>
              </div>

              {/* Main Progress Bar */}
              <div className="relative mt-2 h-3.5 w-full bg-stone-200 dark:bg-stone-700">
                <div
                  className={`h-full transition-all duration-500 ${budgetStatusBadge.barClass}`}
                  style={{ width: `${percentUsed}%` }}
                />
                {/* Milestone tick marks at 25%, 50%, 75% */}
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#f7f4ed] dark:bg-[#292524]"
                    style={{ left: "25%" }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#f7f4ed] dark:bg-[#292524]"
                    style={{ left: "50%" }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#f7f4ed] dark:bg-[#292524]"
                    style={{ left: "75%" }}
                  />
                </div>
              </div>

              {/* Scale Milestones */}
              <div className="mt-1.5 flex justify-between text-[10px] text-stone-500 dark:text-stone-400">
                <span>0 kWh</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100% ({monthlyBudgetGoal} kWh)</span>
              </div>
            </div>

            {/* Target Presets & Forecast */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/80 pt-4 dark:border-stone-700/80">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Target presets:
                </span>
                {[250, 300, 350, 400, 500].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyBudgetGoal(preset)}
                    className={`border px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
                      monthlyBudgetGoal === preset
                        ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                        : "border-stone-300 bg-white text-stone-600 hover:bg-stone-200/70 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-400 dark:hover:bg-stone-700"
                    }`}
                  >
                    {preset} kWh
                  </button>
                ))}
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400">
                Forecast: Projected ~
                <strong className="text-stone-800 dark:text-stone-200">
                  {projectedUsage} kWh
                </strong>{" "}
                by month-end (
                {projectedUsage <= monthlyBudgetGoal
                  ? `${monthlyBudgetGoal - projectedUsage} kWh under`
                  : `${projectedUsage - monthlyBudgetGoal} kWh over`}
                )
              </p>
            </div>
          </div>

          {/* Consumption by room */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Consumption by room
            </p>

            <div className="mt-5 space-y-4">
              {roomConsumption.map((room) => (
                <div key={room.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {room.name}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400">{room.current}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-stone-200 dark:bg-stone-700">
                    <div
                      className="h-full bg-stone-600 transition-all duration-500 dark:bg-stone-400"
                      style={{ width: `${room.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="border border-stone-300 bg-[#f5f1e8] p-5 dark:border-stone-700 dark:bg-[#231f1c]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
            Energy controls
          </p>

          <div className="mt-5 space-y-3 border-y border-stone-300 py-5 dark:border-stone-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Eco mode
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Optimize consumption
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEcoMode((current) => !current)}
                aria-pressed={ecoMode}
                className={`min-w-20 border px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                  ecoMode
                    ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                    : "border-stone-400 text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                }`}
              >
                {ecoMode ? "Active" : "Inactive"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Grid import
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  External supply
                </p>
              </div>

              <span className="border border-emerald-800/30 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400">
                Low
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-b border-stone-300 pb-5 dark:border-stone-700">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Today&apos;s summary
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500 dark:text-stone-400">Total consumption</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">5.4 kW</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500 dark:text-stone-400">Solar generation</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">3.2 kW</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500 dark:text-stone-400">Self-sufficiency</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">59%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                  <TrendingDown className="h-3.5 w-3.5" />
                  vs. yesterday
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">−12%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500 dark:text-stone-400">Monthly budget</span>
                <span
                  className={`font-semibold ${
                    isBudgetExceeded
                      ? "text-rose-600 dark:text-rose-400"
                      : isBudgetWarning
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-emerald-700 dark:text-emerald-400"
                  }`}
                >
                  {rawPercent}% used
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Recent events
            </p>

            <ol className="mt-4 space-y-4">
              {energyEvents.map((event) => (
                <li key={`${event.time}-${event.text}`} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-stone-500 dark:bg-stone-400" />
                  <div>
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                      {event.text}
                    </p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      {event.time} · {event.type}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
