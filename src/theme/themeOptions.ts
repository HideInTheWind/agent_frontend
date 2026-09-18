export const THEME_PRESETS: ThemeOption[] = [
  {
    key: "orange-light",
    label: "活力橙",
    colorPrimary: "#ff6b01",
    dark: false,
    color: "orange",
    mode: "light",
  },
  {
    key: "orange-dark",
    label: "活力橙",
    colorPrimary: "#ff8927",
    dark: true,
    color: "orange",
    mode: "dark",
  },
  {
    key: "blue-light",
    label: "商务蓝",
    colorPrimary: "#1677ff",
    dark: false,
    color: "blue",
    mode: "light",
  },
  {
    key: "blue-dark",
    label: "商务蓝",
    colorPrimary: "#4096ff",
    dark: true,
    color: "blue",
    mode: "dark",
  },
  {
    key: "green-light",
    label: "蒂芙尼",
    colorPrimary: "#13c2c2",
    dark: false,
    color: "green",
    mode: "light",
  },
  {
    key: "green-dark",
    label: "蒂芙尼",
    colorPrimary: "#36cfc9",
    dark: true,
    color: "green",
    mode: "dark",
  },
  {
    key: "mint-light",
    label: "薄荷绿",
    colorPrimary: "#06B76D",
    dark: false,
    color: "mint",
    mode: "light",
  },
  {
    key: "mint-dark",
    label: "薄荷绿",
    colorPrimary: "#1fd685",
    dark: true,
    color: "mint",
    mode: "dark",
  },
  {
    key: "pink-light",
    label: "芭比粉",
    colorPrimary: "#eb2f96",
    dark: false,
    color: "pink",
    mode: "light",
  },
  {
    key: "pink-dark",
    label: "芭比粉",
    colorPrimary: "#f759ab",
    dark: true,
    color: "pink",
    mode: "dark",
  },
  {
    key: "purple-light",
    label: "梦幻紫",
    colorPrimary: "#722ed1",
    dark: false,
    color: "purple",
    mode: "light",
  },
  {
    key: "purple-dark",
    label: "梦幻紫",
    colorPrimary: "#b37feb",
    dark: true,
    color: "purple",
    mode: "dark",
  },
];

export const THEME_PRESETS_MAP = new Map(
  THEME_PRESETS.map((theme) => [theme.key, theme]),
);

export const DEFAULT_THEME_KEY = "mint-light";

/** hex → hsl */
function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0,
    hue = 0;
  if (max !== min) {
    s = l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    if (max === r) hue = ((g - b) / (max - min)) * 60 + (g < b ? 360 : 0);
    else if (max === g) hue = ((b - r) / (max - min)) * 60 + 120;
    else hue = ((r - g) / (max - min)) * 60 + 240;
  }
  return [Math.round(hue), Math.round(s * 100), Math.round(l * 100)];
}

/** hsl → hex */
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.min(1, Math.max(0, color)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * 从 colorPrimary 生成 n 色图表调色板（HSL 色阶算法）
 * 取色策略：pos 从 4 开始（比 colorPrimary 浅一阶），均匀跳跃
 *   1 个 → [4]
 *   2 个 → [4, 7]
 *   3 个 → [4, 6, 8]
 *   4 个 → [4, 5, 7, 2]
 *   5 个 → [4, 5, 2, 7, 9]
 *   6-10 → 全色阶按 pos [4,5,2,7,1,8,3,9,0,6]
 *   >10 → 循环
 *
 * 色阶 pos 对照（10 级，基于 HSL：L 从 90% → 20%，S 从 40% → 90%）：
 *   pos 0(浅) … 9(深)
 */
export function getChartColors(
  n: number,
  colorPrimary: string,
  dark = false,
): string[] {
  const [h, s] = hexToHsl(colorPrimary);
  const stops = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.32, 0.25, 0.18, 0.12];
  const sats = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 0.9, 0.85, 0.8];
  const strategy: Record<number, number[]> = {
    1: [4],
    2: [4, 7],
    3: [4, 6, 8],
    4: [4, 5, 7, 2],
    5: [4, 5, 2, 7, 9],
  };
  const order = [4, 5, 2, 7, 1, 8, 3, 9, 0, 6];
  const basePicks =
    n <= 5
      ? strategy[n]
      : Array.from({ length: n }, (_, i) => order[i % order.length]);
  // 浅色模式整体-1提亮一阶，暗色模式保持基准pos（暗色背景上视觉更亮）
  const picks = dark ? basePicks : basePicks.map((p) => Math.max(p - 1, 0));
  return picks.map((pos) => {
    const sf = sats[pos] / (s / 100 || 1);
    return hslToHex(h, s * sf, stops[pos] * 100);
  });
}
