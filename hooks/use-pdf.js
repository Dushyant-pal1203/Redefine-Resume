// hooks/use-pdf.js
"use client";

import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function usePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = useCallback(
    async (resumeId, template = "modern") => {
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
          `${API_BASE_URL}/api/pdf/generate/${resumeId}?template=${template}`,
          {
            method: "GET",
            headers: {
              Accept: "application/pdf",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Failed to generate PDF (Status: ${response.status})`,
          );
        }

        const blob = await response.blob();

        if (blob.size === 0) {
          throw new Error("Generated PDF is empty");
        }

        if (blob.type !== "application/pdf") {
          console.warn("Unexpected content type:", blob.type);
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
    async (resumeId, filename = "resume.pdf", template = "modern") => {
      const blob = await generatePDF(resumeId, template);
      if (!blob) return false;

      // Create filename with template name if not provided
      const finalFilename = filename.includes(".pdf")
        ? filename
        : `${filename}-${template}.pdf`;

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: "✅ Success",
        description: "PDF downloaded successfully",
      });

      return true;
    },
    [generatePDF, toast],
  );

  const previewPDF = useCallback(
    async (resumeId, template = "modern") => {
      const blob = await generatePDF(resumeId, template);
      if (!blob) return false;

      // Open PDF in new tab for preview
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Cleanup after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      return true;
    },
    [generatePDF],
  );

  return {
    generatePDF,
    downloadPDF,
    previewPDF,
    isGenerating,
  };
}
