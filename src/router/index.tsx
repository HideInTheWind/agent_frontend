import { Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { routes } from "./routes";
import { Spin } from "antd";

function SuspenseLayout() {
  return (
    <Suspense fallback={<Spin spinning={true} size="large" />}>
      <Outlet />
    </Suspense>
  );
}

const router = createBrowserRouter([
  { element: <SuspenseLayout />, children: routes },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
