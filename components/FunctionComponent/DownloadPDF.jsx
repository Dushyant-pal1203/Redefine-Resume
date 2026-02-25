// components/FunctionComponent/DownloadPDF.jsx
"use client";

import { forwardRef, useImperativeHandle, useState, useCallback, useEffect } from "react";
import { Download, Loader2, Eye, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePDF } from "@/hooks/use-pdf";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

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
            showPreview = false,
            resumeData = null,
            requireAuth = true, // New prop to control auth requirement
            loginMessage = "Please login to download",
            loginPath = "/login",
        },
        ref
    ) => {
        const [isDownloading, setIsDownloading] = useState(false);
        const [isPreviewing, setIsPreviewing] = useState(false);
        const { toast } = useToast();
        const { downloadPDF, previewPDF } = usePDF();
        const { isAuthenticated, isLoading: authLoading } = useAuth(); // Get auth state from your hook
        const router = useRouter();

        // Log props for debugging
        useEffect(() => {
            console.log("DownloadPDF props:", {
                resumeId,
                template,
                hasResumeData: !!resumeData,
                filename,
                isAuthenticated,
                authLoading,
                requireAuth
            });
        }, [resumeId, template, resumeData, filename, isAuthenticated, authLoading, requireAuth]);

        const handleAuthRedirect = useCallback(() => {
            toast({
                title: "🔒 Authentication Required",
                description: loginMessage,
                duration: 3000,
            });

            // Store the current URL to redirect back after login
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            }

            router.push(loginPath);
        }, [router, toast, loginMessage, loginPath]);

        const handleDownload = useCallback(async () => {
            // Check authentication first
            if (requireAuth && !isAuthenticated) {
                handleAuthRedirect();
                return;
            }

            if (isDownloading || disabled || (!resumeId && !resumeData)) {
                console.log("Download blocked:", { isDownloading, disabled, resumeId, resumeData });
                return;
            }

            setIsDownloading(true);

            try {
                toast({
                    title: "📄 Generating PDF",
                    description: "Please wait while we prepare your document...",
                    duration: 3000,
                });

                console.log("Starting PDF download with data:", resumeData);

                // Pass the resume data directly to downloadPDF
                const success = await downloadPDF(resumeId, filename, template, resumeData);

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
        }, [resumeId, isDownloading, disabled, filename, template, downloadPDF, toast, onSuccess, onError, resumeData, requireAuth, isAuthenticated, handleAuthRedirect]);

        const handlePreview = useCallback(async () => {
            // Check authentication first
            if (requireAuth && !isAuthenticated) {
                handleAuthRedirect();
                return;
            }

            if (isPreviewing || disabled || (!resumeId && !resumeData)) return;

            setIsPreviewing(true);

            try {
                const success = await previewPDF(resumeId, template, resumeData);

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
        }, [resumeId, isPreviewing, disabled, template, previewPDF, toast, onError, resumeData, requireAuth, isAuthenticated, handleAuthRedirect]);

        useImperativeHandle(ref, () => ({
            download: handleDownload,
            preview: handlePreview,
            isDownloading,
            isPreviewing,
        }));

        // Don't render anything while auth is loading to prevent flicker
        if (authLoading) {
            return (
                <Button
                    variant={variant}
                    size={size}
                    disabled={true}
                    className={className}
                >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {!iconOnly && showLabel && <span>Loading...</span>}
                </Button>
            );
        }

        // Determine if button should be disabled (technical disable, not auth-related)
        const isTechnicallyDisabled = disabled || isDownloading || (!resumeId && !resumeData);

        // Auth status for UI
        const needsAuth = requireAuth && !isAuthenticated;

        // Determine button text and icon based on auth status
        const getButtonContent = () => {
            if (isDownloading) {
                return (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {!iconOnly && showLabel && <span>Generating...</span>}
                    </>
                );
            }

            if (needsAuth) {
                return (
                    <>
                        <Lock className={`w-4 h-4 ${iconOnly ? "" : "mr-2"}`} />
                        {!iconOnly && showLabel && <span>Login to Download</span>}
                    </>
                );
            }

            return (
                <>
                    {showIcon && (
                        <Download
                            className={`w-4 h-4 ${iconOnly ? "" : "mr-2"}`}
                        />
                    )}
                    {!iconOnly && showLabel && <span>{label}</span>}
                </>
            );
        };

        if (showPreview) {
            return (
                <div className="flex gap-2">
                    <Button
                        variant={variant}
                        size={size}
                        onClick={handleDownload}
                        disabled={isTechnicallyDisabled && !needsAuth} // Don't disable for auth requirement
                        className={`${className} ${needsAuth ? 'opacity-90' : ''}`}
                        title={needsAuth ? loginMessage : (!resumeId && !resumeData ? "No resume data available" : "")}
                    >
                        {getButtonContent()}
                    </Button>

                    <Button
                        variant="outline"
                        size={size}
                        onClick={handlePreview}
                        disabled={(disabled || isPreviewing || (!resumeId && !resumeData)) && !needsAuth}
                        className="border-white/10 hover:bg-white/10"
                        title={needsAuth ? loginMessage : ""}
                    >
                        {isPreviewing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : needsAuth ? (
                            <>
                                <Lock className="w-4 h-4 mr-2" />
                                Login to Preview
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
                disabled={isTechnicallyDisabled && !needsAuth} // Don't disable for auth requirement
                className={className}
                title={needsAuth ? loginMessage : (!resumeId && !resumeData ? "No resume data available" : "")}
            >
                {getButtonContent()}
            </Button>
        );
    }
);

DownloadPDF.displayName = "DownloadPDF";

export default DownloadPDF;