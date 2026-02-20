import React from 'react';
import { Sun, Moon } from 'lucide-react';
import useTheme from '../../hooks/use-theme';
import '../../styles/ThemeToggle.css';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="theme-floating-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
        >
            <div className={`theme-toggle-icon ${theme === 'dark' ? 'is-dark' : 'is-light'}`}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
    );
};

export default ThemeToggle;
