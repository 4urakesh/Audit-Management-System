import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

function getInitialTheme() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark") {
        return saved;
    }

    // Fallback: respect system preference on first visit
    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
}

function useTheme() {

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {

        document.documentElement.setAttribute("data-theme", theme);

        localStorage.setItem(STORAGE_KEY, theme);

    }, [theme]);

    const toggleTheme = () => {

        setTheme((previous) =>
            previous === "light" ? "dark" : "light"
        );
    };

    return { theme, toggleTheme };
}

export default useTheme;