import { useState, useEffect } from "react";
import DashboardHeader from "./components/DashboardHeader";
import EnergyPanel from "./components/EnergyPanel";
import SecurityPanel from "./components/SecurityPanel";
import SmartHomeScene from "./components/SmartHomeScene";
import SmartScenes from "./components/SmartScenes";

export default function App() {
  const [activeSection, setActiveSection] = useState("overview");
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen bg-[#f2eee5] text-stone-900 dark:bg-[#1c1917] dark:text-stone-100 ${darkMode ? "dark" : ""}`}
    >
      <DashboardHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode((d) => !d)}
      />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-10">
        <div key={activeSection} className="animate-page-enter">
          {activeSection === "overview" && <SmartHomeScene darkMode={darkMode} />}

          {activeSection === "scenes" && <SmartScenes />}

          {activeSection === "security" && <SecurityPanel />}

          {activeSection === "energy" && <EnergyPanel />}
        </div>
      </main>
    </div>
  );
}