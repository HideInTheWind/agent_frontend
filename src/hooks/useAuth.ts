import { useCallback } from "react";
import { useUserStore } from "@/stores/useUserStore";

export function useAuth() {
  // const navigate = useNavigate();
  const token = useUserStore((state) => state.token);
  const userInfo = useUserStore((state) => state.userInfo);
  const logout = useUserStore((state) => state.logout);
  // const hasPermission = useUserStore((state) => state.hasPermission)

  const handleLogout = useCallback(() => {
    logout();
    // navigate(ROUTES.LOGIN, { replace: true })
  }, [logout]);

  return {
    token,
    userInfo,
    isLoggedIn: Boolean(token),
    logout: handleLogout,
    // hasPermission,
  };
}
