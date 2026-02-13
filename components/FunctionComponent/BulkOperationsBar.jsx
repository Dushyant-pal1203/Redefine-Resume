"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDeleteResume } from "@/hooks/use-resumes";
import { useToast } from "@/hooks/use-toast";

export function BulkOperationsBar({ selectedIds, onClear, onActionComplete }) {
    const { mutateAsync: deleteResume } = useDeleteResume();
    const { toast } = useToast();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        setIsBulkDeleting(true);

        try {
            // Properly wait for all deletions
            await Promise.all(
                selectedIds.map((id) => deleteResume(id))
            );

            toast({
                title: "Bulk Delete Successful",
                description: `${selectedIds.length} resume(s) removed permanently.`,
                variant: "delete",
            });

            setShowDeleteModal(false);
            onClear();
            onActionComplete?.();
        } catch (error) {
            console.error("Bulk delete failed:", error);

            toast({
                title: "Bulk Delete Failed",
                description:
                    error?.message || "Something went wrong while deleting.",
                variant: "destructive",
            });
        } finally {
            setIsBulkDeleting(false);
        }
    };

    if (selectedIds.length === 0) return null;

    return (
        <>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 250 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 
        bg-linear-to-r from-gray-900 to-black 
        border border-purple-500/40 
        rounded-full shadow-2xl shadow-purple-500/20 
        px-6 py-3 flex items-center gap-4 z-50"
            >
                <span className="text-white text-sm">
                    <span className="font-semibold text-purple-400">
                        {selectedIds.length}
                    </span>{" "}
                    artifact(s) selected
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
                    className="flex items-center bg-red-600 hover:bg-red-700"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isBulkDeleting ? "Deleting..." : "Delete Selected"}
                </Button>
            </motion.div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Bulk Deletion"
                description={`Are you sure you want to delete ${selectedIds.length} artifact(s)? This action cannot be undone.`}
                size="sm"
                footer={
                    <>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isBulkDeleting}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            disabled={isBulkDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isBulkDeleting
                                ? "Deleting..."
                                : "Confirm Delete"}
                        </Button>
                    </>
                }
            >
                <div className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-white font-medium">
                            This action cannot be undone
                        </p>
                        <p className="text-sm text-gray-300 mt-1">
                            {selectedIds.length} resume artifact(s) will be permanently erased.
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
}
