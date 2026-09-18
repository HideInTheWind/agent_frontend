import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { ROUTES } from "@/constants";
import { useUserStore } from "@/stores/useUserStore";
import { message } from "antd";

declare module "axios" {
  interface AxiosRequestConfig {
    ignoreError?: boolean;
  }
}

interface ApiErrorData {
  message?: string;
}

export type RequestConfig = AxiosRequestConfig;

/** 与 axios params 保持一致，兼容 PageParams 等接口类型 */
export type RequestParams = NonNullable<AxiosRequestConfig["params"]>;

/**
 * 网络请求基础地址
 */

export const serverUrl = import.meta.env.VITE_PROXY_BASE_URL;

const instance: AxiosInstance = axios.create({
  baseURL: serverUrl,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // const token = useUserStore.getState().token;
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

const errorMessageManager = {
  messages: new Map<string, number>(),
  timeout: 3000,

  showErrorOnce(key: string, msg: string) {
    const now = Date.now();
    const lastShown = this.messages.get(key);

    if (!lastShown || now - lastShown > this.timeout) {
      message.error(msg);
      this.messages.set(key, now);
    }
  },
};

async function parseErrorMessage(
  error: AxiosError<ApiErrorData>,
): Promise<string> {
  const errorData = error.response?.data;

  if (
    errorData instanceof Blob &&
    errorData.type.includes("application/json")
  ) {
    try {
      const text = await errorData.text();
      const json = JSON.parse(text) as ApiErrorData;
      return json.message ?? error.message;
    } catch (e) {
      console.warn("Blob error parse failed", e);
      return error.message;
    }
  }

  if (errorData && typeof errorData === "object" && "message" in errorData) {
    return errorData.message ?? error.message;
  }

  return error.message;
}

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorData>) => {
    const status = error.response?.status;
    const ignoreError = error.config?.ignoreError ?? false;
    const errorMessage = await parseErrorMessage(error);

    if (status === 401) {
      errorMessageManager.showErrorOnce("auth-401", "登录过期,请重新登录！");
      useUserStore.getState().logout();
      window.location.href = ROUTES.DASHBOARD;
      return Promise.reject(error);
    }

    if (!ignoreError) {
      if (status === undefined) {
        errorMessageManager.showErrorOnce("network-error", "网络异常，请检查服务是否正常");
      } else if (status === 400 || status === 415) {
        errorMessageManager.showErrorOnce(`error-${status}`, errorMessage);
      } else if (status === 500 || status === 503) {
        errorMessageManager.showErrorOnce(`error-${status}`, errorMessage);
      } else if (status >= 500) {
        errorMessageManager.showErrorOnce("server-error", "服务器内部错误");
      }
    }

    return Promise.reject(error);
  },
);

/**
 * get请求
 * @param url
 * @param params
 * @param config - 允许传递额外的配置项，如 ignoreError
 * @returns
 */
// export const get = async <T = unknown>(
//   url: string,
//   params: RequestParams = {},
//   config: RequestConfig = {},
// ) => {
//   const res = await instance.get<T>(url, { params, ...config });
//   if (config.responseType) {
//     return res;
//   } else {
//     return res.data;
//   }
// };
/**
 * 普通 JSON 请求：返回 res.data
 */
export function get<T = unknown>(
  url: string,
  params?: RequestParams,
  config?: RequestConfig,
): Promise<T>;

/**
 * 下载/二进制请求：返回完整 AxiosResponse
 */
export function get<T = unknown>(
  url: string,
  params: RequestParams,
  config: RequestConfig & {
    responseType: NonNullable<AxiosRequestConfig["responseType"]>;
  },
): Promise<AxiosResponse<T>>;

export async function get<T = unknown>(
  url: string,
  params: RequestParams = {},
  config: RequestConfig = {},
): Promise<T | AxiosResponse<T>> {
  const res = await instance.get<T>(url, { params, ...config });
  if (config.responseType) {
    return res;
  }
  return res.data;
}

/**
 * post请求
 * @param url
 * @param data
 * @param config - 允许传递额外的配置项，如 ignoreError
 * @returns
 */
// export const post = async <T = unknown>(
//   url: string,
//   data?: unknown,
//   config: RequestConfig = {},
// ) => {
//   const res = await instance.post<T>(url, data, config);
//   if (config.responseType) {
//     return res;
//   } else {
//     return res.data;
//   }
// };
export function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: RequestConfig,
): Promise<T>;

export function post<T = unknown>(
  url: string,
  data: unknown,
  config: RequestConfig & {
    responseType: NonNullable<AxiosRequestConfig["responseType"]>;
  },
): Promise<AxiosResponse<T>>;

export async function post<T = unknown>(
  url: string,
  data?: unknown,
  config: RequestConfig = {},
): Promise<T | AxiosResponse<T>> {
  const res = await instance.post<T>(url, data, config);
  if (config.responseType) {
    return res;
  }
  return res.data;
}

/**
 * put请求
 * @param url
 * @param data
 * @param config - 允许传递额外的配置项，如 ignoreError
 * @returns
 */
export const put = <T = unknown>(
  url: string,
  data?: unknown,
  config: RequestConfig = {},
) => instance.put<T>(url, data, config).then((res) => res.data);

/**
 * delete请求
 * @param url
 * @param params
 * @param config - 允许传递额外的配置项，如 ignoreError
 * @returns
 */
export const del = <T = unknown>(
  url: string,
  params: RequestParams = {},
  config: RequestConfig = {},
) => instance.delete<T>(url, { params, ...config }).then((res) => res.data);

/**
 * delete 请求（JSON body）
 */
export const delWithBody = <T = unknown>(
  url: string,
  data?: unknown,
  config: RequestConfig = {},
) => instance.delete<T>(url, { data, ...config }).then((res) => res.data);

const request = {
  get,
  post,
  put,
  del,
  delWithBody,
};

export default request;
