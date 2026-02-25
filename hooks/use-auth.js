"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import Cookies from "js-cookie";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Use try-catch to handle cases where toast might not be available
  let toast;
  try {
    toast = useToast();
  } catch (e) {
    // Toast not available yet, create a dummy toast function
    toast = {
      toast: ({ title, description, variant }) => {
        console.log("Toast:", { title, description, variant });
      },
    };
  }

  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("token");

      console.log("Checking auth, token exists:", !!token);

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        console.log("Auth check successful:", result.data);
        setUser(result.data);
        setIsAuthenticated(true);
      } else {
        console.log("Auth check failed:", result.error);
        // Token invalid or expired
        Cookies.remove("token");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          // Store token in cookie with proper options
          Cookies.set("token", result.token, {
            expires: 7, // 7 days
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          setUser(result.data);
          setIsAuthenticated(true);

          if (toast?.toast) {
            // Get the user's name from the response data
            const userName =
              result.data.name || result.data.email.split("@")[0] || "User";

            toast.toast({
              title: "✅ Welcome Back!",
              description: ` ${userName}`,
            });
          }

          return { success: true, data: result.data };
        } else {
          throw new Error(result.error || "Login failed");
        }
      } catch (error) {
        if (toast?.toast) {
          toast.toast({
            title: "❌ Login Failed",
            description: error.message || "Invalid credentials",
            variant: "destructive",
          });
        }
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const register = useCallback(
    async (email, password, name) => {
      try {
        setIsLoading(true);

        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          // Store token in cookie
          Cookies.set("token", result.token, {
            expires: 7,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
          });

          setUser(result.data);
          setIsAuthenticated(true);

          if (toast?.toast) {
            // Get the user's name from the registration data
            const userName =
              result.data.name ||
              name ||
              result.data.email.split("@")[0] ||
              "User";

            toast.toast({
              title: "✅ Account Created!",
              description: `Welcome, ${userName}!`,
            });
          }

          return { success: true, data: result.data };
        } else {
          throw new Error(result.error || "Registration failed");
        }
      } catch (error) {
        if (toast?.toast) {
          toast.toast({
            title: "❌ Registration Failed",
            description: error.message || "Could not create account",
            variant: "destructive",
          });
        }
        return { success: false, error: error.message };
      } finally {
        setIsLoading(false);
      }
    },
    [toast],
  );

  const logout = useCallback(async () => {
    try {
      const token = Cookies.get("token");

      if (token) {
        // Call logout endpoint
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Get user name before clearing state for the toast
      const userName = user?.name || user?.email?.split("@")[0] || "User";

      // Remove token and clear state
      Cookies.remove("token", { path: "/" });
      setUser(null);
      setIsAuthenticated(false);

      if (toast?.toast) {
        toast.toast({
          title: "👋 Logged Out Successfully",
          description: `Goodbye, ${userName}! See you again soon!`,
        });
      }

      router.push("/");
    }
  }, [toast, router, user]);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
