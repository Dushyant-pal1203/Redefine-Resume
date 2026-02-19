// components/FunctionComponent/ResumeOperations.jsx
"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Copy,
    Edit,
    Trash2,
    Download,
    Share2,
    Eye,
    AlertTriangle,
    Sparkles,
    FileJson,
    Globe,
    Lock,
    Mail,
    Link2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDeleteResume, useTogglePublicResume, useDuplicateResume } from "@/hooks/use-resumes";
import { useToast } from "@/hooks/use-toast";
import DownloadPDF from './DownloadPDF';

export function ResumeQuickActions({
    resume,
    onActionComplete,
    showLabels = false,
    variant = "default", // default, compact, floating
    orientation = "horizontal", // horizontal, vertical
    className = "",
    hideActions = [], // array of actions to hide: ['view', 'edit', 'duplicate', 'download', 'share', 'delete']
    onAction,
    size = "default" // sm, default, lg
}) {
    const router = useRouter();
    const { mutate: deleteResume, isLoading: isDeleting } = useDeleteResume();
    const { mutate: togglePublic, isLoading: isTogglingPublic } = useTogglePublicResume();
    const { mutate: duplicateResume, isLoading: isDuplicating } = useDuplicateResume();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showPublicTooltip, setShowPublicTooltip] = useState(false);
    const resumeId = resume.resume_id || resume.id;
    const { toast } = useToast();
    const downloadRef = useRef(null);

    const handleView = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(`resume_${resumeId}`, JSON.stringify(resume));
        }
        onAction?.('view', resume);
        router.push(`/preview/${resumeId}`);
    }, [resume, resumeId, router, onAction]);

    const handleEdit = useCallback(() => {
        const resumeData = encodeURIComponent(JSON.stringify(resume));
        onAction?.('edit', resume);
        router.push(`/editor?resumeId=${resumeId}&data=${resumeData}&template=${resume.template || 'modern'}`);
    }, [resume, resumeId, router, onAction]);

    const handleDuplicate = useCallback(async () => {
        try {
            await duplicateResume(resumeId);
            onAction?.('duplicate', resume);
            onActionComplete?.();

            toast({
                title: "✨ Duplicate Created",
                description: "Resume has been duplicated successfully.",
                variant: "default",
            });
        } catch (error) {
            console.error('Duplicate failed:', error);
            toast({
                title: "❌ Duplicate Failed",
                description: "Failed to duplicate resume. Please try again.",
                variant: "destructive",
            });
        }
    }, [duplicateResume, resumeId, resume, onAction, onActionComplete, toast]);

    const handleDelete = useCallback(async () => {
        try {
            await deleteResume(resumeId);
            setShowDeleteModal(false);
            onAction?.('delete', resume);
            onActionComplete?.();

            toast({
                title: "🗑️ Resume Deleted",
                description: "The resume has been permanently removed.",
                variant: "default",
            });
        } catch (error) {
            console.error('Delete failed:', error);
            toast({
                title: "❌ Delete Failed",
                description: "Failed to delete resume. Please try again.",
                variant: "destructive",
            });
        }
    }, [deleteResume, resumeId, onAction, onActionComplete, toast]);

    const handleDownloadJSON = useCallback(() => {
        const dataStr = JSON.stringify(resume, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${resume.full_name || 'resume'}-${resumeId}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        onAction?.('download-json', resume);

        toast({
            title: "📥 JSON Downloaded",
            description: "Resume data has been exported as JSON.",
            variant: "default",
        });
    }, [resume, resumeId, onAction, toast]);

    const handleTogglePublic = useCallback(async () => {
        try {
            const result = await togglePublic(resumeId);

            onAction?.('toggle-public', { ...resume, is_public: result.is_public });

            toast({
                title: result.is_public ? "🌐 Resume Published" : "🔒 Resume Private",
                description: result.is_public
                    ? "Your resume is now publicly accessible."
                    : "Your resume is now private.",
                variant: "default",
            });
        } catch (error) {
            console.error('Toggle public failed:', error);
            toast({
                title: "❌ Action Failed",
                description: "Failed to update visibility. Please try again.",
                variant: "destructive",
            });
        }
    }, [togglePublic, resumeId, onAction, toast]);

    const getActionConfig = () => {
        const baseActions = [
            {
                id: 'view',
                icon: Eye,
                label: 'View',
                onClick: handleView,
                color: 'text-blue-400',
                hoverColor: 'hover:bg-blue-500/10',
                hoverBorder: 'hover:border-blue-500/30',
                show: !hideActions.includes('view')
            },
            {
                id: 'edit',
                icon: Edit,
                label: 'Edit',
                onClick: handleEdit,
                color: 'text-purple-400',
                hoverColor: 'hover:bg-purple-500/10',
                hoverBorder: 'hover:border-purple-500/30',
                show: !hideActions.includes('edit')
            },
            {
                id: 'duplicate',
                icon: Copy,
                label: 'Duplicate',
                onClick: handleDuplicate,
                color: 'text-green-400',
                hoverColor: 'hover:bg-green-500/10',
                hoverBorder: 'hover:border-green-500/30',
                show: !hideActions.includes('duplicate')
            },
            {
                id: 'download',
                icon: Download,
                label: 'Download JSON',
                onClick: handleDownloadJSON,
                color: 'text-cyan-400',
                hoverColor: 'hover:bg-cyan-500/10',
                hoverBorder: 'hover:border-cyan-500/30',
                show: !hideActions.includes('download')
            },
            {
                id: 'share',
                icon: Share2,
                label: 'Share',
                onClick: () => setShowShareModal(true),
                color: 'text-yellow-400',
                hoverColor: 'hover:bg-yellow-500/10',
                hoverBorder: 'hover:border-yellow-500/30',
                show: !hideActions.includes('share')
            },
            {
                id: 'delete',
                icon: Trash2,
                label: 'Delete',
                onClick: () => setShowDeleteModal(true),
                isLoading: isDeleting,
                color: 'text-red-400',
                hoverColor: 'hover:bg-red-500/10',
                hoverBorder: 'hover:border-red-500/30',
                show: !hideActions.includes('delete')
            }
        ];

        // Add public toggle for compact/floating variants
        if (variant === 'compact' || variant === 'floating') {
            baseActions.splice(4, 0, {
                id: 'public',
                icon: resume.is_public ? Globe : Lock,
                label: resume.is_public ? 'Make Private' : 'Make Public',
                onClick: handleTogglePublic,
                isLoading: isTogglingPublic,
                color: resume.is_public ? 'text-emerald-400' : 'text-gray-400',
                hoverColor: 'hover:bg-white/10',
                hoverBorder: 'hover:border-white/20',
                show: !hideActions.includes('public')
            });
        }

        return baseActions;
    };

    const actions = getActionConfig();

    const containerClasses = {
        default: `flex ${orientation === 'horizontal' ? 'flex-col' : 'flex-col'} ${orientation === 'horizontal' ? 'items-center' : 'items-stretch'} gap-1`,
        compact: `flex ${orientation === 'horizontal' ? 'flex-col' : 'flex-col'} ${orientation === 'horizontal' ? 'items-center' : 'items-stretch'} gap-0.5`,
        floating: 'flex flex-col items-stretch gap-2 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl'
    };

    const buttonSizes = {
        sm: showLabels ? 'px-2 py-1.5 text-xs' : 'p-1.5',
        default: showLabels ? 'px-3 py-2 text-sm' : 'p-2',
        lg: showLabels ? 'px-4 py-2.5 text-base' : 'p-2.5'
    };

    return (
        <>
            <div className={`${containerClasses[variant]} ${className}`}>
                <AnimatePresence mode="popLayout">
                    {actions.map((action, index) =>
                        action.show && (
                            <motion.div
                                key={action.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={variant === 'floating' ? 'w-full' : ''}
                            >
                                <Button
                                    variant="ghost"
                                    size={size}
                                    onClick={action.onClick}
                                    disabled={action.isLoading}
                                    className={`
                                        relative overflow-hidden group
                                        ${action.color} ${action.hoverColor}
                                        ${variant === 'floating' ? 'w-full justify-start' : ''}
                                        ${showLabels ? 'w-full justify-start' : ''}
                                        ${buttonSizes[size]}
                                        border border-transparent ${action.hoverBorder}
                                        transition-all duration-300
                                    `}
                                >
                                    {/* Hover effect gradient */}
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    <div className="relative flex items-center gap-2">
                                        <action.icon className={`
                                            ${showLabels ? 'w-4 h-4' : 'w-4 h-4'}
                                            transition-transform group-hover:scale-110
                                        `} />

                                        {showLabels && (
                                            <span className="font-medium">{action.label}</span>
                                        )}

                                        {action.isLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Tooltip for compact mode */}
                                    {!showLabels && variant !== 'floating' && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                            {action.label}
                                        </span>
                                    )}
                                </Button>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Resume"
                description="This action cannot be undone. The resume will be permanently deleted."
                size="sm"
                footer={
                    <div className="flex gap-3 w-full">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteModal(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Deleting...
                                </div>
                            ) : (
                                'Confirm Delete'
                            )}
                        </Button>
                    </div>
                }
            >
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-white">
                            You are about to delete <span className="font-semibold text-red-400">"{resume.resume_title || resume.full_name || 'Untitled'}"</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            This will permanently remove this resume and all associated data.
                        </p>
                        {resumeId && (
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                                ID: {resumeId.slice(-8)}
                            </p>
                        )}
                    </div>
                </motion.div>
            </Modal>

            {/* Share Modal */}
            <Modal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title="Share Resume"
                description="Share your resume with others"
                size="md"
            >
                <div className="space-y-6">
                    {/* Public/Private Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-800/50 rounded-xl border border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                {resume.is_public ? (
                                    <Globe className="w-4 h-4 text-emerald-400" />
                                ) : (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-sm font-medium text-white">
                                    {resume.is_public ? 'Public Resume' : 'Private Resume'}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTogglePublic}
                                disabled={isTogglingPublic}
                                className={`
                                    ${resume.is_public
                                        ? 'border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400'
                                        : 'border-gray-600 hover:border-gray-500 text-gray-300'
                                    }
                                `}
                            >
                                {isTogglingPublic ? (
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : resume.is_public ? (
                                    'Make Private'
                                ) : (
                                    'Make Public'
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-400">
                            {resume.is_public
                                ? 'Anyone with the link can view this resume'
                                : 'Only you can view this resume'}
                        </p>
                    </motion.div>

                    {/* Share Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Link2 className="w-4 h-4" />
                            <span>Shareable Link</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 p-3 bg-gray-900 rounded-xl border border-gray-700 font-mono text-xs text-gray-400 truncate">
                                {`${window.location.origin}/preview/${resumeId}`}
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/preview/${resumeId}`);
                                    toast({
                                        title: "✅ Link Copied",
                                        description: "Share link copied to clipboard",
                                    });
                                }}
                                className="shrink-0 border-gray-700 hover:border-gray-600"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>

                    {/* Export Options */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Download className="w-4 h-4" />
                            <span>Export Options</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <DownloadPDF
                                ref={downloadRef}
                                resumeData={resume}
                                template={resume.template || 'modern'}
                                filename={`${resume.full_name || 'resume'}.pdf`}
                                variant="outline"
                                size="default"
                                label="PDF"
                                showIcon={true}
                                showLabel={true}
                                elementId="resume-preview-content"
                                className="w-full border-gray-700 hover:border-gray-600"
                            />
                            <Button
                                variant="outline"
                                onClick={handleDownloadJSON}
                                className="border-gray-700 hover:border-gray-600"
                            >
                                <FileJson className="w-4 h-4 mr-2" />
                                JSON
                            </Button>
                        </div>
                    </motion.div>

                    {/* Email Share */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="pt-2"
                    >
                        <Button
                            variant="ghost"
                            className="w-full border border-gray-700 hover:bg-gray-800"
                            onClick={() => {
                                window.location.href = `mailto:?subject=Check out my resume&body=View my resume here: ${window.location.origin}/preview/${resumeId}`;
                            }}
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Share via Email
                        </Button>
                    </motion.div>
                </div>
            </Modal>
        </>
    );
}