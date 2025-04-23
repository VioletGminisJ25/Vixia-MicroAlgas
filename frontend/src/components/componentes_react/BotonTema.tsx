import React, { useEffect, useState } from 'react';
import '../../styles/ThemeSwitch.css'; // Asegúrate de que esto esté importado

export default function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false);

  // Al cargar, miramos si ya hay un modo guardado
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Al cambiar el switch
  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <label className="switch" title={isDark ? 'Modo oscuro' : 'Modo claro'}>
      <input type="checkbox" checked={!isDark} onChange={toggleTheme} />
      <span className="slider">
        <div className="star star_1"></div>
        <div className="star star_2"></div>
        <div className="star star_3"></div>
        <svg viewBox="0 0 16 16" className="cloud_1 cloud">
          <path
            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
            fill="#fff"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524..."
          />
        </svg>
      </span>
    </label>
  );
}
