import { useState, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  DoorClosed,
  Home,
  LogOut,
  Moon,
  Search,
  Shield,
  ShieldAlert,
  Siren,
} from "lucide-react";

const cameras = [
  {
    id: "front-door",
    name: "Front door camera",
    location: "Entrance",
    activity: "No motion detected",
    color: "bg-[#c9baaa]",
  },
  {
    id: "garden",
    name: "Garden camera",
    location: "Back garden",
    activity: "No motion detected",
    color: "bg-[#b9c4ac]",
  },
  {
    id: "garage",
    name: "Garage camera",
    location: "Driveway",
    activity: "Vehicle detected 18 min ago",
    color: "bg-[#aeb9c4]",
  },
];

const initialSensors = [
  {
    id: "front-door-sensor",
    name: "Front entrance",
    type: "door",
    room: "Entrance",
    status: "Closed",
    battery: "98%",
    isAlert: false,
  },
  {
    id: "patio-door-sensor",
    name: "Patio sliding door",
    type: "door",
    room: "Living room",
    status: "Closed",
    battery: "92%",
    isAlert: false,
  },
  {
    id: "garage-door-sensor",
    name: "Garage vehicle roll",
    type: "door",
    room: "Garage",
    status: "Closed",
    battery: "100%",
    isAlert: false,
  },
  {
    id: "living-window-sensor",
    name: "Living room window",
    type: "window",
    room: "Living room",
    status: "Closed",
    battery: "88%",
    isAlert: false,
  },
  {
    id: "bedroom-window-sensor",
    name: "Bedroom bay window",
    type: "window",
    room: "Master bedroom",
    status: "Closed",
    battery: "95%",
    isAlert: false,
  },
  {
    id: "kitchen-window-sensor",
    name: "Kitchen garden window",
    type: "window",
    room: "Kitchen",
    status: "Closed",
    battery: "84%",
    isAlert: false,
  },
  {
    id: "hallway-motion-sensor",
    name: "Hallway PIR sensor",
    type: "motion",
    room: "Hallway",
    status: "Clear",
    battery: "91%",
    isAlert: false,
  },
  {
    id: "driveway-motion-sensor",
    name: "Driveway beam sensor",
    type: "motion",
    room: "Driveway",
    status: "Detected",
    battery: "86%",
    isAlert: true,
  },
];

function getSensorIcon(type) {
  switch (type) {
    case "door":
      return DoorClosed;
    case "window":
      return Shield;
    case "motion":
    default:
      return Activity;
  }
}

const initialEvents = [
  { id: 1, time: "8:42 PM", text: "Front door locked", type: "Secure" },
  { id: 2, time: "7:16 PM", text: "Garage motion detected", type: "Activity" },
  { id: 3, time: "6:58 PM", text: "Garden camera online", type: "System" },
  { id: 4, time: "5:30 PM", text: "Keypad access granted (Master)", type: "Secure" },
  { id: 5, time: "4:12 PM", text: "Driveway vehicle arrived", type: "Activity" },
  { id: 6, time: "2:45 PM", text: "Firmware integrity verified", type: "System" },
  { id: 7, time: "1:20 PM", text: "Back garden perimeter clear", type: "Activity" },
  { id: 8, time: "11:05 AM", text: "Perimeter armed successfully", type: "Secure" },
];

const securityModes = [
  {
    id: "disarmed",
    name: "Disarmed",
    badge: "System disarmed",
    rule: "Monitoring inactive · Chime notifications only",
    icon: LogOut,
    statusClass:
      "border-amber-800/25 bg-amber-50 text-amber-800 dark:border-amber-400/25 dark:bg-amber-950 dark:text-amber-400",
  },
  {
    id: "home",
    name: "Home",
    badge: "Armed · Home",
    rule: "Perimeter armed · Interior motion sensors disabled",
    icon: Home,
    statusClass:
      "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    id: "away",
    name: "Away",
    badge: "Armed · Away",
    rule: "Full perimeter & interior motion armed · Siren active",
    icon: ShieldAlert,
    statusClass:
      "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400",
  },
  {
    id: "night",
    name: "Night",
    badge: "Armed · Night",
    rule: "Perimeter & ground floor motion armed · Upstairs quiet",
    icon: Moon,
    statusClass:
      "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400",
  },
];

const categories = ["All", "Secure", "Activity", "System"];

export default function SecurityPanel() {
  const [securityMode, setSecurityMode] = useState("home");
  const [isFrontDoorLocked, setIsFrontDoorLocked] = useState(true);
  const [isLockdownActive, setIsLockdownActive] = useState(false);
  const [isConfirmingLockdown, setIsConfirmingLockdown] = useState(false);
  const [selectedCameraId, setSelectedCameraId] = useState("front-door");
  const [sensors, setSensors] = useState(initialSensors);
  const [sensorFilter, setSensorFilter] = useState("all");
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const currentMode =
    securityModes.find((m) => m.id === securityMode) || securityModes[1];
  const CurrentModeIcon = currentMode.icon;

  const selectedCamera = cameras.find(
    (camera) => camera.id === selectedCameraId,
  );

  const handleModeChange = useCallback(
    (modeId) => {
      if (modeId === securityMode) return;
      setSecurityMode(modeId);

      const targetMode = securityModes.find((m) => m.id === modeId);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

      setEvents((prev) => [
        {
          id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1,
          time: timeStr,
          text: `Alert mode changed to ${targetMode ? targetMode.name : modeId}`,
          type: "Secure",
        },
        ...prev,
      ]);
    },
    [securityMode],
  );

  const toggleDoorLock = useCallback(() => {
    setIsFrontDoorLocked((current) => {
      const nextState = !current;

      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });

      setEvents((prev) => [
        {
          id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1,
          time: timeStr,
          text: nextState
            ? "Front door locked manually"
            : "Front door unlocked manually",
          type: "Secure",
        },
        ...prev,
      ]);

      return nextState;
    });
  }, []);

  const handleTriggerLockdown = useCallback(() => {
    setIsLockdownActive(true);
    setIsConfirmingLockdown(false);
    setIsFrontDoorLocked(true);
    setSecurityMode("away");

    // Secure all door sensors
    setSensors((prev) =>
      prev.map((s) => (s.type === "door" ? { ...s, status: "Closed", isAlert: false } : s)),
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    setEvents((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1,
        time: timeStr,
        text: "EMERGENCY: Whole-home lockdown initiated and doors secured",
        type: "Secure",
      },
      ...prev,
    ]);
  }, []);

  const handleResetLockdown = useCallback(() => {
    setIsLockdownActive(false);

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    setEvents((prev) => [
      {
        id: prev.length ? Math.max(...prev.map((e) => e.id)) + 1 : 1,
        time: timeStr,
        text: "Emergency lockdown reset by user",
        type: "System",
      },
      ...prev,
    ]);
  }, []);

  const toggleSensor = useCallback((sensorId) => {
    setSensors((prev) =>
      prev.map((s) => {
        if (s.id !== sensorId) return s;
        const willBeAlert = !s.isAlert;
        let newStatus;
        if (s.type === "motion") {
          newStatus = willBeAlert ? "Detected" : "Clear";
        } else {
          newStatus = willBeAlert ? "Open" : "Closed";
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });

        setEvents((eventsPrev) => [
          {
            id: eventsPrev.length
              ? Math.max(...eventsPrev.map((e) => e.id)) + 1
              : 1,
            time: timeStr,
            text: `${s.name} ${newStatus.toLowerCase()}`,
            type: willBeAlert ? "Activity" : "Secure",
          },
          ...eventsPrev,
        ]);

        return {
          ...s,
          status: newStatus,
          isAlert: willBeAlert,
        };
      }),
    );
  }, []);

  const filteredSensors = sensors.filter(
    (s) => sensorFilter === "all" || s.type === sensorFilter,
  );

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      activeFilter === "All" || event.type === activeFilter;
    const matchesSearch =
      event.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section>
      {/* Emergency Lockdown Banner */}
      {isLockdownActive && (
        <div className="mb-6 border border-red-700 bg-red-100/90 p-4 dark:border-red-600 dark:bg-red-950/80">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Siren className="h-6 w-6 shrink-0 animate-pulse text-red-700 dark:text-red-400" />
              <div>
                <h3 className="text-sm font-bold tracking-tight text-red-950 dark:text-red-100">
                  EMERGENCY WHOLE-HOME LOCKDOWN ACTIVE
                </h3>
                <p className="mt-0.5 text-xs text-red-800 dark:text-red-300">
                  All perimeter deadbolts engaged · Interior sirens sounding · Security monitoring alerted
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetLockdown}
              className="border border-red-800 bg-red-800 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-900 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Reset & Disarm Lockdown
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
            Home protection
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Security center
          </h2>
        </div>

        <div
          className={`flex items-center gap-2 border px-3 py-2 text-sm font-semibold ${currentMode.statusClass}`}
        >
          <CurrentModeIcon className="h-4 w-4" />
          <span>{currentMode.badge}</span>
        </div>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
          {/* Camera live preview */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {selectedCamera.name}
                </p>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {selectedCamera.location}
                </p>
              </div>

              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-700 dark:bg-emerald-500" />
                Live
              </span>
            </div>

            <div
              className={`mt-5 grid min-h-72 place-items-center border border-stone-300 dark:border-stone-700 ${selectedCamera.color}`}
            >
              <div className="text-center">
                <span className="mx-auto block h-12 w-16 border-4 border-stone-700/70 dark:border-stone-300/70" />
                <p className="mt-4 text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Camera feed preview
                </p>
                <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
                  {selectedCamera.activity}
                </p>
              </div>
            </div>
          </div>

          {/* Camera selection buttons */}
          <div className="grid gap-3 sm:grid-cols-3">
            {cameras.map((camera) => {
              const isSelected = camera.id === selectedCameraId;

              return (
                <button
                  key={camera.id}
                  type="button"
                  onClick={() => setSelectedCameraId(camera.id)}
                  className={`border p-4 text-left transition-colors duration-200 ${
                    isSelected
                      ? "border-stone-700 bg-stone-200 dark:border-stone-500 dark:bg-stone-700"
                      : "border-stone-300 bg-[#f7f4ed] hover:bg-stone-100 dark:border-stone-700 dark:bg-[#292524] dark:hover:bg-stone-800"
                  }`}
                >
                  <div className={`h-1.5 w-10 ${camera.color}`} />
                  <p className="mt-4 text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {camera.location}
                  </p>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                    {camera.activity}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Sensor status grid */}
          <div className="border border-stone-300 bg-[#f7f4ed] p-5 dark:border-stone-700 dark:bg-[#292524]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/80 pb-4 dark:border-stone-700/80">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400">
                  Perimeter telemetry
                </p>
                <h3 className="mt-0.5 text-base font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  Sensor network status
                </h3>
              </div>

              {/* Sensor Filter buttons */}
              <div className="flex flex-wrap gap-1">
                {["all", "door", "window", "motion"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSensorFilter(type)}
                    className={`border px-2.5 py-1 text-xs font-semibold capitalize transition-colors duration-200 ${
                      sensorFilter === type
                        ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                        : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                    }`}
                  >
                    {type === "all" ? "All sensors" : `${type}s`}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of sensors */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSensors.map((sensor) => {
                const SensorIcon = getSensorIcon(sensor.type);

                return (
                  <button
                    key={sensor.id}
                    type="button"
                    onClick={() => toggleSensor(sensor.id)}
                    className={`border p-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                      sensor.isAlert
                        ? "border-amber-600 bg-amber-50/60 dark:border-amber-500/60 dark:bg-amber-950/30"
                        : "border-stone-300 bg-white/70 hover:border-stone-400 dark:border-stone-700 dark:bg-[#1c1917]/70 dark:hover:border-stone-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <SensorIcon
                        className={`h-4 w-4 ${
                          sensor.isAlert
                            ? "text-amber-700 dark:text-amber-400"
                            : "text-stone-500 dark:text-stone-400"
                        }`}
                      />
                      <span
                        className={`border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          sensor.isAlert
                            ? "border-amber-800/30 bg-amber-100/70 text-amber-800 dark:border-amber-400/30 dark:bg-amber-900/60 dark:text-amber-300"
                            : "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400"
                        }`}
                      >
                        {sensor.status}
                      </span>
                    </div>

                    <p className="mt-3 truncate text-xs font-semibold text-stone-900 dark:text-stone-100">
                      {sensor.name}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span>{sensor.room}</span>
                      <span>Bat {sensor.battery}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-stone-500 dark:text-stone-400">
              Click any sensor to simulate open/detected trigger.
            </p>
          </div>
        </div>

        <aside className="border border-stone-300 bg-[#f5f1e8] p-5 dark:border-stone-700 dark:bg-[#231f1c]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
            Security controls
          </p>

          <div className="mt-5 space-y-4 border-y border-stone-300 py-5 dark:border-stone-700">
            {/* Alert Mode Selector */}
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Alert mode
                </p>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                  {currentMode.name}
                </span>
              </div>

              {/* 4 Mode Buttons */}
              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                {securityModes.map((mode) => {
                  const isModeActive = securityMode === mode.id;
                  const ModeIcon = mode.icon;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleModeChange(mode.id)}
                      className={`flex items-center gap-2 border px-2.5 py-2 text-xs font-semibold transition-colors duration-200 ${
                        isModeActive
                          ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                          : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                      }`}
                    >
                      <ModeIcon className="h-3.5 w-3.5 shrink-0" />
                      <span>{mode.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Policy Description */}
              <div className="mt-2.5 border border-stone-300 bg-white/70 p-2.5 dark:border-stone-700 dark:bg-[#1c1917]/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                  Active policy
                </p>
                <p className="mt-0.5 text-xs leading-normal text-stone-700 dark:text-stone-300">
                  {currentMode.rule}
                </p>
              </div>
            </div>

            {/* Front door lock */}
            <div className="flex items-center justify-between gap-4 border-t border-stone-200/80 pt-3 dark:border-stone-700/80">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Front door
                </p>
                <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                  Main entrance deadbolt
                </p>
              </div>

              <button
                type="button"
                onClick={toggleDoorLock}
                aria-pressed={isFrontDoorLocked}
                className={`min-w-20 border px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                  isFrontDoorLocked
                    ? "border-emerald-800/30 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950 dark:text-emerald-400"
                    : "border-amber-800/30 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-950 dark:text-amber-400"
                }`}
              >
                {isFrontDoorLocked ? "Locked" : "Unlocked"}
              </button>
            </div>

            {/* Emergency Panic Lockdown */}
            <div className="border-t border-stone-200/80 pt-3 dark:border-stone-700/80">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Emergency panic
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                    Instant whole-home lockdown
                  </p>
                </div>

                {!isLockdownActive && !isConfirmingLockdown && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingLockdown(true)}
                    className="flex items-center gap-1.5 border border-red-700 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-800 transition-colors hover:bg-red-100 dark:border-red-600 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/60"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Lockdown</span>
                  </button>
                )}

                {isLockdownActive && (
                  <span className="flex items-center gap-1 border border-red-700 bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800 dark:border-red-600 dark:bg-red-950 dark:text-red-300">
                    <Siren className="h-3.5 w-3.5 animate-pulse" />
                    Active
                  </span>
                )}
              </div>

              {isConfirmingLockdown && (
                <div className="mt-2.5 border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/60">
                  <p className="text-xs font-semibold text-red-900 dark:text-red-200">
                    Confirm emergency lockdown?
                  </p>
                  <p className="mt-1 text-[11px] text-red-700 dark:text-red-300">
                    Secures all doors and activates perimeter sirens.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTriggerLockdown}
                      className="border border-red-800 bg-red-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-700"
                    >
                      Confirm Lockdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsConfirmingLockdown(false)}
                      className="border border-stone-300 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
                Access log
              </p>
              <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
                {filteredEvents.length} events
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search log..."
                className="w-full border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-xs text-stone-900 placeholder-stone-400 focus:border-stone-600 focus:outline-none dark:border-stone-700 dark:bg-[#1c1917] dark:text-stone-100"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="mt-2.5 flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveFilter(cat)}
                  className={`border px-2 py-0.5 text-[11px] font-semibold transition-colors duration-200 ${
                    activeFilter === cat
                      ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                      : "border-stone-300 bg-transparent text-stone-600 hover:bg-stone-200/60 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <ol className="mt-4 max-h-60 space-y-3.5 overflow-y-auto pr-1">
              {filteredEvents.length === 0 ? (
                <p className="py-4 text-center text-xs text-stone-500 dark:text-stone-400">
                  No matching events found.
                </p>
              ) : (
                filteredEvents.map((event) => (
                  <li key={event.id} className="flex gap-2.5">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        event.type === "Secure"
                          ? "bg-emerald-600 dark:bg-emerald-400"
                          : event.type === "Activity"
                          ? "bg-amber-600 dark:bg-amber-400"
                          : "bg-stone-400 dark:bg-stone-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                        {event.text}
                      </p>
                      <p className="mt-0.5 text-[11px] text-stone-500 dark:text-stone-400">
                        {event.time} · {event.type}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}
