import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import BasicLayout from "@/layouts/BasicLayout";
// import BlankLayout from "@/layouts/BlankLayout";
import { Dashboard, ChatWindow } from "./lazyPages";
import { ROUTES } from "@/constants";

export const routes: RouteObject[] = [
  // {
  //   path: "/login",
  //   element: <BlankLayout />,
  //   children: [{ index: true, element: <Login /> }],
  // },
  {
    path: ROUTES.DASHBOARD,
    element: <AuthGuard />,
    children: [
      {
        element: <BasicLayout />,
        children: [
          // { index: true, element: <Dashboard /> },
          // { path: ROUTES.CHAT_WINDOW, element: <ChatWindow /> },
          { index: true, element: <ChatWindow /> },
          // { path: ROUTES.CHAT_WINDOW, element: <ChatWindow /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
];
