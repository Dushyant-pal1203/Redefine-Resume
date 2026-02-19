"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function useTemplates() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const url = `${API_BASE_URL}/api/templates`;
      console.log("Fetching templates from:", url);

      // Try both ports to debug
      console.log("Trying port 5001 (from .env)...");

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response OK?", response.ok);

      if (!response.ok) {
        // Try to get error details
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status} - ${errorText}`,
        );
      }

      const result = await response.json();
      console.log("Templates response:", result);

      if (result.success) {
        setTemplates(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch templates");
      }
    } catch (err) {
      console.error("Error fetching templates:", {
        message: err.message,
        name: err.name,
        stack: err.stack,
      });
      setError(err.message);
      toast({
        title: "❌ Connection Error",
        description: `Failed to connect to server at ${API_BASE_URL}. Make sure backend is running.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const getTemplateById = useCallback(
    async (templateId) => {
      if (!templateId) return null;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/templates/${templateId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || "Failed to fetch template");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        toast({
          title: "❌ Error",
          description: `Failed to load template: ${templateId}`,
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  const getTemplateMetadata = useCallback(async (templateId) => {
    if (!templateId) return null;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/templates/${templateId}/metadata`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || "Failed to fetch template metadata");
      }
    } catch (err) {
      console.error("Error fetching template metadata:", err);
      return null;
    }
  }, []);

  return {
    templates,
    isLoading,
    error,
    refetch: fetchTemplates,
    getTemplateById,
    getTemplateMetadata,
  };
}

export function useTemplate(templateId) {
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!templateId) {
        setTemplate(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log("Fetching template:", templateId);

        const response = await fetch(
          `${API_BASE_URL}/api/templates/${templateId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Template response:", result);

        if (result.success) {
          setTemplate(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch template");
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError(err.message);
        toast({
          title: "❌ Template Error",
          description: `Failed to load template: ${templateId}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, toast]);

  return { template, isLoading, error };
}
