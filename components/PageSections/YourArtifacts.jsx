'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileUp, CheckCircle2 } from "lucide-react";
import PdfUpload from "@/components/Sections/PdfUpload";
import { useResumes } from "@/hooks/use-resumes";
import { ResumeCard, BulkOperationsBar } from "@/components/ResumeOperations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";


export default function YourArtifacts() {
    const { data: resumes, isLoading, refetch } = useResumes();
    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();

    // Handle PDF upload success
    const handleUploadSuccess = (result) => {
        toast({
            title: "✅ PDF Scanned Successfully",
            description: "Your resume has been quantum-parsed!",
            className: "bg-linear-to-r from-purple-600 to-pink-500 text-white",
        });

        if (result.data) {
            const encodedData = encodeURIComponent(JSON.stringify(result.data));
            window.location.href = `/editor?template=modern&data=${encodedData}&source=upload`;
        }
    };

    // Handle start from scratch
    const handleStartFromScratch = () => {
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
        setSelectedIds([]);
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
                            firstButtonClassName="bg-linear-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden group"
                            secondButtonClassName="!bg-[#00f3ff1c] hover:!bg-[#00f3ff30] text-white border border-cyan-500/50"
                            layout="horizontal"
                            gap="gap-6"
                        />
                    </div>
                </div>

                {/* Selection Indicator */}
                {selectedIds.length > 0 && (
                    <div className="mb-6 flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-purple-400" />
                            <span className="text-white">
                                <span className="font-semibold text-purple-400">{selectedIds.length}</span> artifact(s) selected
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className="text-gray-400 hover:text-white"
                        >
                            Clear Selection
                        </Button>
                    </div>
                )}

                {/* Resumes Grid */}
                {resumes?.length > 0 ? (
                    <AnimatePresence>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {resumes.map((resume) => (
                                <div key={resume.resume_id || resume.id} className="relative">
                                    {/* Selection Checkbox */}
                                    <div className="absolute top-4 left-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(resume.resume_id || resume.id)}
                                            onChange={() => toggleSelection(resume.resume_id || resume.id)}
                                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <ResumeCard
                                        resume={resume}
                                        onActionComplete={refetch}
                                    />
                                </div>
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
                />
            </div>
        </section>
    );
}

// Header Component
function Header() {
    return (
        <div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                YOUR{" "}
                <span className="bg-linear-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                    ARTIFACTS
                </span>
            </h2>
            <p className="text-xl text-gray-300">
                Each resume is a digital artifact in your career constellation
            </p>
        </div>
    );
}

// Loading Card Skeleton
function LoadingCard() {
    return (
        <div className="relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6">
            <div className="animate-pulse">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-800 rounded-xl" />
                        <div>
                            <div className="h-5 w-32 bg-gray-800 rounded mb-2" />
                            <div className="h-3 w-24 bg-gray-800 rounded" />
                        </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-800 rounded" />
                </div>
                <div className="space-y-3 mb-6">
                    <div className="h-4 w-full bg-gray-800 rounded" />
                    <div className="h-4 w-3/4 bg-gray-800 rounded" />
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="h-4 w-16 bg-gray-800 rounded" />
                    <div className="h-4 w-16 bg-gray-800 rounded" />
                    <div className="h-4 w-20 bg-gray-800 rounded" />
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-gray-800 rounded" />
                    <div className="h-8 w-24 bg-gray-800 rounded" />
                </div>
            </div>
        </div>
    );
}

// Empty State Component
function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
        >
            <div className="relative mx-auto w-32 h-32 mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
                />
                <div className="absolute inset-4 rounded-full bg-linear-to-r from-purple-600/30 to-pink-500/30 animate-pulse" />
                <div className="absolute inset-8 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-purple-300" />
                </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">VOID DETECTED</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
                Your constellation awaits its first star. Upload a PDF or create a new resume artifact.
            </p>
        </motion.div>
    );
}