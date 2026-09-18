interface ThemeOption {
  key: string;
  label: string;
  colorPrimary: string;
  dark: boolean;
  color: "orange" | "blue" | "green" | "mint" | "pink" | "purple";
  mode: "light" | "dark";
}

type ThemeKey = ThemeOption["key"];
