import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";

const navigationItems = [
  { id: "overview", label: "3D Home" },
  { id: "scenes", label: "Scenes" },
  { id: "security", label: "Security" },
  { id: "energy", label: "Energy" },
];

export default function DashboardHeader({
  activeSection,
  onSectionChange,
  darkMode,
  onDarkModeToggle,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleSectionChange(sectionId) {
    onSectionChange(sectionId);
    setIsMenuOpen(false);
  }

  return (
    <header className="border-b border-stone-300 bg-[#f2eee5] dark:border-stone-700 dark:bg-[#1c1917]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-5 py-5 lg:px-10">
        <button
          type="button"
          onClick={() => handleSectionChange("overview")}
          className="text-left"
          aria-label="Go to 3D home overview"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
            Residence control
          </p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            Alder House
          </h1>
        </button>

        {/* Desktop navigation */}
        <nav
          className="order-3 hidden w-full gap-1 border-t border-stone-300 pt-4 sm:order-2 sm:flex sm:w-auto sm:border-0 sm:pt-0 dark:border-stone-700"
          aria-label="Primary navigation"
        >
          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSectionChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-stone-900 dark:text-stone-100"
                    : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
                }`}
              >
                {item.label}

                {isActive && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 bg-stone-800 dark:bg-stone-200" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {/* Hamburger menu button — visible only on mobile */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="text-stone-500 transition-colors duration-200 hover:text-stone-800 sm:hidden dark:text-stone-400 dark:hover:text-stone-200"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <button
            type="button"
            onClick={onDarkModeToggle}
            className="text-stone-500 transition-colors duration-200 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="flex items-center gap-2.5 text-sm text-stone-600 dark:text-stone-400">
            <span className="h-2 w-2 rounded-full bg-emerald-700 dark:bg-emerald-500" />
            <span className="font-medium">Home online</span>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <nav
          className="border-t border-stone-300 px-5 pb-4 pt-3 sm:hidden dark:border-stone-700"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            {navigationItems.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSectionChange(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full border px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "border-stone-500 bg-stone-200 text-stone-900 dark:border-stone-500 dark:bg-stone-700 dark:text-stone-100"
                      : "border-transparent text-stone-500 hover:bg-stone-200/60 dark:text-stone-400 dark:hover:bg-stone-700/60"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}