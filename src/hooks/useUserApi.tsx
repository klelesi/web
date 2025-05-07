import useClientAxios from "@/hooks/useClientAxios";
import { useCallback, useContext } from "react";
import { AuthContext } from "@/hooks/auth-provider";
import { useRouter } from "next/navigation";

export default function useUserApi() {
  const client = useClientAxios();
  const { loginUser } = useContext(AuthContext);
  const router = useRouter();

  const getProfile = useCallback(() => {
    return client.get("/user");
  }, [client]);

  const getPermissions = () => {
    return client.get("/user/permissions");
  };

  const getNotifications = useCallback(() => {
    return client.get("/user/notifications");
  }, [client]);

  const readNotification = useCallback(
    (notificationId: string) => {
      return client.post("/user/notifications", { notificationId });
    },
    [client],
  );

  const deleteProvider = useCallback(
    (provider: string) => {
      return client.delete(`/auth/${provider}`);
    },
    [client],
  );

  const updateProfile = (data: { name: string }) => {
    return client.put("/user", data);
  };

  const register = (data: { name: string; password?: string; email: string, username:string, token?:string }) => {
    return client.post("/auth/register", data);
  };

  const login = (data: { password: string; email: string }) => {
    return client.post("/auth/login", data);
  };

  const passwordRequest = (data: { email: string }) => {
    return client.post("/auth/password-request", data);
  };

  const passwordReset = (data: { email: string; token: string; password: string }) => {
    return client.post("/auth/password-reset", data);
  };

  const logout = () => {
    return client.post("/auth/logout", {});
  };

  const checkLogin = useCallback((callback = () => {}) => {
    getProfile().then(
      (success) => {
        loginUser(success.data.data);
        router.push("/");
      },
      () => {
        callback();
      },
    );
  }, [getProfile, loginUser, router]);

  return {
    getProfile,
    updateProfile,
    logout,
    register,
    checkLogin,
    login,
    passwordRequest,
    passwordReset,
    getPermissions,
    getNotifications,
    readNotification,
    deleteProvider,
  };
}
