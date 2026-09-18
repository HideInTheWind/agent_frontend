import React from "react";
import { Button, Dropdown, Tooltip } from "antd";
import { SunOutlined, MoonOutlined, BgColorsOutlined } from "@ant-design/icons";
import useTheme from "@/hooks/useTheme";
import "./index.scss";
import { THEME_PRESETS, THEME_PRESETS_MAP } from "@/theme/themeOptions";

interface ThemeSwitcherProps {
  showDarkToggle?: boolean;
}

const ColorDot: React.FC<{ color: string }> = ({ color }) => (
  <span
    style={{
      display: "inline-block",
      width: 12,
      height: 12,
      borderRadius: "50%",
      backgroundColor: color,
      marginRight: 8,
      verticalAlign: "middle",
    }}
  />
);

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  showDarkToggle = true,
}) => {
  const { themeOption, setThemeKey } = useTheme();

  const setThemeColor = (key: ThemeKey) => {
    const target = THEME_PRESETS_MAP.get(key);
    if (target) setThemeKey(target.key);
  };

  const toggleDarkMode = () => {
    const targetMode = themeOption.mode === "light" ? "dark" : "light";
    const target = THEME_PRESETS_MAP.get(themeOption.color + "-" + targetMode);
    if (target) {
      setThemeKey(target.key);
    }
  };

  const colorMenuItems = THEME_PRESETS.filter((op) => !op.dark).map((op) => ({
    key: op.key,
    label: (
      <span style={{ cursor: "pointer" }}>
        <ColorDot color={op.colorPrimary} />
        {op.label}
      </span>
    ),
  }));

  return (
    <span className="theme-switcher">
      <Dropdown
        menu={{
          items: colorMenuItems,
          onClick: ({ key }) => setThemeColor(key),
        }}
        placement="bottomRight"
      >
        <Button type="text" icon={<BgColorsOutlined />} />
      </Dropdown>
      {showDarkToggle && (
        <Tooltip title={themeOption.dark ? "切换亮色模式" : "切换暗色模式"}>
          <Button
            type="text"
            icon={themeOption.dark ? <SunOutlined /> : <MoonOutlined />}
            onClick={toggleDarkMode}
          />
        </Tooltip>
      )}
    </span>
  );
};

export default ThemeSwitcher;
