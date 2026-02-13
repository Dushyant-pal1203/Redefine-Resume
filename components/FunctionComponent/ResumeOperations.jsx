"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Copy,
    Edit,
    Trash2,
    Download,
    Share2,
    Eye,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDuplicateResume, useDeleteResume } from "@/hooks/use-resumes";
import { useToast } from "@/hooks/use-toast";

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
                        <Button variant="outline" className="flex items-center justify-center">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                        <Button variant="outline" className="flex items-center justify-center">
                            <Share2 className="w-4 h-4 mr-2" />
                            Email
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}