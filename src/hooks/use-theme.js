import { useState, useEffect } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        // Initial check: localStorage -> system preference -> default to 'light'
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemDark ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove both classes to ensure clean state
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Save to localStorage using the standard 'theme' key
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return { theme, toggleTheme };
};

export default useTheme;
