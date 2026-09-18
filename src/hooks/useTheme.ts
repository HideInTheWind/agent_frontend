// import { useThemeStore, selectThemeOption } from "@/stores/useThemeStore";

// export default function useTheme() {
//   const themeKey = useThemeStore((s) => s.themeKey);
//   const themeOption = useThemeStore(selectThemeOption);
//   const themes = useThemeStore((s) => s.themes);
//   const setThemeKey = useThemeStore((s) => s.setThemeKey);

//   return { themeKey, themeOption, setThemeKey, themes };
// }
// 用 useShallow 合并成一次 selector，减少订阅开销（当前规模下影响很小）。
// 原理：

// 普通 selector 每次返回新对象 {}，引用变了就会触发 re-render。
// useShallow 对返回对象做浅比较：各字段值没变就不 re-render。
// setThemeKey、themes 引用稳定；themeKey 变或 themeOption 变才会更新。
// 上面是另一种写法
import { useShallow } from "zustand/react/shallow";
import { useThemeStore, selectThemeOption } from "@/stores/useThemeStore";

export default function useTheme() {
  return useThemeStore(
    useShallow((s) => ({
      themeKey: s.themeKey,
      themeOption: selectThemeOption(s),
      themes: s.themes,
      setThemeKey: s.setThemeKey,
    })),
  );
}
