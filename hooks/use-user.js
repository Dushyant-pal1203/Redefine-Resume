"use client";

import { useAuth } from "./use-auth";

export function useUser() {
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    userId: user?.id,
    userEmail: user?.email,
    userName: user?.name,
    updateUser,
  };
}
