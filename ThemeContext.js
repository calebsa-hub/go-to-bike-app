import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  }

  const theme = {
    isDarkMode,
    colors: {
      background: isDarkMode ? 'black' : 'white',
      backgroundModal: isDarkMode ? 'grey' : 'white',
      text: isDarkMode ? 'white' : '#62BA44',
      icon: isDarkMode ? 'white' : '#62BA44',
      iconPlayButton: isDarkMode ? 'black' : 'white',
      iconPauseButton: isDarkMode ? 'black' : 'white',
      iconStopButton: isDarkMode ? 'black' : 'white',
      borderColorHome: isDarkMode ? 'white' : '#62BA44',
    },
    toggleTheme,
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;