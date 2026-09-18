import { lazy } from "react";

export const Dashboard = lazy(() => import("@/pages/dashboard"));
export const ChatWindow = lazy(() => import("@/pages/chatWindow"));

//  preload 预加载组件
export const preloadDashboard = () => import("@/pages/dashboard");
export const preloadChatWindow = () => import("@/pages/chatWindow");
