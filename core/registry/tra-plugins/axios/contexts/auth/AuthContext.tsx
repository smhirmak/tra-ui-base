/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  createRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import RequestService, {
  setAxiosAuthToken,
  setAxiosLogoutCallback,
  type CustomAxiosResponse,
} from "@/lib/axios-config";
import StorageKeys from "@/constants/StorageKeys";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface AuthUser {
  [key: string]: any;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  authToken: string | null;
  login: (data: Record<string, any>) => Promise<void>;
  logout: () => Promise<void>;
  getUserDetail: () => Promise<void>;
}

// ─── Auth Logout Ref (for interceptors) ──────────────────────────────────────
export const authLogoutRef = createRef<{ logout: () => Promise<void> }>();

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Helper: Response Check ──────────────────────────────────────────────────
function isResponseSuccessful(response: CustomAxiosResponse<any>): boolean {
  return (
    response &&
    response.status >= 200 &&
    response.status < 300 &&
    !response.error
  );
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem(StorageKeys.ACCESS_TOKEN),
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem(StorageKeys.ACCESS_TOKEN),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const clearUserInfo = () => {
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(StorageKeys.USER);
    setAuthToken(null);
    setIsAuthenticated(false);
    setAxiosAuthToken(null);
  };

  const logout = async () => {
    if (!isAuthenticated) return;
    clearUserInfo();
    setUser(null);
  };

  const login = async (data: Record<string, any>) => {
    // TODO: Login endpoint'inize göre düzenleyin
    const response: CustomAxiosResponse<any> = await RequestService.post(
      "/auth/login",
      data,
    );
    if (isResponseSuccessful(response)) {
      const token = response.data?.token ?? response.data?.accessToken;
      setAuthToken(token);
      localStorage.setItem(StorageKeys.ACCESS_TOKEN, token);
      setAxiosAuthToken(token);
      setIsAuthenticated(true);
      setUser(response.data);
    } else {
      setUser(null);
      throw new Error(response.message ?? "Giriş başarısız");
    }
  };

  const getUserDetail = async () => {
    // TODO: User detail endpoint'inize göre düzenleyin
    const response = await RequestService.get("/auth/me");
    if (isResponseSuccessful(response)) {
      setUser(response.data);
    }
  };

  useImperativeHandle(authLogoutRef, () => ({ logout }));

  // Axios interceptor'a logout callback'i kaydet
  useEffect(() => {
    setAxiosLogoutCallback(() => {
      clearUserInfo();
      setUser(null);
    });
  }, []);

  // Token doğrulama
  useEffect(() => {
    const verifyToken = async () => {
      setIsLoading(true);
      if (!authToken) {
        clearUserInfo();
        setIsLoading(false);
        return;
      }
      setAxiosAuthToken(authToken);
      try {
        // TODO: Token doğrulama endpoint'inize göre düzenleyin
        const response = await RequestService.get("/auth/me");
        if (isResponseSuccessful(response)) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          clearUserInfo();
        }
      } catch {
        clearUserInfo();
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [authToken]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      authToken,
      login,
      logout,
      getUserDetail,
    }),
    [isAuthenticated, isLoading, user, authToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
