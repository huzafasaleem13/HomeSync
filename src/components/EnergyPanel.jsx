import { useState } from "react";
import {
  AirVent,
  AlertTriangle,
  BarChart3,
  Battery,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Droplets,
  Layers,
  Leaf,
  Lightbulb,
  Minus,
  PiggyBank,
  Plus,
  Receipt,
  Sun,
  Target,
  TrendingDown,
  Tv,
  UtensilsCrossed,
  Waves,
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

const initialAppliances = [
  {
    id: "hvac",
    name: "Central HVAC & Heat Pump",
    model: "Daikin Inverter VRV",
    category: "Climate",
    currentKw: 1.45,
    todayKwh: 8.2,
    percentage: 33,
    status: "Active",
    statusDetail: "Cooling to 21.5°C · Inverter 42%",
    peakDraw: "2.8 kW at 2:30 PM",
    ecoOptimized: true,
    icon: AirVent,
  },
  {
    id: "ev",
    name: "EV Fast Charger",
    model: "Wallbox Gen 3 (32A)",
    category: "Mobility",
    currentKw: 1.80,
    todayKwh: 5.1,
    percentage: 21,
    status: "Active",
    statusDetail: "Charging vehicle · 68% battery",
    peakDraw: "7.2 kW at 1:10 AM",
    ecoOptimized: true,
    icon: Car,
  },
  {
    id: "water_heater",
    name: "Hybrid Water Heater",
    model: "ProTerra Heat Pump 80G",
    category: "Water",
    currentKw: 0.85,
    todayKwh: 4.6,
    percentage: 19,
    status: "Active",
    statusDetail: "Heat pump mode · Tank at 54°C",
    peakDraw: "2.1 kW at 7:45 AM",
    ecoOptimized: true,
    icon: Droplets,
  },
  {
    id: "kitchen",
    name: "Induction Range & Oven",
    model: "Miele Smart Induction",
    category: "Kitchen",
    currentKw: 0.60,
    todayKwh: 2.9,
    percentage: 12,
    status: "Standby",
    statusDetail: "Zone 2 simmer & clock active",
    peakDraw: "3.4 kW at 12:15 PM",
    ecoOptimized: false,
    icon: UtensilsCrossed,
  },
  {
    id: "laundry",
    name: "Smart Washer & Dryer",
    model: "Bosch Serie 8 Heat Pump",
    category: "Utility",
    currentKw: 0.40,
    todayKwh: 2.2,
    percentage: 9,
    status: "Standby",
    statusDetail: "Cycle finished · Idle standby",
    peakDraw: "1.9 kW at 10:20 AM",
    ecoOptimized: true,
    icon: Waves,
  },
  {
    id: "lighting",
    name: "Architectural LED Circuits",
    model: "Lutron Caséta Dimmers",
    category: "Lighting",
    currentKw: 0.18,
    todayKwh: 1.0,
    percentage: 4,
    status: "Active",
    statusDetail: "5 zones dimmed at 65%",
    peakDraw: "0.32 kW at 8:00 PM",
    ecoOptimized: true,
    icon: Lightbulb,
  },
  {
    id: "entertainment",
    name: "AV Center & Network Mesh",
    model: "Sony OLED + UniFi PoE Gateway",
    category: "Media",
    currentKw: 0.12,
    todayKwh: 0.6,
    percentage: 2,
    status: "Active",
    statusDetail: "Main switch & media server on",
    peakDraw: "0.28 kW at 9:15 PM",
    ecoOptimized: false,
    icon: Tv,
  },
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

  // Appliance sub-metering state
  const [appliances, setAppliances] = useState(initialAppliances);
  const [applianceCategory, setApplianceCategory] = useState("All");
  const [applianceSortBy, setApplianceSortBy] = useState("usage");
  const [expandedApplianceId, setExpandedApplianceId] = useState(null);

  const toggleApplianceEco = (id) => {
    setAppliances((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ecoOptimized: !app.ecoOptimized } : app)),
    );
  };

  const filteredAppliances = appliances
    .filter((app) => applianceCategory === "All" || app.category === applianceCategory)
    .sort((a, b) => {
      if (applianceSortBy === "usage") return b.todayKwh - a.todayKwh;
      if (applianceSortBy === "power") return b.currentKw - a.currentKw;
      return a.name.localeCompare(b.name);
    });

  const totalApplianceKw = appliances.reduce((sum, a) => sum + a.currentKw, 0).toFixed(2);
  const totalApplianceKwh = appliances.reduce((sum, a) => sum + a.todayKwh, 0).toFixed(1);
  const ecoOptimizedCount = appliances.filter((a) => a.ecoOptimized).length;

  // Financial telemetry state
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [electricityRate, setElectricityRate] = useState(0.18); // Base rate in USD per kWh

  const currencyConfig = {
    USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
    EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
    GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  };

  const tariffPresets = [
    { label: "Off-Peak", rate: 0.11 },
    { label: "Eco Green", rate: 0.15 },
    { label: "Standard", rate: 0.18 },
    { label: "Peak TOU", rate: 0.28 },
  ];

  const curr = currencyConfig[currencyCode];
  const activeRate = electricityRate * curr.rate;
  const fmt = (val) => `${curr.symbol}${val.toFixed(2)}`;

  // Today's financials
  const todayGridKwh = 6.2;
  const todaySolarKwh = 18.4;
  const todaySolarSavings = todaySolarKwh * activeRate;
  const todayNetCost = todayGridKwh * activeRate;

  // Monthly financials
  const monthSolarKwh = 528.0;
  const monthSolarSavings = monthSolarKwh * activeRate;
  const projectedMonthGrossCost = projectedUsage * activeRate;
  const projectedMonthNetCost = projectedUsage * 0.38 * activeRate;
  const projectedMonthSavings = projectedMonthGrossCost - projectedMonthNetCost;
  const monthCo2SavedKg = Math.round(monthSolarKwh * 0.385);

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

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] items-start">
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

          {/* Appliance-Level Consumption Breakdown */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-700/80">
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                    Sub-metering
                  </p>
                  <h3 className="mt-0.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    Appliance-level consumption
                  </h3>
                </div>
              </div>

              {/* Live Aggregate Draw Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Live draw:
                </span>
                <span className="border border-stone-300 bg-[#fbf9f4] px-2.5 py-1 text-xs font-semibold text-stone-800 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200">
                  {totalApplianceKw} kW active
                </span>
              </div>
            </div>

            {/* Filter and Sort Toolbar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {["All", "Climate", "Mobility", "Water", "Kitchen", "Utility", "Lighting", "Media"].map(
                  (cat) => {
                    const count =
                      cat === "All"
                        ? appliances.length
                        : appliances.filter((a) => a.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setApplianceCategory(cat)}
                        className={`border px-2.5 py-1 text-xs font-semibold transition-colors duration-200 ${
                          applianceCategory === cat
                            ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                            : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  },
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <span className="text-[11px] font-medium uppercase tracking-[0.08em]">Sort:</span>
                {[
                  { id: "usage", label: "Usage" },
                  { id: "power", label: "Power" },
                  { id: "name", label: "Name" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setApplianceSortBy(s.id)}
                    className={`border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      applianceSortBy === s.id
                        ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                        : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/50 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/50"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Appliances List */}
            <div className="mt-4 space-y-2.5">
              {filteredAppliances.map((appliance) => {
                const isExpanded = expandedApplianceId === appliance.id;
                const ApplianceIcon = appliance.icon;
                const isActive = appliance.status === "Active";

                return (
                  <div
                    key={appliance.id}
                    className="border border-stone-200/90 bg-[#fcfaf5] transition-colors dark:border-stone-700/70 dark:bg-[#201d1b]"
                  >
                    {/* Main Row */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-stone-300 bg-[#f5f1e8] dark:border-stone-600 dark:bg-[#292524]">
                          <ApplianceIcon className="h-4 w-4 text-stone-700 dark:text-stone-300" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                              {appliance.name}
                            </h4>
                            <span
                              className={`flex items-center gap-1 border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                isActive
                                  ? "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400"
                                  : "border-stone-300 bg-stone-100 text-stone-600 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isActive
                                    ? "bg-emerald-600 dark:bg-emerald-400"
                                    : "bg-stone-400 dark:bg-stone-500"
                                }`}
                              />
                              {appliance.status}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                            {appliance.model} · {appliance.category}
                          </p>
                        </div>
                      </div>

                      {/* Power & Energy Metrics */}
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {appliance.currentKw.toFixed(2)} kW
                          </p>
                          <p className="text-xs text-stone-500 dark:text-stone-400">
                            {appliance.todayKwh.toFixed(1)} kWh ({appliance.percentage}%)
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setExpandedApplianceId(isExpanded ? null : appliance.id)
                          }
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${appliance.name} details`}
                          className="flex h-7 w-7 items-center justify-center border border-stone-300 bg-stone-100 text-stone-600 transition hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar of Consumption Share */}
                    <div className="px-3 pb-3">
                      <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700">
                        <div
                          className="h-full bg-stone-600 transition-all duration-500 dark:bg-stone-400"
                          style={{ width: `${appliance.percentage * 2.5}%` }}
                        />
                      </div>
                    </div>

                    {/* Expanded Drawer Telemetry */}
                    {isExpanded && (
                      <div className="border-t border-stone-200 bg-[#f7f4ed]/80 px-4 py-3 dark:border-stone-700/60 dark:bg-[#1a1816]/70">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                              Current telemetry
                            </p>
                            <p className="mt-0.5 text-xs text-stone-800 dark:text-stone-200">
                              {appliance.statusDetail}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                              Peak demand today
                            </p>
                            <p className="mt-0.5 text-xs text-stone-800 dark:text-stone-200">
                              {appliance.peakDraw}
                            </p>
                          </div>
                          <div className="flex items-center justify-start sm:justify-end">
                            <button
                              type="button"
                              onClick={() => toggleApplianceEco(appliance.id)}
                              className={`flex items-center gap-1.5 border px-2.5 py-1 text-xs font-semibold transition-colors ${
                                appliance.ecoOptimized
                                  ? "border-emerald-800/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400"
                                  : "border-stone-400 bg-white text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300"
                              }`}
                            >
                              <Leaf className="h-3 w-3" />
                              <span>
                                {appliance.ecoOptimized ? "Eco optimized" : "Eco standard"}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Summary Footer */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-3 text-xs text-stone-500 dark:text-stone-400">
              <span>
                {filteredAppliances.length} of {appliances.length} appliances displayed
              </span>
              <span>
                Total tracked:{" "}
                <strong className="text-stone-800 dark:text-stone-200">
                  {totalApplianceKwh} kWh
                </strong>{" "}
                ({ecoOptimizedCount} of {appliances.length} eco-optimized)
              </span>
            </div>
          </div>

        </div>

        {/* Sidebar Column */}
        <aside className="space-y-5">
          {/* Card 1: Energy Controls & Today's Summary */}
          <div className="border border-stone-300 bg-[#f5f1e8] p-5 dark:border-stone-700 dark:bg-[#231f1c]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Energy controls
            </p>

            <div className="mt-4 space-y-3 border-y border-stone-300 py-4 dark:border-stone-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Eco mode
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Optimize consumption
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEcoMode((current) => !current)}
                  aria-pressed={ecoMode}
                  className={`min-w-20 border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                    ecoMode
                      ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                      : "border-stone-400 text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                  }`}
                >
                  {ecoMode ? "Active" : "Inactive"}
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Grid import
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    External supply
                  </p>
                </div>

                <span className="border border-emerald-800/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400">
                  Low
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                Today&apos;s summary
              </p>

              <div className="space-y-2.5">
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

                <div className="flex items-center justify-between border-t border-stone-300 pt-2 text-sm dark:border-stone-700">
                  <span className="text-stone-500 dark:text-stone-400">Cost today</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {fmt(todayNetCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Solar savings today</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    +{fmt(todaySolarSavings)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Cost Estimation & Solar Savings Card */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-3 dark:border-stone-700/80">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                    Financial analytics
                  </p>
                  <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                    Cost & solar savings
                  </h3>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-1">
                {["USD", "EUR", "GBP"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCurrencyCode(code)}
                    className={`border px-1.5 py-0.5 text-[11px] font-semibold transition-colors duration-200 ${
                      currencyCode === code
                        ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                        : "border-stone-300 bg-white text-stone-600 hover:bg-stone-200/70 dark:border-stone-700 dark:bg-stone-800/80 dark:text-stone-400 dark:hover:bg-stone-700"
                    }`}
                  >
                    {currencyConfig[code].symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Tariff Selector & Rate Adjuster */}
            <div className="mt-3.5 space-y-2 border-b border-stone-200/80 pb-3.5 dark:border-stone-700/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Utility tariff:
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {curr.symbol}{activeRate.toFixed(3)}/kWh
                  </span>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        setElectricityRate((prev) => Math.max(0.05, +(prev - 0.01).toFixed(2)))
                      }
                      aria-label="Decrease tariff rate"
                      className="flex h-5 w-5 items-center justify-center border border-stone-300 bg-white text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                    >
                      <Minus className="h-2.5 w-2.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setElectricityRate((prev) => Math.min(0.60, +(prev + 0.01).toFixed(2)))
                      }
                      aria-label="Increase tariff rate"
                      className="flex h-5 w-5 items-center justify-center border border-stone-300 bg-white text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                    >
                      <Plus className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {tariffPresets.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setElectricityRate(t.rate)}
                    className={`border px-1.5 py-1 text-center text-[10px] font-semibold transition-colors duration-200 ${
                      Math.abs(electricityRate - t.rate) < 0.001
                        ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                        : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                    }`}
                  >
                    {t.label} ({curr.symbol}{(t.rate * curr.rate).toFixed(2)})
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Overview 4-Metric Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {/* Today's Estimated Cost */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-2.5 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Today&apos;s cost
                </p>
                <p className="mt-0.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {fmt(todayNetCost)}
                </p>
                <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                  Import: {todayGridKwh} kWh
                </p>
              </div>

              {/* Today's Solar Savings */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-2.5 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Today&apos;s solar
                </p>
                <p className="mt-0.5 text-base font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
                  +{fmt(todaySolarSavings)}
                </p>
                <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                  Solar: {todaySolarKwh} kWh
                </p>
              </div>

              {/* Month-End Projected Bill */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-2.5 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Projected bill
                </p>
                <p className="mt-0.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {fmt(projectedMonthNetCost)}
                </p>
                <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                  Gross: {fmt(projectedMonthGrossCost)}
                </p>
              </div>

              {/* Month-to-Date Solar Savings */}
              <div className="border border-stone-200 bg-[#fbf9f4] p-2.5 dark:border-stone-700/60 dark:bg-[#211e1c]">
                <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-stone-500 dark:text-stone-400">
                  Month savings
                </p>
                <p className="mt-0.5 text-base font-semibold tracking-tight text-emerald-700 dark:text-emerald-400">
                  +{fmt(monthSolarSavings)}
                </p>
                <p className="mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                  Offset: {monthSolarKwh} kWh
                </p>
              </div>
            </div>

            {/* Net Energy Balance Visual Comparison */}
            <div className="mt-3.5 border border-stone-200 bg-[#fbf9f4] p-3 dark:border-stone-700/60 dark:bg-[#211e1c]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200">
                  Gross energy balance
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                  <PiggyBank className="h-3 w-3" />
                  Saving 62%
                </span>
              </div>

              <div className="mt-2 flex h-3 w-full overflow-hidden border border-stone-300 dark:border-stone-600">
                <div
                  className="bg-emerald-700 transition-all duration-500 dark:bg-emerald-600"
                  style={{ width: "62%" }}
                  title={`Solar offset: 62% (${fmt(projectedMonthSavings)})`}
                />
                <div
                  className="bg-stone-500 transition-all duration-500 dark:bg-stone-400"
                  style={{ width: "38%" }}
                  title={`Net grid bill: 38% (${fmt(projectedMonthNetCost)})`}
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between text-[10px] text-stone-500 dark:text-stone-400">
                <span>Solar: {fmt(projectedMonthSavings)}</span>
                <span>Net: {fmt(projectedMonthNetCost)}</span>
                <span>CO₂ offset: <strong>{monthCo2SavedKg} kg</strong></span>
              </div>
            </div>
          </div>

          {/* Card 3: Consumption by room */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Consumption by room
            </p>

            <div className="mt-4 space-y-3.5">
              {roomConsumption.map((room) => (
                <div key={room.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-800 dark:text-stone-200">
                      {room.name}
                    </span>
                    <span className="text-stone-500 dark:text-stone-400">{room.current}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full bg-stone-200 dark:bg-stone-700">
                    <div
                      className="h-full bg-stone-600 transition-all duration-500 dark:bg-stone-400"
                      style={{ width: `${room.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Recent events */}
          <div className="border border-stone-300 bg-[#f5f1e8] p-5 dark:border-stone-700 dark:bg-[#231f1c]">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Recent events
            </p>

            <ol className="mt-4 space-y-3.5">
              {energyEvents.map((event) => (
                <li key={`${event.time}-${event.text}`} className="flex gap-2.5">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-stone-500 dark:bg-stone-400" />
                  <div>
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      {event.text}
                    </p>
                    <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
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
