// components/FunctionComponent/DownloadPDF.jsx
"use client";

import { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { Download, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePDF } from "@/hooks/use-pdf";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const DownloadPDF = forwardRef(
    (
        {
            resumeId,
            filename = "resume.pdf",
            template = "modern",
            variant = "default",
            size = "default",
            showIcon = true,
            showLabel = true,
            label = "Download PDF",
            iconOnly = false,
            className = "",
            disabled = false,
            onSuccess,
            onError,
            showPreview = false, // Option to show preview button
        },
        ref
    ) => {
        const [isDownloading, setIsDownloading] = useState(false);
        const [isPreviewing, setIsPreviewing] = useState(false);
        const { toast } = useToast();
        const { downloadPDF, previewPDF } = usePDF();

        const handleDownload = useCallback(async () => {
            if (isDownloading || disabled || !resumeId) return;

            setIsDownloading(true);

            try {
                toast({
                    title: "📄 Generating PDF",
                    description: "Please wait while we prepare your document...",
                    duration: 3000,
                });

                const success = await downloadPDF(resumeId, filename, template);

                if (success && onSuccess) {
                    onSuccess();
                }
            } catch (error) {
                console.error("PDF Download Error:", error);
                toast({
                    title: "❌ Download Failed",
                    description: error.message || "Could not generate PDF. Please try again.",
                    variant: "destructive",
                });

                if (onError) {
                    onError(error);
                }
            } finally {
                setIsDownloading(false);
            }
        }, [resumeId, isDownloading, disabled, filename, template, downloadPDF, toast, onSuccess, onError]);

        const handlePreview = useCallback(async () => {
            if (isPreviewing || disabled || !resumeId) return;

            setIsPreviewing(true);

            try {
                const success = await previewPDF(resumeId, template);

                if (!success && onError) {
                    onError(new Error("Failed to preview PDF"));
                }
            } catch (error) {
                console.error("PDF Preview Error:", error);
                toast({
                    title: "❌ Preview Failed",
                    description: error.message || "Could not preview PDF",
                    variant: "destructive",
                });

                if (onError) {
                    onError(error);
                }
            } finally {
                setIsPreviewing(false);
            }
        }, [resumeId, isPreviewing, disabled, template, previewPDF, toast, onError]);

        useImperativeHandle(ref, () => ({
            download: handleDownload,
            preview: handlePreview,
            isDownloading,
            isPreviewing,
        }));

        if (showPreview) {
            return (
                <div className="flex gap-2">
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

                    <Button
                        variant="outline"
                        size={size}
                        onClick={handlePreview}
                        disabled={disabled || isPreviewing || !resumeId}
                        className="border-white/10 hover:bg-white/10"
                    >
                        {isPreviewing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            <>
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                            </>
                        )}
                    </Button>
                </div>
            );
        }

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