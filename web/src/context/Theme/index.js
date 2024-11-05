import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {ConfigContext} from "../Config/index.js";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

const SetThemeContext = createContext(null);
export const useSetTheme = () => useContext(SetThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, _setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme-mode') || null;
    } catch {
      return null;
    }
  });
  const [configState, configDispatch] = useContext(ConfigContext);

  useEffect(() => {
    if (theme) {
      configDispatch({ type: 'set', payload: { theme } });
    }
  }, [theme]);

  const setTheme = useCallback((input) => {
    _setTheme(input ? 'dark' : 'light');

    const body = document.body;
    if (!input) {
      body.removeAttribute('theme-mode');
      localStorage.setItem('theme-mode', 'light');

      configDispatch({ type: 'set', payload: { theme: 'light' } });
    } else {
      body.setAttribute('theme-mode', 'dark');
      localStorage.setItem('theme-mode', 'dark');

      configDispatch({ type: 'set', payload: { theme: 'dark' } });
    }
  }, []);

  return (
    <SetThemeContext.Provider value={setTheme}>
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    </SetThemeContext.Provider>
  );
};
