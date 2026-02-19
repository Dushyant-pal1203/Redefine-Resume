"use client";

import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function usePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = useCallback(
    async (resumeId) => {
      if (!resumeId) {
        toast({
          title: "❌ No Resume ID",
          description: "Resume ID is required",
          variant: "destructive",
        });
        return null;
      }

      try {
        setIsGenerating(true);

        const response = await fetch(
          `${API_BASE_URL}/api/pdf/generate/${resumeId}`,
          {
            method: "GET",
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to generate PDF");
        }

        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("Generated PDF is empty");
        }

        return blob;
      } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({
          title: "❌ Generation Failed",
          description: error.message || "Could not generate PDF",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [toast],
  );

  const downloadPDF = useCallback(
    async (resumeId, filename = "resume.pdf") => {
      const blob = await generatePDF(resumeId);
      if (!blob) return false;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ Success",
        description: "PDF downloaded successfully",
      });

      return true;
    },
    [generatePDF, toast],
  );

  return {
    generatePDF,
    downloadPDF,
    isGenerating,
  };
}
