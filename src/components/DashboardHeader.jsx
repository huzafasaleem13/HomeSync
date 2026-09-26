import { useState, useEffect } from "react";
import { Bell, Menu, Moon, Sun, X } from "lucide-react";

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
  notifications = [],
  onDismissNotification,
  onMarkAllRead,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleSectionChange(sectionId) {
    onSectionChange(sectionId);
    setIsMenuOpen(false);
    setIsNotificationsOpen(false);
  }

  return (
    <header className="relative border-b border-stone-300 bg-[#f2eee5] dark:border-stone-700 dark:bg-[#1c1917]">
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

          {/* Notification bell */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((open) => !open)}
            className="relative text-stone-500 transition-colors duration-200 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
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
            <span className="hidden text-stone-400 sm:inline dark:text-stone-600">·</span>
            <span className="hidden text-xs text-stone-500 sm:inline dark:text-stone-400">
              {formattedDate} · {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Notification dropdown */}
      {isNotificationsOpen && (
        <div className="absolute right-5 top-full z-50 mt-1 w-80 border border-stone-300 bg-[#f7f4ed] shadow-lg lg:right-10 dark:border-stone-700 dark:bg-[#292524]">
          <div className="flex items-center justify-between border-b border-stone-300 px-4 py-3 dark:border-stone-700">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-stone-500 dark:text-stone-400">
              Notifications
            </p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
              >
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-stone-500 dark:text-stone-400">
              No notifications
            </p>
          ) : (
            <ol className="max-h-72 overflow-y-auto">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-3 border-b border-stone-200 px-4 py-3 last:border-0 dark:border-stone-700 ${
                    notification.read
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      notification.read
                        ? "bg-stone-400 dark:bg-stone-600"
                        : "bg-emerald-600 dark:bg-emerald-500"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-800 dark:text-stone-200">
                      {notification.text}
                    </p>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                      {notification.time} · {notification.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDismissNotification(notification.id)}
                    className="mt-0.5 shrink-0 text-stone-400 transition-colors duration-200 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300"
                    aria-label={`Dismiss: ${notification.text}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

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