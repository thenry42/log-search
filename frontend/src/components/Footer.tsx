import { useTheme } from "../hooks/useTheme";

const GITHUB_URL = "https://github.com/thenry42/log-search";

export default function Footer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="relative flex items-center justify-between border-t border-gray-200 px-8 py-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer rounded px-2 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        GitHub
      </a>

      <span className="absolute left-1/2 -translate-x-1/2">Thibault Henry</span>

      <button
        type="button"
        onClick={toggleTheme}
        className="cursor-pointer rounded px-2 py-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        {theme === "dark" ? "light" : "dark"}
      </button>
    </footer>
  );
}
