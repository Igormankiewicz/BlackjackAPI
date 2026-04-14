import { useEffect, useState } from 'react';
import sunIcon from '../../assets/sun.svg';
import moonIcon from '../../assets/moon.svg';

export default function ThemeToggle() {
  // Default to dark theme as requested
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Apply the 'dark' class to the html element based on state
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-green-primary hover:bg-green-hover shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-accent"
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <img
        src={theme === 'dark' ? sunIcon : moonIcon}
        alt={theme === 'dark' ? 'Sun Icon' : 'Moon Icon'}
        className="w-12 h-12 text-white dark:text-dark-text"
        style={{ filter: 'invert(1)' }} // Invert color to white assuming SVG stroke is black initially
      />
    </button>
  );
}