"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUp, Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUploadResume } from "@/hooks/use-resumes";

export default function PdfUpload({
    variant = "primary",
    firstButtonText = "START FROM SCRATCH",
    firstButtonIcon = Sparkle,
    firstButtonOnClick = null,
    firstButtonNavigateTo = "/editor",
    firstButtonClassName = "bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",
    secondButtonText = "UPLOAD PDF RESUME",
    secondButtonIcon = FileUp,
    secondButtonLoadingText = "ANALYZING PDF...",
    secondButtonNavigateTo = "/editor",
    secondButtonClassName = "bg-linear-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600",
    onFileUpload = null,
    afterUpload = null,
    afterFirstButtonClick = null,
    layout = "horizontal",
    gap = "gap-4",
    showFirstButton = true,
    showSecondButton = true,
    navigationParams = {},
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const { mutate: uploadResume, isLoading: isUploading } = useUploadResume();
    const router = useRouter();
    const FirstIcon = firstButtonIcon;
    const SecondIcon = secondButtonIcon;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            await handleFileUpload(file);
        } else {
            setUploadError("Please upload a PDF file");
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setUploadError("Please upload a PDF file");
            return;
        }

        await handleFileUpload(file);
        e.target.value = "";
    };

    const handleFileUpload = async (file) => {
        setUploadError("");

        try {
            console.log("📤 Uploading PDF...");

            if (onFileUpload) {
                const result = await onFileUpload(file);
                if (result?.success) {
                    console.log("✅ PDF processed successfully");
                    handleSuccessfulUpload(result);
                } else {
                    throw new Error(result?.error || "Upload failed");
                }
            } else {
                const result = await uploadResume(file);
                console.log("✅ PDF parsed successfully");
                handleSuccessfulUpload(result);
            }
        } catch (error) {
            console.error("❌ Upload failed:", error);
            const errorMessage = error.message || "Failed to upload PDF. Please check if the server is running.";
            setUploadError(errorMessage);
        }
    };

    const handleSuccessfulUpload = (result) => {
        if (afterUpload) {
            afterUpload(result);
        } else {
            if (result.data) {
                navigateToEditor({
                    source: "upload",
                    data: encodeURIComponent(JSON.stringify(result.data)),
                    ...navigationParams,
                });
            } else if (result.fileName) {
                navigateToEditor({
                    source: "upload",
                    fileName: result.fileName,
                    ...result,
                    ...navigationParams,
                });
            } else {
                navigateToEditor({
                    source: "upload",
                    ...result,
                    ...navigationParams,
                });
            }
        }
    };

    const handleFirstButtonClick = () => {
        if (firstButtonOnClick) {
            firstButtonOnClick();
        } else {
            if (afterFirstButtonClick) {
                afterFirstButtonClick();
            } else {
                navigateToEditor({
                    source: "scratch",
                    ...navigationParams,
                });
            }
        }
    };

    const navigateToEditor = (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${firstButtonNavigateTo}?${queryString}` : firstButtonNavigateTo;
        router.push(url);
    };

    const layoutClasses = layout === "vertical" ? "flex flex-col" : "flex flex-col sm:flex-row";

    return (
        <div className={`${layoutClasses} ${gap} mt-10 items-center`}>
            {uploadError && (
                <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-2xl mx-auto">
                    <p className="text-red-300">⚠️ {uploadError}</p>
                    <p className="text-sm text-red-400 mt-2">
                        Make sure the backend server is running.
                    </p>
                </div>
            )}

            {showFirstButton && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handleFirstButtonClick}
                        className={`flex items-center border border-white justify-center rounded-xl px-8 py-6 text-base font-semibold ${firstButtonClassName} group`}
                    >
                        <FirstIcon className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                        {firstButtonText}
                    </Button>
                </motion.div>
            )}

            {showSecondButton && (
                <div
                    className="relative"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="pdf-upload"
                        disabled={isUploading}
                    />

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => document.getElementById("pdf-upload")?.click()}
                            disabled={isUploading}
                            className={`flex items-center border border-white justify-center rounded-xl px-8 py-6 text-base font-semibold ${secondButtonClassName} relative overflow-hidden group`}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-blue-400/20 via-cyan-400/20 to-blue-400/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            <div className="relative flex items-center gap-3">
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        <span>{secondButtonLoadingText}</span>
                                    </>
                                ) : (
                                    <>
                                        <SecondIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                        <span>{secondButtonText}</span>
                                    </>
                                )}
                            </div>
                        </Button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}