import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { axiosClient, setAccessToken } from "../api/axiosClient.js";
import { registerRequest, loginRequest, refreshRequest, logoutRequest, meRequest } from "../api/authApi.js";

const AuthContext = createContext(null);

const REFRESH_TOKEN_KEY = "veteapp.refreshToken";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [veterinaria, setVeterinaria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const applySession = useCallback((data) => {
    setAccessToken(data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    setUsuario(data.usuario);
    setVeterinaria(data.veterinaria);
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUsuario(null);
    setVeterinaria(null);
  }, []);

  useEffect(() => {
    const interceptorId = axiosClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (error.response?.status === 401 && !originalRequest._retry && storedRefreshToken) {
          originalRequest._retry = true;
          try {
            const data = await refreshRequest(storedRefreshToken);
            setAccessToken(data.accessToken);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return axiosClient(originalRequest);
          } catch {
            clearSession();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => axiosClient.interceptors.response.eject(interceptorId);
  }, [clearSession]);

  useEffect(() => {
    async function restoreSession() {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const tokens = await refreshRequest(storedRefreshToken);
        setAccessToken(tokens.accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);

        const profile = await meRequest();
        setUsuario(profile.usuario);
        setVeterinaria(profile.veterinaria);
      } catch {
        clearSession();
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, [clearSession]);

  const login = useCallback(
    async ({ email, password }) => {
      const data = await loginRequest({ email, password });
      applySession(data);
    },
    [applySession]
  );

  const register = useCallback(
    async (payload) => {
      const data = await registerRequest(payload);
      applySession(data);
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    try {
      if (storedRefreshToken) {
        await logoutRequest(storedRefreshToken);
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = {
    usuario,
    veterinaria,
    isLoading,
    isAuthenticated: Boolean(usuario),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
