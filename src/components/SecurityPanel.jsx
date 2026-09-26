import { useState } from "react";
import { Search } from "lucide-react";

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

const categories = ["All", "Secure", "Activity", "System"];

export default function SecurityPanel() {
  const [isHomeArmed, setIsHomeArmed] = useState(true);
  const [isFrontDoorLocked, setIsFrontDoorLocked] = useState(true);
  const [selectedCameraId, setSelectedCameraId] = useState("front-door");
  const [events, setEvents] = useState(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const selectedCamera = cameras.find(
    (camera) => camera.id === selectedCameraId,
  );

  const toggleArmSystem = () => {
    const nextState = !isHomeArmed;
    setIsHomeArmed(nextState);

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const newEvent = {
      id: Date.now(),
      time: timeStr,
      text: nextState ? "System armed by user" : "System disarmed by user",
      type: "Secure",
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

  const toggleDoorLock = () => {
    const nextState = !isFrontDoorLocked;
    setIsFrontDoorLocked(nextState);

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const newEvent = {
      id: Date.now(),
      time: timeStr,
      text: nextState ? "Front door locked manually" : "Front door unlocked manually",
      type: "Secure",
    };

    setEvents((prev) => [newEvent, ...prev]);
  };

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
          className={`border px-3 py-2 text-sm font-semibold ${
            isHomeArmed
              ? "border-emerald-800/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950 dark:text-emerald-400"
              : "border-amber-800/25 bg-amber-50 text-amber-800 dark:border-amber-400/25 dark:bg-amber-950 dark:text-amber-400"
          }`}
        >
          {isHomeArmed ? "System armed" : "System disarmed"}
        </div>
      </div>

      <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-5">
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
        </div>

        <aside className="border border-stone-300 bg-[#f5f1e8] p-5 dark:border-stone-700 dark:bg-[#231f1c]">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
            Security controls
          </p>

          <div className="mt-5 space-y-3 border-y border-stone-300 py-5 dark:border-stone-700">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Home monitoring
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Motion and access alerts
                </p>
              </div>

              <button
                type="button"
                onClick={toggleArmSystem}
                aria-pressed={isHomeArmed}
                className={`min-w-20 border px-3 py-2 text-xs font-semibold transition-colors duration-200 ${
                  isHomeArmed
                    ? "border-stone-700 bg-stone-800 text-stone-50 dark:border-stone-500 dark:bg-stone-200 dark:text-stone-900"
                    : "border-stone-400 text-stone-700 hover:bg-stone-200 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
                }`}
              >
                {isHomeArmed ? "Armed" : "Disarmed"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 pt-2">
              <div>
                <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Front door
                </p>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Main entrance lock
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
