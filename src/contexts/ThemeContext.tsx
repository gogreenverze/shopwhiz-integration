
import React, { createContext, useContext, useState, useEffect } from "react";

// Theme options
export type ThemeName = "default" | "ocean" | "sunset" | "forest" | "monochrome" | "custom";

export type Theme = {
  name: ThemeName;
  className: string;
};

export const themes: Theme[] = [
  { name: "default", className: "theme-default" },
  { name: "ocean", className: "theme-ocean" },
  { name: "sunset", className: "theme-sunset" },
  { name: "forest", className: "theme-forest" },
  { name: "monochrome", className: "theme-monochrome" },
  { name: "custom", className: "theme-custom" }
];

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isCompactMode: boolean;
  toggleCompactMode: () => void;
  areAnimationsEnabled: boolean;
  toggleAnimations: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themes[0],
  setTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  isCompactMode: false,
  toggleCompactMode: () => {},
  areAnimationsEnabled: true,
  toggleAnimations: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const foundTheme = themes.find(t => t.name === savedTheme);
      if (foundTheme) return foundTheme;
    }
    return themes[0]; // Default theme
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      return savedDarkMode === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Compact mode state
  const [isCompactMode, setIsCompactMode] = useState<boolean>(() => {
    const savedCompactMode = localStorage.getItem("compactMode");
    return savedCompactMode === "true";
  });

  // Animations state
  const [areAnimationsEnabled, setAreAnimationsEnabled] = useState<boolean>(() => {
    const savedAnimations = localStorage.getItem("animations");
    return savedAnimations !== "false"; // Enable by default
  });

  // Apply theme and mode classes to document
  useEffect(() => {
    // Clear existing theme classes first
    document.documentElement.classList.remove(...themes.map(t => t.className));
    
    // Apply theme
    document.documentElement.classList.add(theme.className);
    
    // Apply dark/light mode
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply compact mode
    if (isCompactMode) {
      document.documentElement.classList.add("compact");
    } else {
      document.documentElement.classList.remove("compact");
    }
    
    // Apply animations setting
    if (!areAnimationsEnabled) {
      document.documentElement.classList.add("no-animations");
    } else {
      document.documentElement.classList.remove("no-animations");
    }
    
    // Save preferences
    localStorage.setItem("theme", theme.name);
    localStorage.setItem("darkMode", String(isDarkMode));
    localStorage.setItem("compactMode", String(isCompactMode));
    localStorage.setItem("animations", String(areAnimationsEnabled));
    
    console.log("Theme applied:", theme.name, theme.className);
  }, [theme, isDarkMode, isCompactMode, areAnimationsEnabled]);

  // Toggle functions
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleCompactMode = () => setIsCompactMode(prev => !prev);
  const toggleAnimations = () => setAreAnimationsEnabled(prev => !prev);

  return (
    <ThemeContext.Provider 
      value={{
        theme,
        setTheme,
        isDarkMode,
        toggleDarkMode,
        isCompactMode,
        toggleCompactMode,
        areAnimationsEnabled,
        toggleAnimations
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
