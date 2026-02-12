"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Copy,
    Edit,
    Trash2,
    Download,
    Share2,
    MoreVertical,
    Eye,
    AlertTriangle,
    FileText,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDuplicateResume, useDeleteResume } from "@/hooks/use-resumes";
import { useToast } from "@/hooks/use-toast";

// Quick Actions Component
export function ResumeQuickActions({ resume, onActionComplete, showLabels = false }) {
    const router = useRouter();
    const { mutate: duplicateResume, isLoading: isDuplicating } = useDuplicateResume();
    const { mutate: deleteResume, isLoading: isDeleting } = useDeleteResume();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const resumeId = resume.resume_id || resume.id;
    const { toast } = useToast();

    const handleView = () => {
        const resumeData = encodeURIComponent(JSON.stringify(resume));
        router.push(`/editor?resumeId=${resumeId}&data=${resumeData}&template=${resume.template || 'modern'}&view=true`);
    };

    const handleEdit = () => {
        const resumeData = encodeURIComponent(JSON.stringify(resume));
        router.push(`/editor?resumeId=${resumeId}&data=${resumeData}&template=${resume.template || 'modern'}`);
    };

    const handleDuplicate = async () => {
        try {
            await duplicateResume(resumeId);
            onActionComplete?.();
        } catch (error) {
            console.error('Duplicate failed:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteResume(resumeId);
            setShowDeleteModal(false);
            onActionComplete?.();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleDownload = () => {
        const dataStr = JSON.stringify(resume, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `${resume.full_name || 'resume'}-${resumeId}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const actions = [
        {
            icon: Eye,
            label: 'View',
            onClick: handleView,
            color: 'text-blue-400',
            hoverColor: 'hover:bg-blue-500/10',
            show: true
        },
        {
            icon: Edit,
            label: 'Edit',
            onClick: handleEdit,
            color: 'text-purple-400',
            hoverColor: 'hover:bg-purple-500/10',
            show: true
        },
        {
            icon: Copy,
            label: 'Duplicate',
            onClick: handleDuplicate,
            isLoading: isDuplicating,
            color: 'text-green-400',
            hoverColor: 'hover:bg-green-500/10',
            show: true
        },
        {
            icon: Download,
            label: 'Download',
            onClick: handleDownload,
            color: 'text-cyan-400',
            hoverColor: 'hover:bg-cyan-500/10',
            show: true
        },
        {
            icon: Share2,
            label: 'Share',
            onClick: () => setShowShareModal(true),
            color: 'text-yellow-400',
            hoverColor: 'hover:bg-yellow-500/10',
            show: true
        },
        {
            icon: Trash2,
            label: 'Delete',
            onClick: () => setShowDeleteModal(true),
            isLoading: isDeleting,
            color: 'text-red-400',
            hoverColor: 'hover:bg-red-500/10',
            show: true
        }
    ];

    return (
        <>
            <div className={`flex ${showLabels ? 'flex-col gap-2 items-center justify-center' : 'items-center gap-1'}`}>
                {actions.map((action, index) => (
                    action.show && (
                        <Button
                            key={index}
                            variant="ghost"
                            size={showLabels ? "default" : "icon"}
                            onClick={action.onClick}
                            disabled={action.isLoading}
                            className={`${action.color} ${action.hoverColor} ${showLabels ? 'w-full flex gap-2 px-2 py-2 justify-start items-center' : ''
                                }`}
                        >
                            <action.icon className={`${showLabels ? 'w-4 h-4 mr-2' : 'w-4 h-4'}`} />
                            {showLabels && action.label}
                            {action.isLoading && !showLabels && (
                                <span className="ml-2 animate-spin">⏳</span>
                            )}
                        </Button>
                    )
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Deconstruct Artifact"
                description="This action cannot be undone. The resume will be permanently erased from your constellation."
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deconstructing...' : 'Confirm Delete'}
                        </Button>
                    </>
                }
            >
                <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                        <p className="text-sm text-white">
                            You are about to delete <span className="font-semibold">{resume.full_name || 'Untitled'}'s resume</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            ID: #{resumeId?.toString().slice(-4)}
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Share Modal */}
            <Modal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                title="Share Artifact"
                description="Share your resume with others"
                size="md"
            >
                <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-300 mb-2">Share Link</p>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 p-2 bg-gray-900 rounded text-xs text-gray-400">
                                {`${window.location.origin}/preview/${resumeId}`}
                            </code>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/preview/${resumeId}`);
                                    toast({
                                        title: "✅ Link Copied",
                                        description: "Share link copied to clipboard",
                                    });
                                }}
                            >
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 pt-4">
                        <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <Share2 className="w-4 h-4 mr-2" />
                            Email
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

// Resume Card with Actions
export function ResumeCard({ resume, onActionComplete }) {
    const router = useRouter();
    const [showActions, setShowActions] = useState(false);
    const resumeId = resume.resume_id || resume.id;
    const firstName = resume.full_name?.split(' ')[0] || 'Untitled';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            // whileHover={{ y: -5 }}
            className="group relative cursor-pointer"
            onMouseEnter={() => setShowActions(false)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

            <div className="relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-purple-500">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                            <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                                {firstName}'s Resume
                            </h3>
                            <p className="text-sm text-gray-400">
                                {resume.template || 'Modern'} Template
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(!showActions);
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ResumeQuickActions
                                    resume={resume}
                                    onActionComplete={onActionComplete}
                                    showLabels={true}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Rest of the card content */}
                <div className="space-y-3 mb-6 h-32">
                    {resume.professional_summary && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                            {resume.professional_summary}
                        </p>
                    )}
                </div>

                {/* Footer with main action */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        ID: #{resumeId?.toString().slice(-4)}
                    </span>
                    <Button
                        variant="ghost"
                        className=" flex items-center group/btn text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/editor?resumeId=${resumeId}&data=${encodeURIComponent(JSON.stringify(resume))}&template=${resume.template || 'modern'}`);
                        }}
                    >
                        Open Artifact
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div >
        </motion.div >
    );
}

// Bulk Operations Bar - Fixed without useBulkResumeOperations
export function BulkOperationsBar({ selectedIds, onClear, onActionComplete }) {
    const { mutate: deleteResume, isLoading: isDeleting } = useDeleteResume();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const { toast } = useToast();

    const handleBulkDelete = async () => {
        setIsBulkDeleting(true);
        try {
            // Delete each resume one by one
            await Promise.all(selectedIds.map(id => deleteResume(id)));

            toast({
                title: "🔥 Bulk Delete Successful",
                description: `${selectedIds.length} resume(s) removed`,
            });

            setShowDeleteModal(false);
            onClear();
            onActionComplete?.();
        } catch (error) {
            console.error('Bulk delete failed:', error);
            toast({
                title: "❌ Bulk Delete Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsBulkDeleting(false);
        }
    };

    if (selectedIds.length === 0) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-gray-900 to-black border border-purple-500/50 rounded-full shadow-2xl shadow-purple-500/20 px-6 py-3 flex items-center gap-4 z-50"
        >
            <span className="text-white">
                <span className="font-semibold text-purple-400">{selectedIds.length}</span> artifact(s) selected
            </span>

            <div className="w-px h-6 bg-gray-700" />

            <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-gray-400 hover:text-white"
            >
                Clear
            </Button>

            <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteModal(true)}
                disabled={isBulkDeleting}
                className="bg-red-600 hover:bg-red-700"
            >
                <Trash2 className="w-4 h-4 mr-2" />
                {isBulkDeleting ? 'Deleting...' : 'Delete Selected'}
            </Button>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Bulk Deconstruction"
                description={`Are you sure you want to delete ${selectedIds.length} artifact(s)? This action cannot be undone.`}
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            disabled={isBulkDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isBulkDeleting ? 'Deconstructing...' : 'Confirm Delete'}
                        </Button>
                    </>
                }
            >
                <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                    <p className="text-sm text-gray-300">
                        This will permanently erase {selectedIds.length} resume artifact(s) from your constellation.
                    </p>
                </div>
            </Modal>
        </motion.div>
    );
}