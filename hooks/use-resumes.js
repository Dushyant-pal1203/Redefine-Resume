"use client";

import { useState, useEffect } from "react";
import { useToast } from "./use-toast";

const API_BASE = "http://localhost:5001/api/resume";
const API_BASE_PDF = "http://localhost:5001/api/upload/pdf";
const API_BASE_PDF_GENERATE = "http://localhost:5001/api/pdf/generate"; // Fixed: removed extra quotes

/* =====================================================
   GET ALL RESUMES
===================================================== */
export function useResumes() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error("Failed to fetch resumes");
      const result = await response.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching resumes:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return { data, isLoading, error, refetch: fetchResumes };
}

/* =====================================================
   CREATE FRESH RESUME
===================================================== */
export function useCreateResume() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createResume = async (resumeData) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) throw new Error("Failed to create resume");
      const result = await response.json();

      toast({
        title: "✨ New Artifact Created",
        description: "Your fresh resume has been forged successfully",
      });

      return result;
    } catch (err) {
      toast({
        title: "❌ Creation Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: createResume, isLoading };
}

/* =====================================================
   UPDATE RESUME
===================================================== */
export function useUpdateResume() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateResume = async (id, resumeData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) throw new Error("Failed to update resume");
      const result = await response.json();

      toast({
        title: "💾 Resume Updated",
        description: "Changes saved successfully",
      });

      return result;
    } catch (err) {
      toast({
        title: "❌ Update Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: updateResume, isLoading };
}

/* =====================================================
   SAVE RESUME (AUTO CREATE OR UPDATE)
===================================================== */
export function useSaveResume() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveResume = async (resumeData) => {
    setIsLoading(true);
    try {
      const isEdit = resumeData.resume_id || resumeData.id;
      const response = await fetch(
        isEdit
          ? `${API_BASE}/${resumeData.resume_id || resumeData.id}`
          : API_BASE,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeData),
        },
      );

      if (!response.ok) throw new Error("Failed to save resume");
      const result = await response.json();

      toast({
        title: isEdit ? "💾 Resume Updated" : "✨ Resume Created",
        description: isEdit
          ? "Changes saved successfully"
          : "New resume saved successfully",
      });

      return result;
    } catch (err) {
      toast({
        title: "❌ Save Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: saveResume, isLoading };
}

/* =====================================================
   DELETE RESUME
===================================================== */
export function useDeleteResume() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const deleteResume = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete resume");
      const result = await response.json();

      toast({
        title: "🗑 Resume Deleted",
        description: "Artifact removed successfully",
      });

      return result;
    } catch (err) {
      toast({
        title: "❌ Delete Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: deleteResume, isLoading };
}

/* =====================================================
   DUPLICATE RESUME
===================================================== */
export function useDuplicateResume() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const duplicateResume = async (id) => {
    setIsLoading(true);
    try {
      // First fetch the resume to duplicate
      const getResponse = await fetch(`${API_BASE}/${id}`);
      if (!getResponse.ok)
        throw new Error("Failed to fetch resume for duplication");

      const resumeData = await getResponse.json();

      // Remove id fields to create new entry
      const {
        resume_id,
        id: oldId,
        created_at,
        updated_at,
        ...newResumeData
      } = resumeData.data;

      // Create new resume with duplicated data
      const createResponse = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResumeData),
      });

      if (!createResponse.ok) throw new Error("Failed to duplicate resume");
      const result = await createResponse.json();

      toast({
        title: "📄 Resume Duplicated",
        description: "Artifact cloned successfully",
      });

      return result;
    } catch (err) {
      toast({
        title: "❌ Duplicate Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: duplicateResume, isLoading };
}

/* =====================================================
   UPLOAD RESUME (PDF)
===================================================== */
export function useUploadResume() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uploadResume = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch(API_BASE_PDF, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload resume");
      const result = await response.json();

      toast({
        title: "📄 PDF Uploaded",
        description: "Resume parsed successfully",
      });

      return result;
    } catch (err) {
      toast({
        title: "❌ Upload Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: uploadResume, isLoading };
}

/* =====================================================
   GENERATE PDF (PDF)
===================================================== */
export function useGeneratePDF() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (resumeData, template = "modern") => {
    setIsLoading(true);
    try {
      const response = await fetch(API_BASE_PDF_GENERATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, template }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      // Get the PDF blob
      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("Generated PDF is empty");
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resumeData.full_name || "resume"}-${template}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "✅ PDF Generated",
        description: "Your resume PDF is ready!",
      });

      return { success: true };
    } catch (err) {
      console.error("❌ PDF Generation Error:", err);
      toast({
        title: "❌ Generation Failed",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate: generatePDF, isLoading };
}
