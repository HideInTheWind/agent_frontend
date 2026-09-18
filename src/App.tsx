import { ConfigProvider, theme as antdTheme } from "antd";
import zhCN from "antd/locale/zh_CN";
import "./App.css";
import useTheme from "./hooks/useTheme";
import AppRouter from "./router";

function App() {
  const { themeOption } = useTheme();
  const algorithm = themeOption.dark
    ? antdTheme.darkAlgorithm
    : antdTheme.defaultAlgorithm;

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        cssVar: {},
        token: {
          colorPrimary: themeOption.colorPrimary,
          colorLink: themeOption.colorPrimary,
          fontFamily: "'Inter', 'Noto Sans SC', -apple-system, sans-serif",
          borderRadius: 6,
          borderRadiusLG: 12,
          borderRadiusSM: 4,
        },
        algorithm,
      }}
    >
      <AppRouter />
    </ConfigProvider>
  );
}

export default App;
