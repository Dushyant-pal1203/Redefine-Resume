"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useDeleteResume } from "@/hooks/use-resumes";
import { useToast } from "@/hooks/use-toast";

export function BulkOperationsBar({ selectedIds, onClear, onActionComplete }) {
    const { mutate: deleteResume, isLoading: isDeleting } = useDeleteResume();
    const { toast } = useToast();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;

        setIsBulkDeleting(true);

        try {
            // Use Promise.allSettled to handle partial failures
            const results = await Promise.allSettled(
                selectedIds.map((id) => deleteResume(id))
            );

            // Count successes and failures
            const succeeded = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
            const failed = results.filter(r => r.status === 'rejected' || r.value === false).length;

            if (failed === 0) {
                // All succeeded
                toast({
                    title: "✅ Bulk Delete Successful",
                    description: `${succeeded} resume(s) removed permanently.`,
                    variant: "success",
                });
            } else if (succeeded === 0) {
                // All failed
                toast({
                    title: "❌ Bulk Delete Failed",
                    description: "Failed to delete selected resumes. Please try again.",
                    variant: "destructive",
                });
            } else {
                // Partial success
                toast({
                    title: "⚠️ Partial Success",
                    description: `${succeeded} deleted, ${failed} failed.`,
                    variant: "warning",
                });
            }

            setShowDeleteModal(false);
            onClear();
            onActionComplete?.();
        } catch (error) {
            console.error("Bulk delete error:", error);
            toast({
                title: "❌ Bulk Delete Failed",
                description: error?.message || "Something went wrong while deleting.",
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
                className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 
                    bg-linear-to-r from-gray-900 to-black 
                    border border-purple-500/40 
                    rounded-full shadow-2xl shadow-purple-500/20 
                    px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 
                    flex items-center gap-2 sm:gap-3 md:gap-4 
                    z-50 w-[95%] sm:w-auto max-w-[95vw] sm:max-w-none
                    mx-auto"
            >
                <span className="text-white text-xs sm:text-sm whitespace-nowrap">
                    <span className="font-semibold text-purple-400">
                        {selectedIds.length}
                    </span>{" "}
                    <span className="hidden xs:inline">artifact(s)</span>
                    <span className="xs:hidden">selected</span>
                </span>

                <div className="w-px h-4 sm:h-5 md:h-6 bg-gray-700" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="text-gray-400 hover:text-white text-xs sm:text-sm px-2 sm:px-3"
                    disabled={isBulkDeleting}
                >
                    Clear
                </Button>

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isBulkDeleting}
                    className="flex items-center bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-2 sm:px-3 md:px-4"
                >
                    {isBulkDeleting ? (
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                    ) : (
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    )}
                    <span className="hidden xs:inline">
                        {isBulkDeleting ? "Deleting..." : "Delete"}
                    </span>
                    <span className="xs:hidden">
                        {selectedIds.length}
                    </span>
                </Button>
            </motion.div>

            <Modal
                isOpen={showDeleteModal}
                onClose={() => !isBulkDeleting && setShowDeleteModal(false)}
                title="Delete Resumes"
                description={`Are you sure you want to delete ${selectedIds.length} resume(s)?`}
                size="sm"
                footer={
                    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteModal(false)}
                            disabled={isBulkDeleting}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleBulkDelete}
                            disabled={isBulkDeleting}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
                        >
                            {isBulkDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Permanently"
                            )}
                        </Button>
                    </div>
                }
            >
                <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm sm:text-base text-white font-medium">
                            This action cannot be undone
                        </p>
                        <p className="text-xs sm:text-sm text-gray-300 mt-1">
                            {selectedIds.length} resume(s) will be permanently erased from your account.
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                            Make sure you have backups if needed.
                        </p>
                    </div>
                </div>
            </Modal>
        </>
    );
}