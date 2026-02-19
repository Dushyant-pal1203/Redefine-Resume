"use client";

import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function useUploadResume() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const getToken = useCallback(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }, []);

  const uploadResume = useCallback(
    async (file, userId) => {
      if (!file) {
        toast({
          title: "❌ No File",
          description: "Please select a file to upload",
          variant: "destructive",
        });
        return null;
      }

      if (!userId) {
        toast({
          title: "❌ Authentication Required",
          description: "Please log in to upload a resume",
          variant: "destructive",
        });
        return null;
      }

      const formData = new FormData();
      formData.append("resume", file);

      try {
        setIsLoading(true);
        setProgress(0);

        // Simulate progress
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/upload/resume`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        });

        clearInterval(progressInterval);
        setProgress(100);

        const result = await response.json();

        if (result.success) {
          toast({
            title: "✅ Upload Successful",
            description: "Your resume has been parsed successfully.",
          });

          // Return the parsed resume data
          return result.data?.resume || result.data;
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "❌ Upload Failed",
          description:
            error.message ||
            "Could not upload file. Make sure the backend is running.",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    },
    [toast, getToken],
  );

  const uploadAndParse = useCallback(
    async (file) => {
      if (!file) return null;

      const formData = new FormData();
      formData.append("resume", file);

      try {
        setIsLoading(true);

        const token = getToken();
        const response = await fetch(`${API_BASE_URL}/api/upload/parse`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || "Parse failed");
        }
      } catch (error) {
        console.error("Parse error:", error);
        toast({
          title: "❌ Parse Failed",
          description: error.message || "Could not parse PDF",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, getToken],
  );

  return {
    uploadResume,
    uploadAndParse,
    isLoading,
    progress,
  };
}
