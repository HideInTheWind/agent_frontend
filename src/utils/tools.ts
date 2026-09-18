/* eslint-disable @typescript-eslint/no-explicit-any */
// 工具类
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
// import { appMessage } from "@/utils/messageApi";
import { message } from "antd";

dayjs.extend(duration);

export const Cookie = {
  getItem: function (sKey: any) {
    if (!sKey) {
      return null;
    }
    return JSON.parse(
      (decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            "(?:(?:^|.*;)\\s*" +
              encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") +
              "\\s*\\=\\s*([^;]*).*$)|^.*$",
          ),
          "$1",
        ),
      ) as any) || null,
    );
  },
  setItem: function (
    sKey: any,
    sValue: any,
    vEnd?: any,
    sPath?: any,
    sDomain?: any,
    bSecure?: any,
  ) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    let sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT"
              : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie =
      encodeURIComponent(sKey) +
      "=" +
      encodeURIComponent(sValue) +
      sExpires +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "") +
      (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey: any, sPath?: any, sDomain?: any) {
    document.cookie =
      encodeURIComponent(sKey) +
      "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
      (sDomain ? "; domain=" + sDomain : "") +
      (sPath ? "; path=" + sPath : "");
    return true;
  },

  // clear: function() {
  //     this.setItem('user', '', new Date(0), '/')
  // }
};

/**
 * 将图片转成base64
 * @param file
 * @returns
 */
export const getBase64 = (file: any): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });

/**
 * 去掉base64字符串头部
 * @param base64
 * @returns
 */
export const dealBase64 = (base64: string) => {
  const idx = base64.indexOf(",") + 1;
  const targetString = base64.slice(idx, base64.length);
  return targetString;
};

/**
 * 将时间戳转换为指定格式的日期字符串
 * @param timestamp - 时间戳（可以是秒也可以是毫秒）
 * @param withTime - 是否包含时间部分，默认为 true
 * @returns 格式化的日期字符串
 */
export function convertTimestamp(
  timestamp: number,
  withTime: boolean = true,
  onlyTime: boolean = false,
): string {
  // 初步判断时间戳是否以毫秒为单位
  // console.log("timestamp", timestamp);
  if (!timestamp) return timestamp + "";
  const isSecond = timestamp.toString().length === 10;

  // 如果不是毫秒，则假设为秒，并转换成毫秒
  const adjustedTimestamp = isSecond ? timestamp * 1000 : timestamp;

  const d = new Date(adjustedTimestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // JavaScript的月份从0开始，所以需要加1
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  const second = String(d.getSeconds()).padStart(2, "0");

  if (onlyTime) {
    return `${hour}:${minute}:${second}`; // 修改了小时、分钟、秒之间的分隔符为冒号(:)，以符合常见的时间格式。
  } else if (!withTime) {
    return `${year}-${month}-${day}`;
  } else {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}

export function formatDeathCountdown(
  timestampA: number,
  timestampB: number,
  prefix = "",
) {
  const diffMs = Math.abs(timestampA - timestampB);
  const dur = dayjs.duration(diffMs);
  const days = Math.floor(dur.asDays());
  const hours = dur.hours();
  const minutes = dur.minutes();
  if (days <= 0 && hours <= 0 && minutes >= 0) {
    return `${prefix}${minutes}分`;
  }
  if (days <= 0 && hours >= 0) {
    return `${prefix}${hours}时${minutes}分`;
  }
  return `${prefix}${days}天${hours}时${minutes}分`;
}

/**
 * 生成随机颜色
 * @returns 颜色
 */
export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    if (i < 2) {
      // 在前两位中选择较大的值，以增加亮度
      color += letters[Math.floor(Math.random() * 8 + 8)];
    } else {
      color += letters[Math.floor(Math.random() * 16)];
    }
  }
  return color;
}

/**
 * 将#开头的颜色转换成rgba
 * @param hex #xxxxxx
 * @param alpha 透明度
 * @returns
 */
export function hexToRgba(hex: string, alpha: number): string {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * 自定义标签页标题
 * @param url 跳转的路由
 * @param title 自定义标题名称
 */
export function openNewTabWithTitle(url: string, title: string) {
  const page = window.open(url) as any;
  setTimeout(() => {
    page.document.title = title;
  }, 300);
}

/**
 * 单张图片上传格式校验
 * @param file
 * @returns
 */
export const formatCheck = (file: any) => {
  const photoFormatArr = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const res = file.name.slice(file.name.indexOf("."), file.name.length);
  if (photoFormatArr.indexOf(res) != -1) {
    return true;
  }
  return false;
};

/**
 * 复制
 * @param content
 * @returns
 */
export const copyHandle = async (content: string) => {
  if (!content) return;
  const textToCopy = content;
  // 使用 navigator.clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(textToCopy);
      return true;
    } catch (err) {
      console.error("复制到剪贴板失败:", err);
      return false;
    }
  } else {
    // 使用 document.execCommand 作为回退方案
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    // document.body.removeChild(textArea);
    textArea.remove();
    message.success("复制成功");
    return true;
  }
};

/**
 * 动态修改网站图标
 * @param logo
 */
export const titleIcon = (logo?: any) => {
  const changeFavicon = (link: string) => {
    let $favicon: any = document.querySelector('link[rel="shortcut icon"]');
    if ($favicon !== null) {
      $favicon.href = link;
    } else {
      $favicon = document.createElement("link");
      $favicon.rel = "shortcut icon";
      $favicon.type = "image/png";
      $favicon.href = link;
      document.head.appendChild($favicon);
    }
  };
  // 设置图标地址
  const iconUrl = logo || "";
  // let iconUrl = 'http://chaba.topvdn.com/chaba/v1/platform/images/logo'
  changeFavicon(iconUrl);
};

/**
 * 创建一个深拷贝函数，避免使用 JSON.stringify 和 JSON.parse
 * @param obj
 * @returns
 */
export const deepClone = (obj: any) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  const copy = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 跳过 React 组件和其他可能导致循环引用的属性
      if (key === "icon" || typeof obj[key] === "function") {
        (copy as any)[key] = obj[key];
      } else {
        (copy as any)[key] = deepClone(obj[key]);
      }
    }
  }

  return copy;
};

/**
 * 防抖
 * @param fn
 * @param delay
 * @returns
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): T & { cancel: () => void; flush: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      lastArgs = null;
      fn(...args);
    }, delay);
  };

  debounced.cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    lastArgs = null;
  };
  // debouncedSaveCache 有 300ms 防抖。
  // 用户改完表单项后，如果不到 300ms 就发生卸载（关弹窗、切步骤等），定时器里的写入还不会执行。
  // flush() 会立刻把最后一次参数写入 localStorage：
  debounced.flush = () => {
    if (timer && lastArgs) {
      clearTimeout(timer);
      timer = null;
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  return debounced as T & { cancel: () => void; flush: () => void };
}

export const getTimePeriod = (date: dayjs.Dayjs): "上午" | "下午" | "晚上" => {
  const hour = date.hour();
  if (hour >= 0 && hour < 12) {
    return "上午";
  } else if (hour >= 12 && hour < 18) {
    return "下午";
  } else {
    return "晚上";
  }
};

export const bytesToTbValue = (size: number, remainCount: number = 2) =>
  Number((size / 1024 ** 4).toFixed(remainCount));

export const bytesToTb = (size: number, remainCount: number = 1) =>
  (size / 1024 ** 4).toFixed(remainCount) + " TB";

const BYTE_UNITS = [
  { label: "TB", divisor: 1024 ** 4 },
  { label: "GB", divisor: 1024 ** 3 },
  { label: "MB", divisor: 1024 ** 2 },
  { label: "KB", divisor: 1024 },
] as const;

export const formatBytesAuto = (size: number, remainCount: number = 1) => {
  if (size <= 0) return "0 KB";

  for (const { label, divisor } of BYTE_UNITS) {
    const value = size / divisor;
    if (value >= 1) {
      return `${value.toFixed(remainCount)} ${label}`;
    }
  }

  return `${(size / 1024).toFixed(remainCount)} KB`;
};
