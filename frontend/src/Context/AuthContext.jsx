
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
} from "../Service/AuthApi";

const AuthContext = createContext(null);

const TOKEN_KEY = "fashionToken";
const USER_KEY = "fashionUser";

function normalizeRole(role) {
  const value = String(role ?? "")
    .replace(/^ROLE_/i, "")
    .toUpperCase();

  return ["ADMIN", "USER"].includes(value) ? value : "";
}

function getSavedSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (!token || !savedUser) {
      return { token: "", user: null };
    }

    const user = JSON.parse(savedUser);

    if (!normalizeRole(user.role)) {
      return { token: "", user: null };
    }

    return {
      token,
      user: {
        ...user,
        role: normalizeRole(user.role),
      },
    };
  } catch {
    return { token: "", user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSavedSession);
  const [loading, setLoading] = useState(false);

  const token = session.token;
  const user = session.user;

  const role = normalizeRole(user?.role);

  const isAuthenticated = Boolean(token && user);

  const saveSession = (response) => {
    const data = response?.data ?? response;

    const jwt = data?.token;
    const rawRole = data?.role ?? data?.user?.role;
    const normalizedRole = normalizeRole(rawRole);

    if (!jwt || !normalizedRole) {
      throw new Error(
        "Login response is missing a valid token or role."
      );
    }

    const userData = {
      userId: data.userId ?? data.user?.userId ?? null,
      name: data.name ?? data.user?.name ?? "",
      email: data.email ?? data.user?.email ?? "",
      role: normalizedRole,
    };

    localStorage.setItem(TOKEN_KEY, jwt);
    localStorage.setItem(
      USER_KEY,
      JSON.stringify(userData)
    );

    setSession({
      token: jwt,
      user: userData,
    });

    return {
      ...data,
      token: jwt,
      role: normalizedRole,
    };
  };

  const login = async (credentials) => {
    setLoading(true);

    try {
      const response = await loginUser(credentials);
      return saveSession(response);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);

    try {
      const response = await registerUser(userData);

      // Registration only creates an account.
      // Customer logs in separately afterward.
      return response?.data ?? response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Clear legacy keys from the previous login code.
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setSession({
      token: "",
      user: null,
    });
  };

  // Synchronize login/logout across browser tabs.
  useEffect(() => {
    const handleStorage = (event) => {
      if (
        event.key === TOKEN_KEY ||
        event.key === USER_KEY ||
        event.key === null
      ) {
        setSession(getSavedSession());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
