import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "./components/DashboardHeader";
import EnergyPanel from "./components/EnergyPanel";
import SecurityPanel from "./components/SecurityPanel";
import SettingsPanel from "./components/SettingsPanel";
import SmartHomeScene from "./components/SmartHomeScene";
import SmartScenes from "./components/SmartScenes";

const initialNotifications = [
  { id: 1, text: "Front door locked", type: "Security", time: "8:42 PM", read: false },
  { id: 2, text: "Solar output peaked at 4.1 kW", type: "Energy", time: "3:42 PM", read: false },
  { id: 3, text: "Morning routine activated", type: "Scenes", time: "7:00 AM", read: false },
  { id: 4, text: "Battery fully charged", type: "Energy", time: "1:15 PM", read: true },
  { id: 5, text: "Garage motion detected", type: "Security", time: "7:16 PM", read: true },
];

export default function App() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["overview", "scenes", "security", "energy", "settings"].includes(tab)) {
        return tab;
      }
    }
    return "overview";
  });
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("dark") === "true") return true;
      if (params.get("dark") === "false") return false;
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const dismissNotification = useCallback((id) => {
    setNotifications((current) => current.filter((n) => n.id !== id));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((n) => ({ ...n, read: true })),
    );
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((current) => [notification, ...current]);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#f2eee5] text-stone-900 dark:bg-[#1c1917] dark:text-stone-100 ${darkMode ? "dark" : ""}`}
    >
      <DashboardHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode((d) => !d)}
        notifications={notifications}
        onDismissNotification={dismissNotification}
        onMarkAllRead={markAllRead}
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div key={activeSection} className="animate-page-enter">
          {activeSection === "overview" && <SmartHomeScene darkMode={darkMode} />}

          {activeSection === "scenes" && <SmartScenes />}

          {activeSection === "security" && <SecurityPanel />}

          {activeSection === "energy" && <EnergyPanel />}

          {activeSection === "settings" && (
            <SettingsPanel
              darkMode={darkMode}
              onDarkModeToggle={() => setDarkMode((d) => !d)}
              onAddNotification={addNotification}
            />
          )}
        </div>
      </main>
    </div>
  );
}