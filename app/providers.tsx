"use client";

import { ToastProvider } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toast";
import { AuthProvider } from "@/hooks/use-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {" "}
      {/* ToastProvider must be outer-most */}
      <AuthProvider>
        {" "}
        {/* AuthProvider can use toast, so it must be inside ToastProvider */}
        {children}
        <Toaster />
      </AuthProvider>
    </ToastProvider>
  );
}
