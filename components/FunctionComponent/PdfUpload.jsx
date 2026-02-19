// components/FunctionComponent/PdfUpload.jsx
"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileUp, Sparkles, Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUploadResume } from "@/hooks/use-resumes"; // This is correct - remove the duplicate import
import { useToast } from "@/hooks/use-toast";

export default function PdfUpload({
    // Core props
    variant = "default",
    onUploadSuccess,
    onUploadError,
    onStartFromScratch,

    // User ID (required for upload)
    userId,

    // Button customization
    firstButtonText = "Start from Scratch",
    firstButtonIcon = Sparkles,
    firstButtonNavigateTo = "/editor",
    firstButtonClassName = "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600",

    secondButtonText = "Upload PDF Resume",
    secondButtonIcon = FileUp,
    secondButtonLoadingText = "Analyzing PDF...",
    secondButtonClassName = "bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600",

    // Layout props
    layout = "horizontal",
    gap = "gap-4",
    showFirstButton = true,
    showSecondButton = true,

    // Navigation
    navigationParams = {},

    // Styling
    className = "",
    buttonSize = "default",

    // Drag & drop
    showDragDrop = true,
    dragDropText = "or drag and drop your PDF here",

    // Animation
    animate = true,

    // Callbacks
    beforeUpload,
    afterUpload,
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);

    const { uploadResume, isLoading: isUploading, progress: hookProgress } = useUploadResume();

    const { toast } = useToast();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const FirstIcon = firstButtonIcon;
    const SecondIcon = secondButtonIcon;

    const buttonSizeClasses = {
        sm: "px-4 py-2 text-sm",
        default: "px-8 py-6 text-base",
        lg: "px-10 py-7 text-lg"
    };

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
            await handleFileUpload(file);
        } else {
            setUploadError("Please upload a PDF file");
            toast({
                title: "❌ Invalid File",
                description: "Please upload a PDF file only.",
                variant: "destructive",
            });
        }
    }, [toast]);

    const handleFileSelect = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setUploadError("Please upload a PDF file");
            toast({
                title: "❌ Invalid File",
                description: "Please upload a PDF file only.",
                variant: "destructive",
            });
            return;
        }

        setSelectedFile(file);
        await handleFileUpload(file);
        e.target.value = "";
    }, [toast]);

    const handleFileUpload = useCallback(async (file) => {
        setUploadError("");
        setUploadProgress(0);

        // Before upload callback
        if (beforeUpload) {
            const shouldProceed = await beforeUpload(file);
            if (shouldProceed === false) return;
        }

        // Check if userId is provided
        if (!userId) {
            setUploadError("User ID is required for upload");
            toast({
                title: "❌ Upload Failed",
                description: "User ID is missing. Please log in again.",
                variant: "destructive",
            });
            return;
        }

        // Simulate progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            console.log("📤 Uploading PDF:", file.name);

            const result = await uploadResume(file, userId);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Success handling
            if (onUploadSuccess) {
                onUploadSuccess(result);
            } else {
                toast({
                    title: "✅ Upload Successful",
                    description: "Your resume has been parsed successfully.",
                    variant: "default",
                });

                // Navigate to editor with data
                if (result) {
                    navigateToEditor({
                        source: "upload",
                        data: encodeURIComponent(JSON.stringify(result)),
                        ...navigationParams,
                    });
                }
            }

            // After upload callback
            if (afterUpload) {
                afterUpload(result);
            }

        } catch (error) {
            clearInterval(progressInterval);
            setUploadProgress(0);
            setSelectedFile(null);

            console.error("❌ Upload failed:", error);
            const errorMessage = error?.message || "Failed to upload PDF. Please check your connection.";
            setUploadError(errorMessage);

            if (onUploadError) {
                onUploadError(error);
            } else {
                toast({
                    title: "❌ Upload Failed",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        }
    }, [uploadResume, userId, onUploadSuccess, onUploadError, beforeUpload, afterUpload, toast, navigationParams]);

    const handleFirstButtonClick = useCallback(() => {
        if (onStartFromScratch) {
            onStartFromScratch();
        } else {
            navigateToEditor({
                source: "scratch",
                ...navigationParams,
            });
        }
    }, [onStartFromScratch, navigationParams]);

    const navigateToEditor = useCallback((params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${firstButtonNavigateTo}?${queryString}` : firstButtonNavigateTo;
        router.push(url);
    }, [router, firstButtonNavigateTo]);

    const clearSelectedFile = useCallback(() => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, []);

    const layoutClasses = {
        horizontal: "flex flex-col sm:flex-row items-center justify-center",
        vertical: "flex flex-col items-center",
        grid: "grid grid-cols-1 sm:grid-cols-2 gap-4"
    };

    const variantClasses = {
        default: "",
        minimal: "p-4",
        floating: "p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl",
        card: "p-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/10 shadow-xl"
    };

    const content = (
        <div className={`${variantClasses[variant]} ${className}`}>
            {/* Drag & Drop Area */}
            {showDragDrop && (
                <div
                    className={`
                        relative mb-8 p-8 border-2 border-dashed rounded-xl transition-all duration-300
                        ${isDragging
                            ? 'border-purple-500 bg-purple-500/10 scale-105'
                            : 'border-gray-700 hover:border-gray-600'
                        }
                        ${isUploading ? 'opacity-50 pointer-events-none' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="pdf-upload"
                        disabled={isUploading}
                    />

                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 p-4 bg-purple-500/10 rounded-full">
                            <Upload className="w-8 h-8 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            {isDragging ? 'Drop your PDF here' : 'Upload your resume'}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            {dragDropText}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => document.getElementById("pdf-upload")?.click()}
                            disabled={isUploading}
                            className="border-gray-700 hover:border-gray-600"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Browse Files
                        </Button>
                    </div>
                </div>
            )}

            {/* Selected File Info */}
            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-purple-400" />
                                <div>
                                    <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-400">
                                        {(selectedFile.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearSelectedFile}
                                className="text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Progress Bar */}
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-gray-400">Uploading...</span>
                                    <span className="text-purple-400">{uploadProgress}%</span>
                                </div>
                                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-linear-to-r from-purple-500 to-pink-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Success Indicator */}
                        {uploadProgress === 100 && (
                            <div className="mt-3 flex items-center gap-2 text-emerald-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Upload complete! Processing...</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
                {uploadError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg"
                    >
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-red-300 text-sm">{uploadError}</p>
                                <p className="text-xs text-red-400 mt-1">
                                    Make sure the backend server is running.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className={`${layoutClasses[layout]} ${gap}`}>
                {showFirstButton && (
                    <motion.div
                        whileHover={animate ? { scale: 1.05 } : {}}
                        whileTap={animate ? { scale: 0.95 } : {}}
                        className={layout === 'grid' ? 'w-full' : ''}
                    >
                        <Button
                            onClick={handleFirstButtonClick}
                            disabled={isUploading}
                            className={`
                                flex items-center justify-center rounded-xl font-semibold
                                ${buttonSizeClasses[buttonSize]}
                                ${firstButtonClassName}
                                group relative overflow-hidden w-full
                            `}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <FirstIcon className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                            {firstButtonText}
                        </Button>
                    </motion.div>
                )}

                {showSecondButton && (
                    <motion.div
                        whileHover={animate ? { scale: 1.05 } : {}}
                        whileTap={animate ? { scale: 0.95 } : {}}
                        className={layout === 'grid' ? 'w-full' : ''}
                    >
                        <Button
                            onClick={() => document.getElementById("pdf-upload")?.click()}
                            disabled={isUploading}
                            className={`
                                flex items-center justify-center rounded-xl font-semibold
                                ${buttonSizeClasses[buttonSize]}
                                ${secondButtonClassName}
                                group relative overflow-hidden w-full
                            `}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                            {isUploading ? (
                                <>
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    {secondButtonLoadingText}
                                </>
                            ) : (
                                <>
                                    <SecondIcon className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    {secondButtonText}
                                </>
                            )}
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Hidden file input for non-drag-drop mode */}
            {!showDragDrop && (
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading}
                />
            )}
        </div>
    );

    return animate ? (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {content}
        </motion.div>
    ) : content;
}