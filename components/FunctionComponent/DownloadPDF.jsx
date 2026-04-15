// client/components/FunctionComponent/DownloadPDF.jsx
"use client";

import { forwardRef, useImperativeHandle, useState, useCallback, useEffect } from "react";
import { Download, Loader2, Eye, Lock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePDF } from "@/hooks/use-pdf";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { convertToFlexibleFormat } from '@/lib/resume-schema';

const DownloadPDF = forwardRef(
    (
        {
            resumeId,
            filename = "resume.pdf",
            template = "modern",
            variant = "default",
            size = "default",
            showIcon = true,
            // Add new prop for custom icon
            icon: CustomIcon = Download, // Default to Download icon
            showLabel = true,
            label = "Download PDF",
            iconOnly = false,
            className = "",
            disabled = false,
            onSuccess,
            onError,
            showPreview = true,
            showDropdown = true,
            resumeData = null,
            requireAuth = true,
            loginMessage = "Please login to download",
            loginPath = "/login",
            showProgress = true,
            onAction,
        },
        ref
    ) => {
        const [isDownloading, setIsDownloading] = useState(false);
        const [isPreviewing, setIsPreviewing] = useState(false);
        const [downloadProgress, setDownloadProgress] = useState(0);
        const { toast } = useToast();
        const { downloadPDF, previewPDF, isGenerating, progress } = usePDF();
        const { isAuthenticated, isLoading: authLoading } = useAuth();
        const router = useRouter();

        // Convert resume data to flexible format for preview/download
        const getFlexibleResumeData = useCallback(() => {
            if (!resumeData) return null;

            try {
                // Check if resumeData already has the flexible format structure
                if (resumeData.personal || resumeData.summary || resumeData.experience) {
                    console.log("📦 Resume data already in flexible format");
                    return resumeData; // Already in flexible format
                }

                // Convert to flexible format
                const flexibleData = convertToFlexibleFormat(resumeData);
                console.log("📦 Converted resume to flexible format:", flexibleData);
                return flexibleData;
            } catch (error) {
                console.error("Error converting resume data:", error);
                return resumeData; // Return original if conversion fails
            }
        }, [resumeData]);

        // Log props for debugging
        useEffect(() => {
            console.log("📄 DownloadPDF props:", {
                resumeId,
                template,
                hasResumeData: !!resumeData,
                filename,
                isAuthenticated,
                authLoading,
                requireAuth
            });
        }, [resumeId, template, resumeData, filename, isAuthenticated, authLoading, requireAuth]);

        // Update progress when generating
        useEffect(() => {
            if (isGenerating) {
                setDownloadProgress(progress);
            } else {
                setDownloadProgress(0);
            }
        }, [isGenerating, progress]);

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

        const handleDownloadDoc = useCallback(() => {
            toast({
                title: "📄 Comming Soon",
                description: "This feature is under development. Stay tuned for updates!",
                duration: 3000,
            });
        }, [toast]);

        const handleDownload = useCallback(async () => {
            // Check authentication first
            if (requireAuth && !isAuthenticated) {
                handleAuthRedirect();
                return;
            }

            if (isDownloading || disabled || (!resumeId && !resumeData)) {
                console.log("⛔ Download blocked:", { isDownloading, disabled, resumeId, resumeData });
                return;
            }

            setIsDownloading(true);

            try {
                toast({
                    title: "📄 Generating PDF",
                    description: "Please wait while we prepare your document...",
                    duration: 3000,
                });

                console.log("🚀 Starting PDF download");

                // Get flexible format data for download
                const flexibleData = getFlexibleResumeData();

                // Pass the resume data directly to downloadPDF
                const success = await downloadPDF(resumeId, filename, template, flexibleData);

                if (success) {
                    toast({
                        title: "✅ Download Complete",
                        description: "Your PDF has been generated successfully",
                        duration: 3000,
                    });

                    if (onSuccess) {
                        onSuccess();
                    }
                }
            } catch (error) {
                console.error("❌ PDF Download Error:", error);
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
        }, [resumeId, isDownloading, disabled, filename, template, downloadPDF, toast, onSuccess, onError, resumeData, requireAuth, isAuthenticated, handleAuthRedirect, getFlexibleResumeData]);


        useImperativeHandle(ref, () => ({
            download: handleDownload,
            isDownloading,
            isPreviewing,
        }));

        // Don't render anything while auth is loading
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

        // Determine if button should be disabled
        const isTechnicallyDisabled = disabled || isDownloading || isPreviewing || (!resumeId && !resumeData);
        const needsAuth = requireAuth && !isAuthenticated;

        // Determine button text and icon based on state
        const getButtonContent = () => {
            if (isDownloading) {
                return (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {!iconOnly && showLabel && <span>Generating...</span>}
                        {showProgress && downloadProgress > 0 && (
                            <span className="ml-2 text-xs">{downloadProgress}%</span>
                        )}
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
                        <CustomIcon
                            className={`w-4 h-4 ${iconOnly ? "" : "mr-2"}`}
                        />
                    )}
                    {!iconOnly && showLabel && <span>{label}</span>}
                </>
            );
        };

        // If showDropdown is true and we have preview option, show dropdown menu
        if (showDropdown && (showPreview || isAuthenticated)) {
            return (
                <div className="flex items-center gap-2">
                    {showProgress && isDownloading && (
                        <Progress value={downloadProgress} className="w-20 h-2" />
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={variant}
                                size={size}
                                disabled={isTechnicallyDisabled && !needsAuth}
                                className={className}
                            >
                                {getButtonContent()}
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-64 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-xl shadow-xl p-1 text-gray-700"
                        >
                            <DropdownMenuLabel className="px-3 py-2.5 text-sm font-semibold text-gray-900 border-b border-gray-100">
                                <span className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-500" />
                                    Download Options
                                </span>
                            </DropdownMenuLabel>

                            <div className="p-1.5 space-y-1">
                                <DropdownMenuItem
                                    onClick={handleDownload}
                                    disabled={isTechnicallyDisabled && !needsAuth}
                                    className={`
                                        relative flex items-center px-3 py-2.5 rounded-lg text-sm
                                        transition-all duration-200 cursor-pointer
                                        ${(isTechnicallyDisabled && !needsAuth)
                                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                            : 'hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50/50 hover:text-blue-700 active:scale-[0.98]'
                                        }
                                        group
                                    `}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-linear-to-r from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/5 transition-all duration-500"></div>
                                    {/* <Download className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors" /> */}
                                    <kbd className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors">💾</kbd>
                                    <span className="font-medium">PDF Format</span>
                                    <kbd className="ml-auto text-xs text-gray-400 group-hover:text-gray-500">📕</kbd>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleDownloadDoc}
                                    disabled={isTechnicallyDisabled && !needsAuth}
                                    className={`
                                        relative flex items-center px-3 py-2.5 rounded-lg text-sm
                                        transition-all duration-200 cursor-pointer
                                        ${(isTechnicallyDisabled && !needsAuth)
                                            ? 'opacity-50 cursor-not-allowed bg-gray-50'
                                            : 'hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50/50 hover:text-blue-700 active:scale-[0.98]'
                                        }
                                        group
                                    `}
                                >
                                    <div className="absolute inset-0 rounded-lg bg-linear-to-r from-blue-500/0 via-transparent to-transparent group-hover:from-blue-500/5 transition-all duration-500"></div>
                                    {/* <Download className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors" /> */}
                                    <kbd className="w-4 h-4 mr-3 text-gray-500 group-hover:text-blue-500 transition-colors">💾</kbd>
                                    <span className="font-medium">Doc Format</span>
                                    <kbd className="ml-auto text-xs text-gray-400 group-hover:text-gray-500">📝</kbd>
                                </DropdownMenuItem>

                                {needsAuth && (
                                    <>
                                        <div className="my-1.5 border-t border-gray-100"></div>
                                        <DropdownMenuItem
                                            onClick={handleAuthRedirect}
                                            className="
                                                relative flex items-center px-3 py-2.5 rounded-lg text-sm
                                                transition-all duration-200 cursor-pointer
                                                bg-linear-to-r from-amber-50 to-orange-50/50
                                                hover:from-amber-100 hover:to-orange-100
                                                active:scale-[0.98] group
                                                border border-amber-200/50
                                            "
                                        >
                                            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-amber-500/0 via-transparent to-transparent group-hover:from-amber-500/10 transition-all duration-500"></div>
                                            <Lock className="w-4 h-4 mr-3 text-amber-600 group-hover:text-amber-700 transition-colors" />
                                            <span className="font-medium text-amber-700">Login Required</span>
                                            <span className="ml-auto text-xs text-amber-600 group-hover:text-amber-700">🔐</span>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </div>

                            {/* Decorative bottom gradient line */}
                            <div className="h-1 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-amber-500/20 rounded-b-xl mt-1"></div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        }

        // Simple button layout
        if (showPreview) {
            return (
                <div className="flex gap-2">
                    <Button
                        variant={variant}
                        size={size}
                        onClick={handleDownload}
                        disabled={isTechnicallyDisabled && !needsAuth}
                        className={className}
                        title={needsAuth ? loginMessage : ""}
                    >
                        {getButtonContent()}
                    </Button>
                </div>
            );
        }

        return (
            <Button
                variant={variant}
                size={size}
                onClick={handleDownload}
                disabled={isTechnicallyDisabled && !needsAuth}
                className={className}
                title={needsAuth ? loginMessage : ""}
            >
                {getButtonContent()}
            </Button>
        );
    }
);

DownloadPDF.displayName = "DownloadPDF";

export default DownloadPDF;