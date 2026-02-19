// app/editor/page.jsx
"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Palette,
    Save,
    ArrowLeft,
    Sparkles,
    FileText,
    CheckCircle,
    BookType,
    Loader2,
    Eye,
    Settings,
    Grid,
    List,
    Maximize2,
    Minimize2,
    Clock,
    Zap,
    Shield,
    Globe,
    Lock
} from "lucide-react";
import ResumeEditor from '@/components/EditorSection/ResumeEditor';
import LivePreview from '@/components/EditorSection/LivePreview';
import { useCreateResume, useUpdateResume, useTogglePublicResume, useResume } from "@/hooks/use-resumes";
import { useTemplates } from "@/hooks/use-templates";
import { useToast } from "@/hooks/use-toast";
import DownloadPDF from '@/components/FunctionComponent/DownloadPDF';
import { useAuth } from "@/hooks/use-auth";
import { convertToFlexibleFormat, convertToOldFormat } from '@/lib/resume-schema';

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { mutate: createResume, isLoading: isCreating } = useCreateResume();
    const { mutate: updateResume, isLoading: isUpdating } = useUpdateResume();
    const { mutate: togglePublic, isLoading: isTogglingPublic } = useTogglePublicResume();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const { toast } = useToast();
    const { user } = useAuth();

    // State
    const [resumeData, setResumeData] = useState(() => getEmptyResumeData());
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [resumeId, setResumeId] = useState(null);
    const [resumeTitle, setResumeTitle] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [isAutoTitleEnabled, setIsAutoTitleEnabled] = useState(true);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [previewMode, setPreviewMode] = useState('split');
    const [editorLayout, setEditorLayout] = useState('comfortable');
    const [autoSave, setAutoSave] = useState(true);
    const [autoSaveTimer, setAutoSaveTimer] = useState(null);
    const [isLoadingResume, setIsLoadingResume] = useState(false);

    // Refs
    const hasLoadedData = useRef(false);
    const mountedRef = useRef(true);
    const downloadRef = useRef(null);
    const editorRef = useRef(null);

    // Computed
    const firstName = resumeData.personal?.full_name?.split(' ')[0] || 'Untitled';
    const isSaving = isCreating || isUpdating;
    const canSave = resumeData.personal?.full_name?.trim() && resumeData.personal?.email?.trim();

    // Get resume ID from URL
    const urlResumeId = searchParams.get('resumeId');

    // Fetch resume data if we have an ID
    const { resume: fetchedResume, isLoading: isFetchingResume } = useResume(urlResumeId);

    // Effect to load fetched resume data
    useEffect(() => {
        if (fetchedResume && !hasLoadedData.current && mountedRef.current) {
            console.log('📥 Loading fetched resume:', fetchedResume);

            // Convert to flexible format
            const flexibleData = convertToFlexibleFormat(fetchedResume);
            setResumeData(flexibleData);

            // Set template if available
            if (fetchedResume.template) {
                setSelectedTemplate(fetchedResume.template);
            }

            // Set title
            if (fetchedResume.resume_title) {
                setResumeTitle(fetchedResume.resume_title);
                setIsAutoTitleEnabled(false);
            } else if (flexibleData.personal?.full_name) {
                setResumeTitle(`${flexibleData.personal.full_name.split(' ')[0]}'s Resume`);
            }

            // Set public status
            if (fetchedResume.is_public !== undefined) {
                setIsPublic(fetchedResume.is_public);
            }

            setResumeId(urlResumeId);
            hasLoadedData.current = true;

            toast({
                title: "✨ Resume Loaded",
                description: "Your resume has been loaded successfully.",
                variant: "default",
            });
        }
    }, [fetchedResume, urlResumeId, toast]);

    // Load data from URL params (for new resumes or shared links)
    useEffect(() => {
        if (hasLoadedData.current || !mountedRef.current || urlResumeId) return;

        const dataParam = searchParams.get('data');
        const templateParam = searchParams.get('template');
        const idParam = searchParams.get('resumeId');
        const publicParam = searchParams.get('public');

        if (templateParam && templateParam !== selectedTemplate) {
            setSelectedTemplate(templateParam);
        }

        if (idParam && idParam !== resumeId) {
            setResumeId(idParam);
        }

        if (publicParam) {
            setIsPublic(publicParam === 'true');
        }

        if (dataParam && !hasLoadedData.current) {
            hasLoadedData.current = true;

            try {
                // Safely decode the URI component
                let decodedData;
                try {
                    decodedData = decodeURIComponent(dataParam);
                } catch (decodeError) {
                    console.error('❌ URI decode error:', decodeError);
                    decodedData = dataParam;
                }

                // Parse the JSON
                let parsedData;
                try {
                    parsedData = JSON.parse(decodedData);
                } catch (parseError) {
                    console.error('❌ JSON parse error:', parseError);
                    toast({
                        title: "⚠️ Invalid Data",
                        description: "The resume data is corrupted.",
                        variant: "destructive",
                    });
                    return;
                }

                console.log('📥 Loading resume data from URL:', parsedData);

                // Convert to flexible format
                const flexibleData = convertToFlexibleFormat(parsedData);
                setResumeData(flexibleData);

                // Set title if available
                if (parsedData.resume_title || parsedData.title) {
                    setResumeTitle(parsedData.resume_title || parsedData.title);
                    setIsAutoTitleEnabled(false);
                } else if (flexibleData.personal?.full_name) {
                    setResumeTitle(`${flexibleData.personal.full_name.split(' ')[0]}'s Resume`);
                }

                toast({
                    title: "✨ Resume Loaded",
                    description: "Your resume is ready for editing.",
                    variant: "default",
                });
            } catch (error) {
                console.error('❌ Error loading data:', error);
                toast({
                    title: "⚠️ Load Failed",
                    description: "Failed to load resume data.",
                    variant: "destructive",
                });
            }
        }
    }, [searchParams, selectedTemplate, resumeId, toast, urlResumeId]);

    // Set mounted ref
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            if (autoSaveTimer) clearTimeout(autoSaveTimer);
        };
    }, [autoSaveTimer]);

    // Auto-save effect
    useEffect(() => {
        if (!autoSave || !canSave || !resumeData.personal?.full_name) return;

        if (autoSaveTimer) clearTimeout(autoSaveTimer);

        const timer = setTimeout(() => {
            if (mountedRef.current) {
                handleSave(true);
            }
        }, 3000);

        setAutoSaveTimer(timer);

        return () => clearTimeout(timer);
    }, [resumeData, selectedTemplate, resumeTitle, autoSave]);

    // Auto-update title
    useEffect(() => {
        if (isAutoTitleEnabled && resumeData.personal?.full_name && mountedRef.current) {
            setResumeTitle(`${resumeData.personal.full_name.split(' ')[0]}'s Resume`);
        }
    }, [resumeData.personal?.full_name, isAutoTitleEnabled]);

    const handleUpdate = useCallback((data) => {
        setResumeData(data);
    }, []);

    const handlePDFUpload = useCallback((parsedData) => {
        console.log('📄 PDF Upload:', parsedData);

        // Convert the uploaded data to flexible format
        const flexibleData = convertToFlexibleFormat(parsedData);
        setResumeData(flexibleData);

        if (parsedData.full_name) {
            setResumeTitle(`${parsedData.full_name.split(' ')[0]}'s Resume`);
        }

        toast({
            title: "📄 PDF Uploaded",
            description: "Resume parsed successfully.",
            variant: "default",
        });
    }, [toast]);

    const handleSave = useCallback(async (isAutoSave = false) => {
        if (!canSave) {
            toast({
                title: "❌ Cannot Save",
                description: "Please fill in required fields (Name and Email).",
                variant: "destructive",
            });
            return;
        }

        // Convert flexible format to old format for API
        const oldFormatData = convertToOldFormat(resumeData);

        // Add metadata
        const dataToSave = {
            ...oldFormatData,
            resume_title: resumeTitle || `${firstName}'s Resume`,
            template: selectedTemplate,
            is_public: isPublic,
            user_id: user?.id
        };

        console.log('💾 Saving resume:', dataToSave);

        try {
            let result;

            if (resumeId) {
                // Update existing
                result = await updateResume(resumeId, dataToSave);
                console.log('✅ Update result:', result);
            } else {
                // Create new
                result = await createResume(dataToSave);
                console.log('✅ Create result:', result);

                if (result?.resume_id) {
                    setResumeId(result.resume_id);

                    // Update URL with the new resume ID without reloading
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('resumeId', result.resume_id);
                    router.replace(`/editor?${params.toString()}`, { scroll: false });
                }
            }

            setSaveSuccess(true);
            setLastSaved(new Date());

            setTimeout(() => {
                if (mountedRef.current) {
                    setSaveSuccess(false);
                }
            }, 2000);

            if (!isAutoSave) {
                toast({
                    title: "✨ Saved Successfully",
                    description: "Your resume has been saved.",
                    variant: "default",
                });
            }
        } catch (error) {
            console.error('❌ Save failed:', error);

            if (!isAutoSave) {
                toast({
                    title: "❌ Save Failed",
                    description: error?.message || "Failed to save resume.",
                    variant: "destructive",
                });
            }
        }
    }, [createResume, updateResume, resumeData, selectedTemplate, resumeId, resumeTitle, firstName, isPublic, canSave, toast, searchParams, router, user?.id]);

    const handleTogglePublic = useCallback(async () => {
        if (!resumeId) {
            toast({
                title: "❌ Cannot Change Visibility",
                description: "Please save the resume first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await togglePublic(resumeId);
            setIsPublic(result.is_public);

            toast({
                title: result.is_public ? "🌐 Resume Published" : "🔒 Resume Private",
                description: result.is_public
                    ? "Your resume is now publicly accessible."
                    : "Your resume is now private.",
                variant: "default",
            });
        } catch (error) {
            console.error('❌ Toggle failed:', error);
            toast({
                title: "❌ Action Failed",
                description: "Failed to update visibility.",
                variant: "destructive",
            });
        }
    }, [togglePublic, resumeId, toast]);

    const handleTemplateChange = useCallback((templateId) => {
        setSelectedTemplate(templateId);
        toast({
            title: "🎨 Template Changed",
            description: `Switched to ${templates.find(t => t.id === templateId)?.name || templateId} template.`,
            variant: "default",
        });
    }, [templates, toast]);

    const handleBack = useCallback(() => {
        if (resumeData.personal?.full_name && !resumeId) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                router.push('/');
            }
        } else {
            router.push('/');
        }
    }, [router, resumeData, resumeId]);

    const handleTitleChange = useCallback((e) => {
        setResumeTitle(e.target.value);
        setIsAutoTitleEnabled(false);
    }, []);

    const resetToAutoTitle = useCallback(() => {
        setIsAutoTitleEnabled(true);
        setResumeTitle(`${firstName}'s Resume`);
    }, [firstName]);

    // Loading state
    if (templatesLoading || isFetchingResume) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-white text-2xl font-bold mb-2">Loading Resume</h2>
                        <p className="text-gray-400">Preparing your workspace...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/10 to-gray-900">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-center gap-3 flex-1">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleBack}
                                    className="text-white/60 p-2 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </motion.div>

                            <Separator orientation="vertical" className="h-6 bg-white/10" />

                            {/* Title Input */}
                            <div className="relative group flex-1 max-w-80">
                                <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-500" />
                                <div className="relative flex items-center">
                                    <FileText className="absolute left-3 w-4 h-4 text-purple-400" />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-900/80 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder-gray-400"
                                        placeholder="Enter resume title..."
                                        value={resumeTitle}
                                        onChange={handleTitleChange}
                                    />
                                    <AnimatePresence>
                                        {isAutoTitleEnabled && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute right-3"
                                                title="Auto-title enabled"
                                            >
                                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Title Suggestions */}
                            <div className="relative group hidden lg:block">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white"
                                >
                                    <BookType className="w-4 h-4 mr-2" />
                                    Suggestions
                                </Button>
                                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl shadow-purple-500/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                                    <div className="p-2">
                                        {[
                                            `${firstName}'s Resume`,
                                            `${firstName} - Professional Profile`,
                                            `${firstName} | CV`,
                                            `Resume of ${firstName}`,
                                            `${firstName} - Portfolio`
                                        ].map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setResumeTitle(suggestion);
                                                    setIsAutoTitleEnabled(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                            >
                                                {suggestion}
                                            </button>
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

                        {/* Center Section - Template & Layout Controls */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Template Selector */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                                <Palette className="w-4 h-4 text-purple-400" />
                                <select
                                    value={selectedTemplate}
                                    onChange={(e) => handleTemplateChange(e.target.value)}
                                    className="bg-transparent text-white border-none focus:outline-none focus:ring-0 text-sm cursor-pointer"
                                >
                                    {templates.map((template) => (
                                        <option key={template.id} value={template.id} className="bg-gray-900">
                                            {template.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Layout Toggle */}
                            <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`w-8 h-8 justify-center ${previewMode === 'split' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                                    onClick={() => setPreviewMode('split')}
                                >
                                    <Grid className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`w-8 h-8 justify-center ${previewMode === 'editor' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                                    onClick={() => setPreviewMode('editor')}
                                >
                                    <FileText className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`w-8 h-8 justify-center ${previewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                                    onClick={() => setPreviewMode('preview')}
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Editor Density */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditorLayout(editorLayout === 'comfortable' ? 'compact' : 'comfortable')}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 p-2 text-gray-400 hover:text-white"
                                title={editorLayout === 'comfortable' ? 'Compact view' : 'Comfortable view'}
                            >
                                {editorLayout === 'comfortable' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="flex items-center gap-2">
                            {/* Auto-save Indicator */}
                            {autoSave && lastSaved && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                                    <Clock className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs text-gray-400">
                                        Saved {new Date(lastSaved).toLocaleTimeString()}
                                    </span>
                                </div>
                            )}

                            {/* Public/Private Toggle */}
                            {resumeId && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleTogglePublic}
                                    disabled={isTogglingPublic}
                                    className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 ${isPublic ? 'text-emerald-400' : 'text-gray-400'
                                        }`}
                                    title={isPublic ? 'Public' : 'Private'}
                                >
                                    {isTogglingPublic ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : isPublic ? (
                                        <Globe className="w-4 h-4" />
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                </Button>
                            )}

                            {/* Auto-save Toggle */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setAutoSave(!autoSave)}
                                className={`bg-white/5 hover:bg-white/10 border border-white/10 p-2 ${autoSave ? 'text-purple-400' : 'text-gray-400'
                                    }`}
                                title={autoSave ? 'Auto-save enabled' : 'Auto-save disabled'}
                            >
                                <Zap className="w-4 h-4" />
                            </Button>

                            {/* Save Button */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={() => handleSave(false)}
                                    variant="outline"
                                    size="sm"
                                    className="relative overflow-hidden bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 text-white shadow-lg shadow-purple-600/25"
                                    disabled={isSaving || !canSave}
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
                                                <CheckCircle className="w-4 h-4 mr-2" />
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
                                                <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    'Save Resume'
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>

                            {/* Download PDF */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <DownloadPDF
                                    ref={downloadRef}
                                    resumeId={resumeId}
                                    filename={`${resumeData.full_name || 'resume'}-${resumeData.template || 'modern'}.pdf`}
                                    variant="default"
                                    size="sm"
                                    label="Download PDF"
                                    showIcon={true}
                                    showLabel={true}
                                    className=" bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white shadow-lg shadow-blue-600/25"
                                />

                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className={`flex min-h-[calc(100vh-73px)] transition-all duration-300`}>
                {/* Editor Panel */}
                <AnimatePresence mode="wait">
                    {(previewMode === 'split' || previewMode === 'editor') && (
                        <motion.div
                            key="editor"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`
                    ${previewMode === 'split' ? 'w-2/6' : 'w-full'}
                    border-r border-white/10 bg-black/20 backdrop-blur-sm
                `}
                        >
                            <div ref={editorRef} className="h-full overflow-y-auto custom-scrollbar">
                                <ResumeEditor
                                    resumeData={resumeData}
                                    onUpdate={handleUpdate}
                                    onPDFUpload={handlePDFUpload}
                                    layout={editorLayout}
                                    template={selectedTemplate}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Preview Panel */}
                <AnimatePresence mode="wait">
                    {(previewMode === 'split' || previewMode === 'preview') && (
                        <motion.div
                            key="preview"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`
                    ${previewMode === 'split' ? 'w-4/6' : 'w-full'}
                    bg-linear-to-br from-gray-900/50 via-purple-900/10 to-gray-900/50 backdrop-blur-sm
                `}
                        >
                            <div className="h-full overflow-y-auto custom-scrollbar">
                                <div className="p-1 pb-4">
                                    <div className="bg-white/5 rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
                                        <LivePreview
                                            resumeData={resumeData}
                                            template={selectedTemplate}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Helper function for empty resume data
function getEmptyResumeData() {
    return {
        personal: {
            full_name: '',
            headline: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            linkedin: '',
            github: '',
            twitter: '',
        },
        summary: { summary: '' },
        experience: [],
        education: [],
        skills: { technical: [], soft: [], languages: [] },
        projects: [],
        certifications: [],
        languages: [],
        publications: [],
        awards: [],
        volunteering: [],
        interests: [],
        customSections: {}
    };
}

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-purple-400 animate-pulse" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-white text-2xl font-bold mb-2">Loading Editor</h2>
                        <p className="text-gray-400">Preparing your workspace...</p>
                    </div>
                </div>
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}