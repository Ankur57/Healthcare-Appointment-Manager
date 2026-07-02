import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const getCurrentUser =
    async () => {
      try {
        const res =
          await api.get(
            "/auth/me"
          );

        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    setUser(res.data.user);
    return res;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const registerUser = async (data) => {
    const res = await api.post("/auth/register", data);
    setUser(res.data.user);
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);