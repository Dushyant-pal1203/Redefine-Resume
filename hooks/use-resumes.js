// hooks/use-resumes.js
"use client";

import { useState, useCallback, useEffect } from "react";
import { useToast } from "./use-toast";
import { useAuth } from "./use-auth"; // Use useAuth directly instead of useUser

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Main hook for all resume operations
export function useResumes() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth(); // Use useAuth directly

  const getToken = useCallback(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }, []);

  const fetchResumes = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      console.log("Not authenticated, skipping fetch");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = getToken();
      console.log("Fetching resumes for authenticated user");

      const response = await fetch(`${API_BASE_URL}/api/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`,
        );
      }

      const result = await response.json();
      console.log("Fetch result:", result);

      if (result.success) {
        setResumes(result.data);
        return result.data;
      } else {
        throw new Error(result.error || "Failed to fetch resumes");
      }
    } catch (err) {
      console.error("Error fetching resumes:", err);
      setError(err.message);
      toast({
        title: "❌ Error",
        description: "Failed to load resumes. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, toast, getToken]);

  // hooks/use-resumes.js - Update the createResume function

  const createResume = useCallback(
    async (resumeData) => {
      if (!isAuthenticated || !user?.id) {
        toast({
          title: "❌ Authentication Required",
          description: "Please log in to create a resume",
          variant: "destructive",
        });
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();

        // Deep clone and clean the data
        const cleanedData = JSON.parse(JSON.stringify(resumeData));

        // Helper function to validate URL
        const isValidUrl = (string) => {
          if (!string) return true; // Empty is allowed
          try {
            new URL(string);
            return true;
          } catch {
            return false;
          }
        };

        // Validate all URL fields
        const urlFields = [
          "portfolio_url",
          "linkedin_url",
          "github_url",
          "twitter_url",
        ];
        for (const field of urlFields) {
          if (cleanedData[field] && !isValidUrl(cleanedData[field])) {
            // If invalid, remove it
            delete cleanedData[field];
          }
        }

        // Validate URLs in projects
        if (cleanedData.projects && Array.isArray(cleanedData.projects)) {
          cleanedData.projects = cleanedData.projects.map((project) => {
            if (project.url && !isValidUrl(project.url)) {
              const { url, ...rest } = project;
              return rest;
            }
            return project;
          });
        }

        // Validate URLs in certifications
        if (
          cleanedData.certifications &&
          Array.isArray(cleanedData.certifications)
        ) {
          cleanedData.certifications = cleanedData.certifications.map(
            (cert) => {
              if (cert.url && !isValidUrl(cert.url)) {
                const { url, ...rest } = cert;
                return rest;
              }
              return cert;
            },
          );
        }

        // Ensure we're not sending resume_id or id
        const { resume_id, id, ...cleanData } = cleanedData;

        // Add required fields with defaults
        const dataToSend = {
          ...cleanData,
          resume_title: cleanData.resume_title || "Untitled Resume",
          version: 1,
          template: cleanData.template || "modern",
          theme_color: cleanData.theme_color || "#2563eb",
          font_family: cleanData.font_family || "Inter",
          layout: cleanData.layout || "single-column",
          is_public: cleanData.is_public || false,
        };

        console.log("Creating resume with validated data:", dataToSend);

        const response = await fetch(`${API_BASE_URL}/api/resumes`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
          credentials: "include",
        });

        const result = await response.json();
        console.log("Create resume response:", result);

        if (result.success) {
          setResumes((prev) => [result.data, ...prev]);
          toast({
            title: "✅ Success",
            description: "Resume created successfully",
          });
          return result.data;
        } else {
          throw new Error(result.error || "Failed to create resume");
        }
      } catch (err) {
        console.error("Error creating resume:", err);
        setError(err.message);
        toast({
          title: "❌ Error",
          description: err.message || "Failed to create resume",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user?.id, toast, getToken],
  );

  // Also update the updateResume function similarly
  const updateResume = useCallback(
    async (resumeId, resumeData) => {
      if (!resumeId) return null;

      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();

        // Deep clone and clean the data
        const cleanedData = JSON.parse(JSON.stringify(resumeData));

        // Helper function to validate URL
        const isValidUrl = (string) => {
          if (!string) return true; // Empty is allowed
          try {
            new URL(string);
            return true;
          } catch {
            return false;
          }
        };

        // Validate all URL fields
        const urlFields = [
          "portfolio_url",
          "linkedin_url",
          "github_url",
          "twitter_url",
        ];
        for (const field of urlFields) {
          if (cleanedData[field] && !isValidUrl(cleanedData[field])) {
            // If invalid, remove it
            delete cleanedData[field];
          }
        }

        // Validate URLs in projects
        if (cleanedData.projects && Array.isArray(cleanedData.projects)) {
          cleanedData.projects = cleanedData.projects.map((project) => {
            if (project.url && !isValidUrl(project.url)) {
              const { url, ...rest } = project;
              return rest;
            }
            return project;
          });
        }

        // Validate URLs in certifications
        if (
          cleanedData.certifications &&
          Array.isArray(cleanedData.certifications)
        ) {
          cleanedData.certifications = cleanedData.certifications.map(
            (cert) => {
              if (cert.url && !isValidUrl(cert.url)) {
                const { url, ...rest } = cert;
                return rest;
              }
              return cert;
            },
          );
        }

        const response = await fetch(
          `${API_BASE_URL}/api/resumes/${resumeId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(cleanedData),
            credentials: "include",
          },
        );

        const result = await response.json();

        if (result.success) {
          setResumes((prev) =>
            prev.map((r) => (r.resume_id === resumeId ? result.data : r)),
          );

          toast({
            title: "✅ Success",
            description: "Resume updated successfully",
          });
          return result.data;
        } else {
          throw new Error(result.error || "Failed to update resume");
        }
      } catch (err) {
        console.error("Error updating resume:", err);
        setError(err.message);
        toast({
          title: "❌ Error",
          description: err.message || "Failed to update resume",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, getToken],
  );

  const fetchResumeById = useCallback(
    async (resumeId) => {
      if (!resumeId) return null;

      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();
        const response = await fetch(
          `${API_BASE_URL}/api/resumes/${resumeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const result = await response.json();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || "Failed to fetch resume");
        }
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(err.message);
        toast({
          title: "❌ Error",
          description: "Failed to load resume",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, getToken],
  );

  const deleteResume = useCallback(
    async (resumeId) => {
      if (!resumeId) return false;

      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();
        const response = await fetch(
          `${API_BASE_URL}/api/resumes/${resumeId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const result = await response.json();

        if (result.success) {
          setResumes((prev) => prev.filter((r) => r.resume_id !== resumeId));

          toast({
            title: "✅ Deleted",
            description: "Resume deleted successfully",
          });
          return true;
        } else {
          throw new Error(result.error || "Failed to delete resume");
        }
      } catch (err) {
        console.error("Error deleting resume:", err);
        setError(err.message);
        toast({
          title: "❌ Error",
          description: err.message || "Failed to delete resume",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, getToken],
  );

  const togglePublic = useCallback(
    async (resumeId) => {
      if (!resumeId) return null;

      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();
        const response = await fetch(
          `${API_BASE_URL}/api/resumes/${resumeId}/toggle-public`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const result = await response.json();

        if (result.success) {
          setResumes((prev) =>
            prev.map((r) => (r.resume_id === resumeId ? result.data : r)),
          );

          toast({
            title: result.data.is_public ? "🌐 Public" : "🔒 Private",
            description: `Resume is now ${result.data.is_public ? "public" : "private"}`,
          });
          return result.data;
        } else {
          throw new Error(result.error || "Failed to update visibility");
        }
      } catch (err) {
        console.error("Error toggling public:", err);
        setError(err.message);
        toast({
          title: "❌ Error",
          description: err.message || "Failed to update visibility",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, getToken],
  );

  const duplicateResume = useCallback(
    async (resumeId) => {
      if (!resumeId) return null;

      try {
        setIsLoading(true);
        setError(null);

        const token = getToken();
        const response = await fetch(
          `${API_BASE_URL}/api/resumes/${resumeId}/duplicate`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          },
        );

        const result = await response.json();

        if (result.success) {
          setResumes((prev) => [result.data, ...prev]);
          toast({
            title: "📋 Duplicated",
            description: "Resume duplicated successfully",
          });
          return result.data;
        } else {
          throw new Error(result.error || "Failed to duplicate resume");
        }
      } catch (err) {
        console.error("Error duplicating resume:", err);
        setError(err.message);
        toast({
          title: "❌ Error",
          description: err.message || "Failed to duplicate resume",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, getToken],
  );

  // Load resumes on mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchResumes();
    }
  }, [isAuthenticated, user?.id, fetchResumes]);

  return {
    resumes,
    isLoading,
    error,
    fetchResumes,
    fetchResumeById,
    createResume,
    updateResume,
    deleteResume,
    togglePublic,
    duplicateResume,
  };
}

// Hook for single resume operations
export function useResume(resumeId) {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchResume = useCallback(async () => {
    if (!resumeId) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = document.cookie
        .split(";")
        .find((c) => c.trim().startsWith("token="))
        ?.split("=")[1];

      const response = await fetch(`${API_BASE_URL}/api/resumes/${resumeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        setResume(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch resume");
      }
    } catch (err) {
      console.error("Error fetching resume:", err);
      setError(err.message);
      toast({
        title: "❌ Error",
        description: "Failed to load resume",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [resumeId, toast]);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId, fetchResume]);

  return { resume, isLoading, error, refetch: fetchResume };
}

// Individual operation hooks
export function useDeleteResume() {
  const { deleteResume, isLoading } = useResumes();
  return { mutate: deleteResume, isLoading };
}

export function useTogglePublicResume() {
  const { togglePublic, isLoading } = useResumes();
  return { mutate: togglePublic, isLoading };
}

export function useCreateResume() {
  const { createResume, isLoading } = useResumes();
  return { mutate: createResume, isLoading };
}

export function useUpdateResume() {
  const { updateResume, isLoading } = useResumes();
  return { mutate: updateResume, isLoading };
}

export function useDuplicateResume() {
  const { duplicateResume, isLoading } = useResumes();
  return { mutate: duplicateResume, isLoading };
}

// Upload hook
export function useUploadResume() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const getToken = useCallback(() => {
    const cookies = document.cookie.split(";");
    const tokenCookie = cookies.find((c) => c.trim().startsWith("token="));
    return tokenCookie ? tokenCookie.split("=")[1] : null;
  }, []);

  // hooks/use-resumes.js - Update the uploadResume function

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
        console.log(
          "📤 Uploading file to:",
          `${API_BASE_URL}/api/upload/resume`,
        );

        const response = await fetch(`${API_BASE_URL}/api/upload/resume`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        });

        clearInterval(progressInterval);

        // Parse the response
        const result = await response.json();
        console.log("📥 Upload response:", result);

        if (!response.ok) {
          throw new Error(
            result.error ||
              result.details ||
              `Upload failed with status: ${response.status}`,
          );
        }

        if (result.success) {
          setProgress(100);

          // Extract the resume data from your backend's response structure
          // Your backend returns: { success: true, data: { file: {...}, resume: {...} } }
          const resumeData = result.data?.resume || result.data;

          // Show success message
          toast({
            title: "✅ Upload Successful",
            description: "Your resume has been parsed successfully.",
          });

          // If email was cleaned, show a warning
          if (resumeData && !resumeData.email) {
            toast({
              title: "⚠️ Email Not Found",
              description:
                "No valid email was found in the PDF. You can enter it manually.",
              variant: "default",
            });
          }

          return resumeData;
        } else {
          throw new Error(result.error || "Upload failed");
        }
      } catch (error) {
        console.error("❌ Upload error:", error);
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

  return {
    uploadResume,
    isLoading,
    progress,
  };
}
