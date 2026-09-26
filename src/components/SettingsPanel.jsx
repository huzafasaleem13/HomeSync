import { useState } from "react";
import {
  Bell,
  Check,
  Download,
  Home,
  Moon,
  RefreshCw,
  Shield,
  Sliders,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";

export default function SettingsPanel({
  darkMode,
  onDarkModeToggle,
  onAddNotification,
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    homeName: "Alder House",
    residentName: "Elena Vance",
    email: "elena@alderhouse.internal",
    timezone: "America/Los_Angeles",
    matterBridge: "Matter Gateway v2.4 (Online)",
  });

  // System & Units state
  const [units, setUnits] = useState({
    temperature: "C",
    currency: "USD",
    clockFormat: "12h",
    audioFeedback: true,
  });

  // Notifications state
  const [notifyPrefs, setNotifyPrefs] = useState({
    securityIntrusion: true,
    energyThreshold: true,
    sceneExecution: false,
    lowBattery: true,
    dailyDigest: true,
  });

  // Display state
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Diagnostics state
  const [pingStatus, setPingStatus] = useState(null); // 'idle' | 'running' | 'done'
  const [pingResults, setPingResults] = useState(null);

  const handleProfileChange = (key, val) => {
    setProfile((prev) => ({ ...prev, [key]: val }));
  };

  const toggleNotify = (key) => {
    setNotifyPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveChanges = () => {
    setSavedSuccess(true);
    if (onAddNotification) {
      onAddNotification({
        id: Math.floor(Math.random() * 1000000),
        text: "System settings and preferences updated",
        type: "Settings",
        time: "Just now",
        read: false,
      });
    }
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRunDiagnostics = () => {
    setPingStatus("running");
    setTimeout(() => {
      setPingStatus("done");
      setPingResults({
        gateway: "11 ms (0% loss)",
        matterMesh: "8 ms (14 nodes active)",
        cloudSync: "34 ms (Encrypted TLS 1.3)",
      });
    }, 900);
  };

  const handleExportConfig = () => {
    const configData = {
      residence: profile,
      preferences: units,
      notifications: notifyPrefs,
      appearance: {
        darkMode,
        reducedMotion,
        highContrast,
      },
      exportedAt: new Date().toISOString(),
      systemVersion: "1.4.0-alder",
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alder-house-settings-${profile.homeName.toLowerCase().replace(/\s+/g, "-")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navTabs = [
    { id: "profile", label: "Residence & Profile", icon: Home },
    { id: "system", label: "Units & Formats", icon: Sliders },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Display & Theme", icon: Moon },
    { id: "diagnostics", label: "Diagnostics & Backup", icon: Wifi },
  ];

  return (
    <section>
      {/* Top Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            System configuration
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Settings & Preferences
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveChanges}
            className={`flex items-center gap-2 border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
              savedSuccess
                ? "border-emerald-800 bg-emerald-700 text-white dark:border-emerald-500 dark:bg-emerald-600"
                : "border-stone-700 bg-stone-800 text-stone-50 hover:bg-stone-700 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Saved successfully</span>
              </>
            ) : (
              <span>Save preferences</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation rail on left, content card on right */}
      <div className="mt-7 grid gap-6 md:grid-cols-[230px_minmax(0,1fr)]">
        {/* Navigation Tabs */}
        <nav aria-label="Settings categories" className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-3 border p-3 text-left text-xs font-semibold transition-colors duration-200 md:w-full ${
                  isActive
                    ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                    : "border-stone-300 bg-[#f7f4ed] text-stone-600 hover:bg-stone-200/70 dark:border-stone-700 dark:bg-[#292524] dark:text-stone-400 dark:hover:bg-stone-700/60"
                }`}
              >
                <TabIcon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content Panel */}
        <div className="border border-stone-300 bg-[#f7f4ed] p-6 dark:border-stone-700 dark:bg-[#292524]">
          {/* TAB 1: Residence & Profile */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Residence identity & account
                </h3>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Configure local household moniker and primary resident credentials.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="homeNameInput" className="block text-xs font-semibold uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
                    Home moniker
                  </label>
                  <input
                    id="homeNameInput"
                    type="text"
                    value={profile.homeName}
                    onChange={(e) => handleProfileChange("homeName", e.target.value)}
                    className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-stone-700 focus:outline-none dark:border-stone-600 dark:bg-[#1f1c1a] dark:text-stone-100"
                  />
                </div>

                <div>
                  <label htmlFor="residentNameInput" className="block text-xs font-semibold uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
                    Primary resident
                  </label>
                  <input
                    id="residentNameInput"
                    type="text"
                    value={profile.residentName}
                    onChange={(e) => handleProfileChange("residentName", e.target.value)}
                    className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-stone-700 focus:outline-none dark:border-stone-600 dark:bg-[#1f1c1a] dark:text-stone-100"
                  />
                </div>

                <div>
                  <label htmlFor="emailInput" className="block text-xs font-semibold uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
                    Alert dispatch email
                  </label>
                  <input
                    id="emailInput"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-stone-700 focus:outline-none dark:border-stone-600 dark:bg-[#1f1c1a] dark:text-stone-100"
                  />
                </div>

                <div>
                  <label htmlFor="timezoneInput" className="block text-xs font-semibold uppercase tracking-[0.1em] text-stone-500 dark:text-stone-400">
                    Astronomical timezone
                  </label>
                  <select
                    id="timezoneInput"
                    value={profile.timezone}
                    onChange={(e) => handleProfileChange("timezone", e.target.value)}
                    className="mt-1.5 w-full border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 transition-colors focus:border-stone-700 focus:outline-none dark:border-stone-600 dark:bg-[#1f1c1a] dark:text-stone-100"
                  >
                    <option value="America/Los_Angeles">Pacific Time (America/Los_Angeles)</option>
                    <option value="America/Denver">Mountain Time (America/Denver)</option>
                    <option value="America/Chicago">Central Time (America/Chicago)</option>
                    <option value="America/New_York">Eastern Time (America/New_York)</option>
                    <option value="Europe/London">Greenwich Mean Time (Europe/London)</option>
                    <option value="Europe/Paris">Central European Time (Europe/Paris)</option>
                    <option value="Asia/Tokyo">Japan Standard Time (Asia/Tokyo)</option>
                  </select>
                </div>
              </div>

              {/* Hardware Bridge Information */}
              <div className="border border-stone-300 bg-[#f3efe6] p-4 dark:border-stone-700 dark:bg-[#201d1b]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-stone-600 dark:text-stone-300" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        Local Hardware Gateway
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {profile.matterBridge} · IP: 192.168.1.1 (Static)
                      </p>
                    </div>
                  </div>
                  <span className="border border-emerald-800/30 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400">
                    Encrypted · TLS 1.3
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Units & Formats */}
          {activeTab === "system" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Measurement units & formatting
                </h3>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Global scales for temperatures, financial metrics, and clock representations.
                </p>
              </div>

              <div className="space-y-5 divide-y divide-stone-200 dark:divide-stone-700/80">
                {/* Temperature unit */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Temperature scale
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Used in climate controls, sensor telemetries, and weather displays.
                    </p>
                  </div>
                  <div className="flex border border-stone-300 dark:border-stone-600">
                    <button
                      type="button"
                      onClick={() => setUnits((u) => ({ ...u, temperature: "C" }))}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                        units.temperature === "C"
                          ? "bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900"
                          : "bg-transparent text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                      }`}
                    >
                      Celsius (°C)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnits((u) => ({ ...u, temperature: "F" }))}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                        units.temperature === "F"
                          ? "bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900"
                          : "bg-transparent text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                      }`}
                    >
                      Fahrenheit (°F)
                    </button>
                  </div>
                </div>

                {/* Currency format */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Default billing currency
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Applied across energy projections, solar ROI calculations, and invoices.
                    </p>
                  </div>
                  <div className="flex border border-stone-300 dark:border-stone-600">
                    {["USD", "EUR", "GBP"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setUnits((u) => ({ ...u, currency: c }))}
                        className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                          units.currency === c
                            ? "bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900"
                            : "bg-transparent text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                        }`}
                      >
                        {c === "USD" ? "$ USD" : c === "EUR" ? "€ EUR" : "£ GBP"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clock representation */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Clock display format
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Format rendered in the header and timestamped security logs.
                    </p>
                  </div>
                  <div className="flex border border-stone-300 dark:border-stone-600">
                    <button
                      type="button"
                      onClick={() => setUnits((u) => ({ ...u, clockFormat: "12h" }))}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                        units.clockFormat === "12h"
                          ? "bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900"
                          : "bg-transparent text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                      }`}
                    >
                      12-Hour (AM/PM)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnits((u) => ({ ...u, clockFormat: "24h" }))}
                      className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                        units.clockFormat === "24h"
                          ? "bg-stone-800 text-stone-50 dark:bg-stone-200 dark:text-stone-900"
                          : "bg-transparent text-stone-600 hover:bg-stone-200 dark:text-stone-400 dark:hover:bg-stone-700"
                      }`}
                    >
                      24-Hour (Military)
                    </button>
                  </div>
                </div>

                {/* Audio chime feedback */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Haptic / Audio feedback
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Subtle tactile chimes upon scene activation and security mode disarm.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUnits((u) => ({ ...u, audioFeedback: !u.audioFeedback }))}
                    className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors ${
                      units.audioFeedback
                        ? "border-emerald-800/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-stone-400 bg-white text-stone-600 dark:border-stone-600 dark:bg-[#1f1c1a] dark:text-stone-400"
                    }`}
                  >
                    {units.audioFeedback ? (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Enabled</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="h-3.5 w-3.5" />
                        <span>Muted</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Notification dispatch rules
                </h3>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Specify what events trigger notifications in the header and mobile relay.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "securityIntrusion",
                    title: "Security & intrusion alerts",
                    desc: "Urgent dispatch when perimeter sensors breach or lockdown triggers.",
                    critical: true,
                  },
                  {
                    id: "energyThreshold",
                    title: "Energy budget alerts",
                    desc: "Notify when monthly consumption exceeds 90% of target budget.",
                    critical: false,
                  },
                  {
                    id: "sceneExecution",
                    title: "Scene execution notices",
                    desc: "Confirmation banner when automated or scheduled scenes execute.",
                    critical: false,
                  },
                  {
                    id: "lowBattery",
                    title: "Hardware battery warnings",
                    desc: "Alert when wireless Zigbee sensors drop under 20% remaining battery.",
                    critical: false,
                  },
                  {
                    id: "dailyDigest",
                    title: "Morning briefing digest",
                    desc: "Daily 8:00 AM overview of overnight energy balance and weather.",
                    critical: false,
                  },
                ].map((item) => {
                  const isChecked = notifyPrefs[item.id];

                  return (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 border border-stone-200/90 bg-[#fbf9f4] p-3.5 dark:border-stone-700/60 dark:bg-[#201d1b]"
                    >
                      <div className="max-w-md">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            {item.title}
                          </p>
                          {item.critical && (
                            <span className="border border-rose-800/30 bg-rose-50 px-1.5 py-0.2 text-[9px] font-semibold uppercase text-rose-800 dark:border-rose-400/30 dark:bg-rose-950 dark:text-rose-400">
                              Priority
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                          {item.desc}
                        </p>
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        onClick={() => toggleNotify(item.id)}
                        className={`relative h-6 w-11 border transition-colors duration-200 focus:outline-none ${
                          isChecked
                            ? "border-stone-800 bg-stone-800 dark:border-stone-300 dark:bg-stone-200"
                            : "border-stone-400 bg-stone-200 dark:border-stone-600 dark:bg-stone-700"
                        }`}
                      >
                        <span
                          className={`block h-4 w-4 bg-white transition-transform duration-200 dark:bg-stone-900 ${
                            isChecked ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Display & Theme */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Visual display & theme
                </h3>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Tailor color tones, canvas contrast, and motion preferences.
                </p>
              </div>

              <div className="space-y-4">
                {/* Theme mode toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 border border-stone-200/90 bg-[#fbf9f4] p-4 dark:border-stone-700/60 dark:bg-[#201d1b]">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Color theme mode
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Current: {darkMode ? "Dark obsidian mode" : "Light limestone mode"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onDarkModeToggle}
                    className="flex items-center gap-2 border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-50 transition-colors hover:bg-stone-700 dark:border-stone-400 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
                  >
                    {darkMode ? (
                      <>
                        <Sun className="h-3.5 w-3.5" />
                        <span>Switch to Light mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-3.5 w-3.5" />
                        <span>Switch to Dark mode</span>
                      </>
                    )}
                  </button>
                </div>

                {/* High Contrast toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 border border-stone-200/90 bg-[#fbf9f4] p-4 dark:border-stone-700/60 dark:bg-[#201d1b]">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      High-contrast borders
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Enhances line contrast between cards and rooms for daylight clarity.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={highContrast}
                    onClick={() => setHighContrast((c) => !c)}
                    className={`relative h-6 w-11 border transition-colors duration-200 focus:outline-none ${
                      highContrast
                        ? "border-stone-800 bg-stone-800 dark:border-stone-300 dark:bg-stone-200"
                        : "border-stone-400 bg-stone-200 dark:border-stone-600 dark:bg-stone-700"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 bg-white transition-transform duration-200 dark:bg-stone-900 ${
                        highContrast ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Reduced motion toggle */}
                <div className="flex flex-wrap items-center justify-between gap-4 border border-stone-200/90 bg-[#fbf9f4] p-4 dark:border-stone-700/60 dark:bg-[#201d1b]">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Reduced motion
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Minimizes page entrance transitions and 3D camera sweeps.
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={reducedMotion}
                    onClick={() => setReducedMotion((m) => !m)}
                    className={`relative h-6 w-11 border transition-colors duration-200 focus:outline-none ${
                      reducedMotion
                        ? "border-stone-800 bg-stone-800 dark:border-stone-300 dark:bg-stone-200"
                        : "border-stone-400 bg-stone-200 dark:border-stone-600 dark:bg-stone-700"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 bg-white transition-transform duration-200 dark:bg-stone-900 ${
                        reducedMotion ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Diagnostics & Backup */}
          {activeTab === "diagnostics" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Hardware diagnostics & system backup
                </h3>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Inspect wireless mesh latencies and export household state backups.
                </p>
              </div>

              {/* Network ping diagnostics */}
              <div className="border border-stone-200/90 bg-[#fbf9f4] p-4 dark:border-stone-700/60 dark:bg-[#201d1b]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                      Local Matter / Zigbee connectivity test
                    </p>
                    <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                      Ping test across local hub, mesh nodes, and encrypted cloud sync.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleRunDiagnostics}
                    disabled={pingStatus === "running"}
                    className="flex items-center gap-1.5 border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-50 transition-colors hover:bg-stone-700 disabled:opacity-50 dark:border-stone-400 dark:bg-stone-200 dark:text-stone-900 dark:hover:bg-stone-300"
                  >
                    <RefreshCw className={`h-3 w-3 ${pingStatus === "running" ? "animate-spin" : ""}`} />
                    <span>{pingStatus === "running" ? "Testing link..." : "Run test"}</span>
                  </button>
                </div>

                {pingResults && (
                  <div className="mt-4 grid grid-cols-1 gap-2 border-t border-stone-200 pt-3 text-xs sm:grid-cols-3 dark:border-stone-700">
                    <div className="border border-stone-300 bg-white p-2.5 dark:border-stone-700 dark:bg-[#1a1816]">
                      <p className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Local gateway</p>
                      <p className="mt-1 font-semibold text-emerald-700 dark:text-emerald-400">{pingResults.gateway}</p>
                    </div>
                    <div className="border border-stone-300 bg-white p-2.5 dark:border-stone-700 dark:bg-[#1a1816]">
                      <p className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Matter mesh</p>
                      <p className="mt-1 font-semibold text-emerald-700 dark:text-emerald-400">{pingResults.matterMesh}</p>
                    </div>
                    <div className="border border-stone-300 bg-white p-2.5 dark:border-stone-700 dark:bg-[#1a1816]">
                      <p className="text-[10px] uppercase tracking-wider text-stone-500 dark:text-stone-400">Cloud relay</p>
                      <p className="mt-1 font-semibold text-emerald-700 dark:text-emerald-400">{pingResults.cloudSync}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Export backup JSON */}
              <div className="flex flex-wrap items-center justify-between gap-4 border border-stone-200/90 bg-[#fbf9f4] p-4 dark:border-stone-700/60 dark:bg-[#201d1b]">
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Export configuration backup
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Save all scenes, device names, sensor thresholds, and units to a JSON file.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportConfig}
                  className="flex items-center gap-1.5 border border-stone-400 bg-white px-3 py-1.5 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-200 dark:border-stone-600 dark:bg-[#1f1c1a] dark:text-stone-200 dark:hover:bg-stone-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>

              {/* Version & Build telemetry */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200/80 pt-3 text-xs text-stone-500 dark:text-stone-400">
                <span>Core firmware: v3.18.4 (Alder OS)</span>
                <span>Storage partition: 2.1 GB / 16 GB used</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
