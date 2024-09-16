// Colors.ts

export const Colors = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#EDEDED",
    100: "#D1D1D1",
    200: "#B5B5B5",
    300: "#999999",
    400: "#7D7D7D",
    500: "#616161",
    600: "#454545",
    700: "#292929",
    800: "#1D1D1D",
    900: "#121212", // Almost black
    1000: "#0A0A0A",
    1010: "#000000",
  },
  primary: {
    50: "#F3F0FF",
    100: "#E0DCFF",
    200: "#C7BCFF",
    300: "#AE9CFF",
    400: "#8E75FF",
    500: "#635acc", // Central vibrant color
    600: "#4D4599",
    700: "#382F66",
    800: "#211933",
    900: "#110C1A",
  },
  secondary: {
    50: "#E8F4FF",
    100: "#CCE7FF",
    200: "#99CFFF",
    300: "#66B8FF",
    400: "#3390FF",
    500: "#ffffff", // Bright blue for contrast
    600: "#0051CC",
    700: "#003899",
    800: "#002066",
    900: "#001033",
  },
  accent: {
    50: "#FFF1E6",
    100: "#FFD7B8",
    200: "#FFB089",
    300: "#FF8A5B",
    400: "#FF6433",
    500: "#FF3E00", // Bright orange for accent
    600: "#CC3200",
    700: "#992600",
    800: "#661900",
    900: "#330C00",
  },
};

// theme settings for React Native
export const themeSettings = (mode: "light" | "dark") => {
  return {
    colors: {
      primary: {
        dark: Colors.primary[200],
        main: Colors.primary[500],
        light: Colors.primary[700],
      },
      secondary: {
        dark: Colors.secondary[200],
        main: Colors.secondary[500],
        light: Colors.secondary[700],
      },
      accent: {
        dark: Colors.accent[200],
        main: Colors.accent[500],
        light: Colors.accent[700],
      },
      neutral: {
        dark: Colors.grey[300],
        main: Colors.grey[500],
        mediumMain: Colors.grey[600],
        medium: Colors.grey[700],
        light: Colors.grey[800],
      },
      background: {
        default: mode === "dark" ? Colors.grey[900] : Colors.grey[10],
        alt: mode === "dark" ? Colors.grey[1000] : Colors.grey[0],
        widgets: mode === "dark" ? Colors.grey[800] : Colors.grey[50],
      },
      text: {
        primary: mode === "dark" ? Colors.grey[0] : Colors.grey[900],
        secondary: mode === "dark" ? Colors.grey[100] : Colors.grey[800],
      },
    },
    typography: {
      fontFamily: "Rubik, sans-serif",
      fontSize: 12,
      h1: {
        fontFamily: "Rubik, sans-serif",
        fontSize: 40,
      },
      h2: {
        fontFamily: "Rubik, sans-serif",
        fontSize: 32,
      },
      h3: {
        fontFamily: "Rubik, sans-serif",
        fontSize: 24,
      },
      h4: {
        fontFamily: "Rubik, sans-serif",
        fontSize: 20,
      },
      h5: {
        fontFamily: "Rubik, sans-serif",
        fontSize: 16,
      },
      h6: {
        fontFamily: "Rubik, sans-serif",
        fontSize: 14,
      },
    },
  };
};
