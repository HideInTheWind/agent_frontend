// import { Navigate, Outlet } from "react-router-dom";
// import { ROUTES } from "@/constants";
// import { useUserStore } from "@/stores/useUserStore";

import { Outlet } from "react-router-dom";

export default function AuthGuard() {
  // const token = useUserStore((state) => state.token);

  // if (!token) {
  //   return <Navigate to={ROUTES.DASHBOARD} replace />;
  // }

  return <Outlet />;
}
