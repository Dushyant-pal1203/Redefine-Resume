'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileUp, CheckCircle2, Rocket, Trophy } from "lucide-react";
import PdfUpload from "@/components/FunctionComponent/PdfUpload";
import { useResumes } from "@/hooks/use-resumes";
import { ResumeCard } from "@/components/ui/cards/ResumeCard";
import { BulkOperationsBar } from "@/components/FunctionComponent/BulkOperationsBar";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/FunctionComponent/EmptyState";

export default function YourArtifacts() {
    const { data: resumes, isLoading, refetch } = useResumes();
    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();

    // Handle PDF upload success
    const handleUploadSuccess = (result) => {
        // Success toast with quantum theme
        toast({
            title: "🔮 Quantum Scan Complete",
            description: "Your resume has been parsed with quantum precision!",
            variant: "quantum",
        });

        // Success toast with animation
        setTimeout(() => {
            toast({
                title: "✨ Artifact Forged",
                description: "Ready for editing in the quantum forge",
                variant: "success",
            });
        }, 300);

        if (result.data) {
            const encodedData = encodeURIComponent(JSON.stringify(result.data));
            window.location.href = `/editor?template=modern&data=${encodedData}&source=upload`;
        }
    };

    // Handle start from scratch
    const handleStartFromScratch = () => {
        // Creation toast
        toast({
            title: "🚀 New Journey Begins",
            description: "Creating a fresh canvas for your career story",
            variant: "create",
        });

        const emptyData = {
            full_name: '',
            email: '',
            phone: '',
            location: '',
            professional_summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: []
        };

        const encodedData = encodeURIComponent(JSON.stringify(emptyData));
        window.location.href = `/editor?template=modern&data=${encodedData}&source=scratch`;
    };

    // Handle upload error
    const handleUploadError = (error) => {
        toast({
            title: "⚠️ Upload Failed",
            description: error.message || "Unable to process your PDF. Please try again.",
            variant: "destructive",
        });
    };

    // Toggle selection for bulk operations
    const toggleSelection = (id) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(selectedId => selectedId !== id)
                : [...prev, id]
        );
    };

    // Clear all selections
    const clearSelection = () => {
        toast({
            title: "✨ Selection Cleared",
            description: `Removed ${selectedIds.length} artifact(s) from selection`,
            variant: "info",
        });
        setSelectedIds([]);
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        toast({
            title: "🗑️ Artifacts Removed",
            description: `${selectedIds.length} artifact(s) have been archived`,
            variant: "delete",
        });
    };

    // Handle duplicate
    const handleDuplicate = (id) => {
        toast({
            title: "📄 Artifact Duplicated",
            description: "A new copy has been added to your collection",
            variant: "duplicate",
        });
    };

    // Loading skeleton
    if (isLoading) {
        return (
            <section id="artifacts" className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    <Header />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <LoadingCard key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="artifacts" className="py-20 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
                    <Header />

                    {/* PDF Upload Component */}
                    <div className="mb-16">
                        <PdfUpload
                            firstButtonText="FORGE NEW ARTIFACT"
                            secondButtonText="UPLOAD RESUME"
                            firstButtonIcon={Sparkles}
                            secondButtonIcon={FileUp}
                            firstButtonOnClick={handleStartFromScratch}
                            afterUpload={handleUploadSuccess}
                            onError={handleUploadError}
                            firstButtonClassName="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden group"
                            secondButtonClassName="!bg-[#00f3ff1c] hover:!bg-[#00f3ff30] text-white border border-cyan-500/50"
                            layout="horizontal"
                            gap="gap-6"
                        />
                    </div>
                </div>


                {/* Resumes Grid */}
                {resumes?.length > 0 ? (
                    <AnimatePresence>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {resumes.map((resume, index) => (
                                <motion.div
                                    key={resume.resume_id || resume.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative"
                                >
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(resume.resume_id || resume.id)}
                                            onChange={() => toggleSelection(resume.resume_id || resume.id)}
                                            className="w-4 h-4 rounded border-gray-600 bg-gray-800/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-0 backdrop-blur-sm"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <ResumeCard
                                        resume={resume}
                                        onActionComplete={refetch}
                                        onDuplicate={handleDuplicate}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                ) : (
                    <EmptyState />
                )}

                {/* Bulk Operations Bar */}
                <BulkOperationsBar
                    selectedIds={selectedIds}
                    onClear={clearSelection}
                    onActionComplete={refetch}
                    onBulkDelete={handleBulkDelete}
                />
            </div>
        </section>
    );
}

// Header Component
function Header() {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                YOUR{" "}
                <span className="bg-linear-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                    ARTIFACTS
                </span>
            </h2>
            <p className="text-xl text-gray-300">
                Each resume is a digital artifact in your career constellation
            </p>
        </motion.div>
    );
}

// Loading Card Skeleton
function LoadingCard() {
    return (
        <div className="relative bg-linear-to-br from-gray-900/50 to-black/50 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-xl">
            <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-800/50 rounded-xl" />
                        <div>
                            <div className="h-5 w-32 bg-gray-800/50 rounded mb-2" />
                            <div className="h-3 w-24 bg-gray-800/50 rounded" />
                        </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-800/50 rounded" />
                </div>
                <div className="space-y-3 mb-6">
                    <div className="h-4 w-full bg-gray-800/50 rounded" />
                    <div className="h-4 w-3/4 bg-gray-800/50 rounded" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-4 w-16 bg-gray-800/50 rounded" />
                    <div className="h-4 w-16 bg-gray-800/50 rounded" />
                    <div className="h-4 w-20 bg-gray-800/50 rounded" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-gray-800/50 rounded" />
                    <div className="h-8 w-24 bg-gray-800/50 rounded" />
                </div>
            </div>
        </div>
    );
}