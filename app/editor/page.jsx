// app/editor/page.jsx
"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Save, ArrowLeft, Sparkles, FileText, CheckCircle, BookType, Loader2 } from "lucide-react";
import ResumeEditor from '@/components/EditorSection/ResumeEditor';
import LivePreview from '@/components/EditorSection/LivePreview';
import { useSaveResume } from "@/hooks/use-resumes";
import { useTemplates } from "@/hooks/use-templates";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import DownloadPDF from '@/components/FunctionComponent/DownloadPDF';

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const saveResumeHook = useSaveResume();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const { toast } = useToast();

    const saveResume = saveResumeHook?.mutateAsync || saveResumeHook?.mutate;
    const isSaving = saveResumeHook?.isLoading || saveResumeHook?.isPending || false;

    const [resumeData, setResumeData] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        professional_summary: 'Experienced Full Stack Developer with expertise in modern web technologies including React, Node.js, and MongoDB. Passionate about creating efficient, scalable web applications.',
        experience: [],
        education: [],
        skills: [],
        projects: []
    });

    const firstName = resumeData.full_name?.split(' ')[0] || 'Untitled';
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [resumeId, setResumeId] = useState(null);
    const [resumeTitle, setResumeTitle] = useState('');
    const [hasInitializedTitle, setHasInitializedTitle] = useState(false);
    const [isAutoTitleEnabled, setIsAutoTitleEnabled] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const hasLoadedData = useRef(false);
    const pendingToast = useRef(null);
    const mountedRef = useRef(true);
    const downloadRef = useRef(null);

    // Set mounted ref
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // Safe toast function - prevents updates during render
    const showToast = useCallback((props) => {
        if (pendingToast.current) {
            clearTimeout(pendingToast.current);
        }

        pendingToast.current = setTimeout(() => {
            if (mountedRef.current) {
                toast(props);
            }
        }, 0);
    }, [toast]);

    const getTitleSuggestions = useCallback(() => {
        const name = resumeData.full_name || 'Professional';
        const firstName = name.split(' ')[0] || 'Professional';

        return [
            `${firstName}'s Resume`,
            `${firstName} - Full Stack Developer`,
            `${firstName} | Software Engineer`,
            `${firstName}'s Professional Profile`,
            `Resume of ${name}`,
            `${firstName} - Tech Portfolio`
        ];
    }, [resumeData.full_name]);

    // Auto-update resume_title when full_name changes AND auto-title is enabled
    useEffect(() => {
        if (isAutoTitleEnabled && resumeData.full_name && !hasInitializedTitle && mountedRef.current) {
            queueMicrotask(() => {
                if (mountedRef.current) {
                    const newTitle = `${resumeData.full_name.split(' ')[0]}'s Resume`;
                    setResumeTitle(newTitle);
                }
            });
        }
    }, [resumeData.full_name, isAutoTitleEnabled, hasInitializedTitle]);

    // Load data from URL params
    useEffect(() => {
        if (hasLoadedData.current || !mountedRef.current) return;

        const dataParam = searchParams.get('data');
        const templateParam = searchParams.get('template');
        const idParam = searchParams.get('resumeId');

        if (templateParam && templateParam !== selectedTemplate) {
            queueMicrotask(() => {
                if (mountedRef.current) {
                    setSelectedTemplate(templateParam);
                }
            });
        }

        if (idParam && idParam !== resumeId) {
            queueMicrotask(() => {
                if (mountedRef.current) {
                    setResumeId(idParam);
                }
            });
        }

        if (dataParam && !hasLoadedData.current) {
            hasLoadedData.current = true;

            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam));
                console.log('📥 Data from URL:', parsedData);

                const processedData = {
                    ...parsedData,
                    resume_id: idParam || parsedData.resume_id || parsedData.id,
                    experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
                    education: Array.isArray(parsedData.education) ? parsedData.education : [],
                    skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
                    projects: Array.isArray(parsedData.projects) ? parsedData.projects : []
                };

                queueMicrotask(() => {
                    if (mountedRef.current) {
                        setResumeData(processedData);
                    }
                });

                if (parsedData.resume_title || parsedData.title) {
                    queueMicrotask(() => {
                        if (mountedRef.current) {
                            setResumeTitle(parsedData.resume_title || parsedData.title);
                            setHasInitializedTitle(true);
                        }
                    });
                }

                showToast({
                    title: "✨ Resume Loaded Successfully",
                    description: "Your resume data has been loaded and is ready for editing.",
                    variant: "default",
                });
            } catch (error) {
                console.error('❌ Error parsing URL data:', error);
                hasLoadedData.current = false;

                showToast({
                    title: "⚠️ Load Failed",
                    description: "Failed to load resume data from URL. Please try again.",
                    variant: "destructive",
                });
            }
        }
    }, [searchParams, selectedTemplate, resumeId, showToast]);

    const handleUpdate = useCallback((data) => {
        setResumeData(data);

        if (data.full_name && isAutoTitleEnabled && !hasInitializedTitle && mountedRef.current) {
            queueMicrotask(() => {
                if (mountedRef.current) {
                    const newFirstName = data.full_name.split(' ')[0];
                    setResumeTitle(`${newFirstName}'s Resume`);
                }
            });
        }
    }, [isAutoTitleEnabled, hasInitializedTitle]);

    const handlePDFUpload = useCallback((parsedData) => {
        console.log('📄 PDF Upload - Parsed Data:', parsedData);

        const processedData = {
            full_name: parsedData.full_name || '',
            email: parsedData.email || '',
            phone: parsedData.phone || '',
            location: parsedData.location || '',
            professional_summary: parsedData.professional_summary || '',
            experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
            education: Array.isArray(parsedData.education) ? parsedData.education : [],
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
            projects: Array.isArray(parsedData.projects) ? parsedData.projects : []
        };

        if (processedData.experience.length === 0) {
            processedData.experience = [{ company: '', position: '', duration: '' }];
        }
        if (processedData.education.length === 0) {
            processedData.education = [{ institution: '', degree: '', year: '' }];
        }
        if (processedData.skills.length === 0) {
            processedData.skills = [''];
        }
        if (processedData.projects.length === 0) {
            processedData.projects = [{ name: '', description: '', technologies: '' }];
        }

        queueMicrotask(() => {
            if (mountedRef.current) {
                setResumeData(processedData);
            }
        });

        if (parsedData.resume_title || parsedData.title) {
            queueMicrotask(() => {
                if (mountedRef.current) {
                    setResumeTitle(parsedData.resume_title || parsedData.title);
                    setHasInitializedTitle(true);
                }
            });
        } else if (parsedData.full_name) {
            queueMicrotask(() => {
                if (mountedRef.current) {
                    const firstName = parsedData.full_name.split(' ')[0];
                    setResumeTitle(`${firstName}'s Resume`);
                    setHasInitializedTitle(true);
                }
            });
        }

        showToast({
            title: "📄 PDF Upload Successful",
            description: "Your resume has been successfully parsed from PDF.",
            variant: "default",
        });
    }, [showToast]);

    const handleSave = useCallback(async () => {
        if (!saveResume) {
            console.error('❌ saveResume function is not available');
            showToast({
                title: "❌ Save Failed",
                description: "Save function is not available. Please check your connection.",
                variant: "destructive",
            });
            return;
        }

        try {
            const dataToSave = {
                ...resumeData,
                template: selectedTemplate,
                resume_id: resumeId,
                resume_title: resumeTitle || `${firstName}'s Resume`
            };

            console.log('📤 Saving resume data:', dataToSave);

            let result;
            if (saveResumeHook?.mutateAsync) {
                result = await saveResumeHook.mutateAsync(dataToSave);
            } else if (saveResumeHook?.mutate) {
                result = await new Promise((resolve, reject) => {
                    saveResumeHook.mutate(dataToSave, {
                        onSuccess: (data) => resolve(data),
                        onError: (error) => reject(error),
                    });
                });
            } else {
                throw new Error('No valid save function found');
            }

            const newResumeId = result?.data?.resume_id || result?.resume_id || result?.id;
            if (newResumeId) {
                queueMicrotask(() => {
                    if (mountedRef.current) {
                        setResumeId(newResumeId);
                        setHasInitializedTitle(true);
                    }
                });
            }

            setSaveSuccess(true);
            setTimeout(() => {
                if (mountedRef.current) {
                    setSaveSuccess(false);
                }
            }, 2000);

            showToast({
                title: "✨ Save Successful!",
                description: "Your resume has been saved successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('❌ Save failed:', error);

            showToast({
                title: "❌ Save Failed",
                description: error?.message || "Failed to save resume. Please check your connection.",
                variant: "destructive",
            });
        }
    }, [saveResume, saveResumeHook, resumeData, selectedTemplate, resumeId, resumeTitle, firstName, showToast]);

    const handleTemplateChange = useCallback((e) => {
        const newTemplate = e.target.value;
        setSelectedTemplate(newTemplate);

        showToast({
            title: "🎨 Template Changed",
            description: `Switched to ${newTemplate} template.`,
            variant: "default",
        });
    }, [showToast]);

    const handleBack = useCallback(() => {
        router.push('/');
        showToast({
            title: "👋 See You Soon!",
            description: "Returning to dashboard...",
            variant: "default",
        });
    }, [router, showToast]);

    const handleTitleChange = useCallback((e) => {
        setResumeTitle(e.target.value);
        setHasInitializedTitle(true);
        setIsAutoTitleEnabled(false);
    }, []);

    const applyTitleSuggestion = useCallback((suggestion) => {
        setResumeTitle(suggestion);
        setHasInitializedTitle(true);
        setIsAutoTitleEnabled(false);

        showToast({
            title: "✨ Title Updated",
            description: `Resume title changed to "${suggestion}"`,
            variant: "default",
        });
    }, [showToast]);

    const resetToAutoTitle = useCallback(() => {
        setIsAutoTitleEnabled(true);
        setHasInitializedTitle(false);
        const newTitle = `${firstName}'s Resume`;
        setResumeTitle(newTitle);

        showToast({
            title: "🔄 Auto-Title Enabled",
            description: "Title will automatically update with your name.",
            variant: "default",
        });
    }, [firstName, showToast]);

    // Get template icon/emoji
    const getTemplateIcon = (templateId) => {
        const icons = {
            modern: '✨',
            minimal: '🎯',
            creative: '🎨'
        };
        return icons[templateId] || '📄';
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (pendingToast.current) {
                clearTimeout(pendingToast.current);
            }
        };
    }, []);

    // Show loading state while templates are loading
    if (templatesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <div className="text-white text-2xl font-bold mb-2">Loading Templates</div>
                        <div className="text-gray-400 text-sm">Preparing your templates...</div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {/* Animated Background linear */}
            <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-purple-900/10 to-gray-900 -z-10" />

            {/* Top Navigation Bar - Glassmorphism Design */}
            <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-purple-500/5">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Left Section - Back Button & Title Input */}
                        <div className="flex items-center gap-3 flex-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBack}
                                    className="hidden lg:flex text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm transition-all duration-300"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </motion.div>

                            <Separator orientation="vertical" className="h-6 hidden lg:flex bg-white/10" />

                            <div className="flex items-center gap-3 flex-1 lg:flex-none">
                                <div className="relative group flex-1 lg:w-80">
                                    <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500" />
                                    <div className="relative flex items-center">
                                        <FileText className="absolute left-3 w-4 h-4 text-purple-400" />
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400 transition-all duration-300"
                                            placeholder="Enter resume title..."
                                            value={resumeTitle || `${firstName}'s Resume`}
                                            onChange={handleTitleChange}
                                        />
                                        {isAutoTitleEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute right-3"
                                            >
                                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Title Suggestions Dropdown */}
                                <div className="relative group hidden lg:block">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex items-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white"
                                    >
                                        <BookType className="w-4 h-4 mr-2" />
                                        Suggestions
                                    </Button>
                                    <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl shadow-purple-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                        <div className="p-2 space-y-1">
                                            {getTitleSuggestions().map((suggestion, index) => (
                                                <motion.button
                                                    key={index}
                                                    initial={{ x: -10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => applyTitleSuggestion(suggestion)}
                                                    className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                                >
                                                    {suggestion}
                                                </motion.button>
                                            ))}
                                            <Separator className="my-2 bg-white/10" />
                                            <button
                                                onClick={resetToAutoTitle}
                                                className="w-full text-left px-3 py-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-md transition-colors"
                                            >
                                                <Sparkles className="w-3 h-3 inline mr-2" />
                                                Enable Auto-Title
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Template Selector - Dynamically populated from backend */}
                            <div className="hidden lg:flex items-center gap-3 ml-4">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Palette className="w-4 h-4 text-purple-400" />
                                    <select
                                        value={selectedTemplate}
                                        onChange={handleTemplateChange}
                                        className="bg-transparent text-white border-none focus:outline-none focus:ring-0 text-sm cursor-pointer"
                                    >
                                        {templates.map((template) => (
                                            <option
                                                key={template.id}
                                                value={template.id}
                                                className="bg-gray-900"
                                            >
                                                {getTemplateIcon(template.id)} {template.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex items-center justify-end gap-3">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    size="sm"
                                    className="relative overflow-hidden group bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white shadow-lg shadow-purple-600/25"
                                    disabled={isSaving}
                                >
                                    <AnimatePresence mode="wait">
                                        {saveSuccess ? (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                                className="flex items-center"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Saved!
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="save"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center"
                                            >
                                                <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                                                {isSaving ? (
                                                    <>
                                                        <span className="animate-pulse">Saving...</span>
                                                    </>
                                                ) : (
                                                    'Save Resume'
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <DownloadPDF
                                    ref={downloadRef}
                                    resumeData={resumeData}
                                    template={selectedTemplate}
                                    filename={`${firstName}-resume-${selectedTemplate}.pdf`}
                                    variant="default"
                                    size="sm"
                                    label="Export PDF"
                                    showIcon={true}
                                    showLabel={true}
                                    elementId="resume-preview-content"
                                    onBeforeDownload={() => {
                                        showToast({
                                            title: "📄 Generating PDF",
                                            description: `Creating your ${selectedTemplate} resume...`,
                                            variant: "default",
                                        });
                                    }}
                                    onAfterDownload={() => {
                                        showToast({
                                            title: "✅ PDF Generated",
                                            description: "Your professional resume is ready!",
                                            variant: "default",
                                        });
                                    }}
                                    className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white shadow-lg shadow-blue-600/25"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Glassmorphism Design */}
            <div className="flex flex-1 min-h-screen bg-linear-to-br from-gray-900 via-gray-800/50 to-gray-900">
                {/* Left Panel - Editor */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-1/3 border-r border-white/10 bg-black/20 backdrop-blur-sm"
                >
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <ResumeEditor
                            resumeData={resumeData}
                            onUpdate={handleUpdate}
                            onPDFUpload={handlePDFUpload}
                        />
                    </div>
                </motion.div>

                {/* Right Panel - Preview */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="w-2/3 bg-linear-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-sm"
                >
                    <div className="h-full overflow-y-auto custom-scrollbar">
                        <div className="bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                            <LivePreview
                                resumeData={resumeData}
                                template={selectedTemplate}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <div className="text-white text-2xl font-bold mb-2">Loading Editor</div>
                        <div className="text-gray-400 text-sm">Preparing your creative workspace...</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </motion.div>
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}