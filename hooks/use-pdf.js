// client/hooks/use-pdf.js
"use client";

import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export function usePDF() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const generatePDF = useCallback(
    async (resumeId, template = "modern", resumeData = null) => {
      if (!resumeId && !resumeData) {
        toast({
          title: "❌ Missing Data",
          description: "Either Resume ID or Resume Data is required",
          variant: "destructive",
        });
        return null;
      }

      try {
        setIsGenerating(true);
        setProgress(30);
        setError(null);

        // If resumeData is provided, use the new endpoint
        if (resumeData) {
          console.log("📄 Generating PDF with provided data");

          // Ensure we're sending the complete data structure
          const payload = {
            resumeData: resumeData,
            template: template,
          };

          setProgress(50);

          const response = await fetch(
            `${API_BASE_URL}/api/pdf/generate-with-data`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/pdf",
              },
              body: JSON.stringify(payload),
            },
          );

          setProgress(80);

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

          setProgress(100);
          return blob;
        } else {
          // Fallback to the old method
          setProgress(50);

          const response = await fetch(
            `${API_BASE_URL}/api/pdf/generate/${resumeId}?template=${template}`,
            {
              method: "GET",
              headers: {
                Accept: "application/pdf",
              },
            },
          );

          setProgress(80);

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

          setProgress(100);
          return blob;
        }
      } catch (error) {
        console.error("❌ PDF Generation Error:", error);
        setError(error.message);
        toast({
          title: "❌ Generation Failed",
          description: error.message || "Could not generate PDF",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [toast],
  );

  const previewPDF = useCallback(
    async (resumeId, template = "modern", resumeData = null) => {
      if (!resumeId && !resumeData) {
        toast({
          title: "❌ Missing Data",
          description: "Either Resume ID or Resume Data is required",
          variant: "destructive",
        });
        return false;
      }

      try {
        setIsGenerating(true);
        setError(null);

        if (resumeData) {
          // Use preview endpoint for data
          const response = await fetch(`${API_BASE_URL}/api/pdf/preview`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/pdf",
            },
            body: JSON.stringify({
              resumeData: resumeData,
              template: template,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to generate preview");
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");

          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        } else {
          // For existing resumes, use the generate endpoint with inline disposition
          const response = await fetch(
            `${API_BASE_URL}/api/pdf/generate/${resumeId}?template=${template}`,
            {
              headers: {
                Accept: "application/pdf",
              },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to generate preview");
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");

          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        }

        return true;
      } catch (error) {
        console.error("❌ PDF Preview Error:", error);
        toast({
          title: "❌ Preview Failed",
          description: error.message || "Could not preview PDF",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    [toast],
  );

  const downloadPDF = useCallback(
    async (
      resumeId,
      filename = "resume.pdf",
      template = "modern",
      resumeData = null,
    ) => {
      const blob = await generatePDF(resumeId, template, resumeData);
      if (!blob) return false;

      // Generate filename
      let finalFilename = filename;
      if (!finalFilename.includes(".pdf")) {
        let name = "resume";
        if (resumeData) {
          name =
            resumeData.full_name ||
            resumeData.personal?.full_name ||
            resumeData.name ||
            "resume";
        }
        finalFilename = `${name.replace(/\s+/g, "_")}_${template}.pdf`;
      }

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

  return {
    generatePDF,
    downloadPDF,
    previewPDF,
    isGenerating,
    progress,
    error,
  };
}
