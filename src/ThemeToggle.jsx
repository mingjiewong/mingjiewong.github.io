// Import icons for the theme toggle button.
import { Sun, Moon } from "lucide-react";

/**
 * A button component to toggle between light and dark themes.
 * It handles updating the theme state and applying the theme to the DOM
 * and localStorage.
 *
 * @param {{
 *   theme: 'light' | 'dark';
 *   setTheme: (theme: 'light' | 'dark') => void;
 *   className?: string;
 * }} props
 */
export default function ThemeToggle({ theme, setTheme, className = "" }) {
  // Determine if the current theme is 'dark'.
  const isDark = theme === "dark";

  // Handles the click event to switch the theme.
  const toggle = () => {
    // Determine the next theme state.
    const next = isDark ? "light" : "dark";

    // Update the theme state in the parent component (App.jsx).
    setTheme(next);

    // --- Side Effects ---
    // Directly update the 'data-theme' attribute on the <html> element to apply CSS variables.
    document.documentElement.setAttribute("data-theme", next);

    // Persist the user's theme preference in localStorage.
    localStorage.setItem("theme", next);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      // Dynamically apply Tailwind CSS classes for styling.
      className={`
        ${className}
        w-10 h-10 flex items-center justify-center rounded-full border-2
        transition-colors duration-200 ease-out focus:outline-none
        focus:ring-2 focus:ring-[var(--ring)]
        ${isDark
          // Apply dark mode styles: white background, dark text.
          ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] hover:bg-white/90"
          // Apply light mode styles: transparent background, dark text.
          : "bg-transparent text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--muted)]"
        }
        hover:scale-110 active:scale-95
      `}
    >
      {/* Conditionally render the Sun or Moon icon based on the current theme. */}
      {isDark
        ? <Sun size={20} stroke="currentColor" />
        : <Moon size={20} stroke="currentColor" />
      }
    </button>
  );
}




