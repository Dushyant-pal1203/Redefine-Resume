"use client";

import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const DownloadPDF = forwardRef(
    (
        {
            resumeId,
            filename = "resume.pdf",
            variant = "default",
            size = "default",
            showIcon = true,
            showLabel = true,
            label = "Download PDF",
            iconOnly = false,
            className = "",
            disabled = false,
        },
        ref
    ) => {
        const [isDownloading, setIsDownloading] = useState(false);
        const { toast } = useToast();

        const handleDownload = useCallback(async () => {
            if (isDownloading || disabled || !resumeId) return;

            setIsDownloading(true);

            try {
                toast({
                    title: "📄 Generating PDF",
                    description: "Please wait...",
                });

                const response = await fetch(
                    `${API_BASE_URL}/api/pdf/generate/${resumeId}`
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Failed to generate PDF");
                }

                const blob = await response.blob();

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
            } catch (error) {
                console.error("PDF Download Error:", error);
                toast({
                    title: "❌ Failed",
                    description:
                        error.message ||
                        "Could not generate PDF. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsDownloading(false);
            }
        }, [resumeId, isDownloading, disabled, filename, toast]);

        useImperativeHandle(ref, () => ({
            download: handleDownload,
        }));

        return (
            <Button
                variant={variant}
                size={size}
                onClick={handleDownload}
                disabled={disabled || isDownloading || !resumeId}
                className={className}
            >
                {isDownloading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {!iconOnly && showLabel && <span>Generating...</span>}
                    </>
                ) : (
                    <>
                        {showIcon && (
                            <Download
                                className={`w-4 h-4 ${iconOnly ? "" : "mr-2"}`}
                            />
                        )}
                        {!iconOnly && showLabel && <span>{label}</span>}
                    </>
                )}
            </Button>
        );
    }
);

DownloadPDF.displayName = "DownloadPDF";

export default DownloadPDF;
