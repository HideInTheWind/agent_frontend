import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants";
import {
  getStorageItem,
  getStorageJson,
  removeStorageItem,
  setStorageItem,
  setStorageJson,
} from "@/utils/storage";

interface UserState {
  token: string | null;
  userInfo: UserInfo | null;
  setToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set /* get */) => ({
  token: getStorageItem(STORAGE_KEYS.TOKEN),
  userInfo: getStorageJson<UserInfo>(STORAGE_KEYS.USER_INFO),

  setToken: (token) => {
    setStorageItem(STORAGE_KEYS.TOKEN, token);
    set({ token });
  },

  setUserInfo: (userInfo) => {
    setStorageJson(STORAGE_KEYS.USER_INFO, userInfo);
    set({ userInfo });
  },

  logout: () => {
    removeStorageItem(STORAGE_KEYS.TOKEN);
    removeStorageItem(STORAGE_KEYS.USER_INFO);
    set({ token: null, userInfo: null });
  },
}));
