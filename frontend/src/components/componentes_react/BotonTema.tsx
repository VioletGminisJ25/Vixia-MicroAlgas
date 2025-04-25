import React, { useEffect, useState } from 'react';
import '../../styles/ThemeSwitch.css';

/**
 * MIT License
 * Copyright (c) 2025 JustCode14
 * See https://uiverse.io/JustCode14/red-dingo-61
 */
export default function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false);

  // Al cargar el componente, se comprueba si hay un tema guardado en localStorage
  // y se aplica el tema correspondiente
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

  // Función para alternar entre el tema claro y oscuro
  // Cambia la clase del elemento html y guarda el tema en localStorage
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

  // Renderiza un botón que alterna entre el tema claro y oscuro
  // El botón tiene un icono de sol y una nube que cambian según el tema
  return (
    <label className="switch" title={isDark ? 'Modo oscuro' : 'Modo claro'}>
      <input type="checkbox" checked={isDark} onChange={toggleTheme} />
      <span className="slider">
        <div className="star star_1"></div>
        <div className="star star_2"></div>
        <div className="star star_3"></div>
        <svg viewBox="0 0 16 16" className="cloud_1 cloud">
          <path
            transform="matrix(.77976 0 0 .78395-299.99-418.63)"
            fill="#fff"
            d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
          />
        </svg>
      </span>
    </label>
  );
}
