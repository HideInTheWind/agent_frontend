import { serverUrl } from "@/services/request";
import type { AxiosResponse } from "axios";

export interface BrowserStreamDownloadParams {
  url: string;
  req?: Record<string, string | number | boolean>;
}

interface AxiosStreamDownloadParams {
  res: AxiosResponse<Blob>;
  fileName?: string;
}

/** 构造下载 URL */
export function buildBrowserStreamDownloadUrl({
  url,
  req,
}: BrowserStreamDownloadParams): string {
  const baseUrl = `${serverUrl}${url}`;
  if (!req || Object.keys(req).length === 0) {
    return baseUrl;
  }

  const params = new URLSearchParams();
  Object.entries(req).forEach(([key, value]) => {
    params.set(key, String(value));
  });

  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}${params}`;
}

/** 通过浏览器流式下载（导航至 URL，由浏览器接管响应流并保存文件） */
export function browserStreamDownload(
  params: BrowserStreamDownloadParams,
): void {
  const url = buildBrowserStreamDownloadUrl(params);
  const link = document.createElement("a");
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const stripFilenameQuotes = (value: string) =>
  value.replace(/^["']+|["']+$/g, "").trim();

const decodePercentEncodedFilename = (value: string): string => {
  if (!/%[0-9A-Fa-f]{2}/.test(value)) return value;
  try {
    return decodeURIComponent(value);
  } catch (e) {
    console.error("Failed to decode filename:", e);
    return value;
  }
};

/**
 * 从 Content-Disposition 响应头解析文件名
 * 支持 filename="..."、filename=plain、filename*=UTF-8''%E4... 等常见格式
 */

// extractFilenameFromContentDisposition — 边界处理
// 主要变化：

// 优先 filename*（RFC 5987），再回退到 filename=
// 先去掉 UTF-8'' / charset'lang' 前缀，再 decodeURIComponent
// 去掉首尾引号，兼容 filename="report.xlsx"
// 解码失败时打日志并返回原值，不抛错
// 覆盖的常见格式：

// attachment; filename="report.xlsx"
// attachment; filename=report.xlsx
// attachment; filename*=UTF-8''%E6%8A%A5%E5%91%8A.xlsx
// attachment; filename="fallback.txt"; filename*=UTF-8''%E6%8A%A5%E5%91
export function extractFilenameFromContentDisposition(
  contentDisposition: string,
): string {
  if (!contentDisposition) return "";

  // RFC 5987：filename*=charset'lang'value，优先于 filename=
  const filenameStarMatch = /filename\*=([^;]+)/i.exec(contentDisposition);
  if (filenameStarMatch?.[1]) {
    let encoded = filenameStarMatch[1].trim();

    // 移除 charset'lang' 前缀，如 UTF-8'' 或 UTF-8'en'
    const rfc5987Match = /^[^\s']+'(?:[^']*)'(.*)$/i.exec(encoded);
    if (rfc5987Match?.[1]) {
      encoded = rfc5987Match[1];
    } else if (/^UTF-8''/i.test(encoded)) {
      encoded = encoded.slice(7);
    }

    const decoded = decodePercentEncodedFilename(encoded);
    if (decoded) return stripFilenameQuotes(decoded);
  }

  // 常规 filename="..." 或 filename=plain
  const filenameMatch = /filename=([^;]+)/i.exec(contentDisposition);
  if (filenameMatch?.[1]) {
    return stripFilenameQuotes(filenameMatch[1]);
  }

  return "";
}

/** 设置文件名，解析失败时回退到传入的 fileName */
export const buildAxiosStreamDownloadFilename = (
  res: AxiosResponse,
  fileName?: string,
): string => {
  const fallback = fileName ?? "";
  const contentDisposition = res.headers?.["content-disposition"];
  if (!contentDisposition) return fallback;

  const parsed = extractFilenameFromContentDisposition(contentDisposition);
  return parsed || fallback;
};

/**
 * 通过 axios 流式下载
 * @param params
 */
export const axiosStreamDownload = async (
  params: AxiosStreamDownloadParams,
): Promise<void> => {
  const { fileName, res } = params;
  const blob = new Blob([res.data]);
  // 创建下载链接
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // 获取下载文件名
  const downloadFilename = buildAxiosStreamDownloadFilename(res, fileName);
  link.download = downloadFilename;

  // 触发下载
  document.body.appendChild(link);
  link.click();

  // 清理
  URL.revokeObjectURL(link.href);
  document.body.removeChild(link);
};
