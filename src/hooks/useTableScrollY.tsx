import { useState, useEffect, type RefObject } from "react";

interface UseTableScrollYOptions {
  minHeight?: number; // 最小滚动高度，默认 100
}

const useTableScrollY = (
  containerRef: RefObject<HTMLDivElement | null>,
  deps: unknown[] = [],
  options: UseTableScrollYOptions = {},
): number | string => {
  const { minHeight = 100 } = options;
  const [scrollY, setScrollY] = useState<number | string>("");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const calculateScrollY = () => {
      const containerHeight = container.clientHeight;
      if (containerHeight <= 0) {
        setScrollY(minHeight);
        return;
      }

      // 获取 padding
      const style = getComputedStyle(container);
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const paddingBottom = parseFloat(style.paddingBottom) || 0;

      // 查找表头
      const thead = container.querySelector(
        ".ant-table-thead",
      ) as HTMLElement | null;
      // const theadHeight = thead ? thead.offsetHeight : 0;
      const theadHeight = thead ? thead.clientHeight : 0;

      // 计算可用高度
      const availableHeight =
        containerHeight - paddingTop - paddingBottom - theadHeight;
      setScrollY(Math.max(minHeight, availableHeight));
    };

    // 初次计算
    calculateScrollY();

    // 监听容器尺寸变化
    const resizeObserver = new ResizeObserver(calculateScrollY);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, minHeight, ...deps]); // 注意：containerRef 本身不会变，但 deps 控制何时重新绑定

  return scrollY;
};

export default useTableScrollY;
