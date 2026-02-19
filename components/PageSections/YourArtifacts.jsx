'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, FileUp, CheckCircle2, Rocket, Trophy } from "lucide-react";
import PdfUpload from "@/components/FunctionComponent/PdfUpload";
import { useResumes } from "@/hooks/use-resumes";
import { ResumeCard } from "@/components/ui/cards/ResumeCard";
import { BulkOperationsBar } from "@/components/FunctionComponent/BulkOperationsBar";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/FunctionComponent/EmptyState";
import { useAuth } from "@/hooks/use-auth";
import LoginModal from '@/components/Auth/LoginModal';
import RegisterModal from '@/components/Auth/RegisterModal';

export default function YourArtifacts() {
    // All hooks MUST be called at the top level, unconditionally
    const { resumes, isLoading, error, fetchResumes } = useResumes();
    const [selectedIds, setSelectedIds] = useState([]);
    const { toast } = useToast();
    const { user, isAuthenticated } = useAuth();

    // Modal state hooks - always called
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    // Fetch resumes when component mounts and user is authenticated
    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchResumes();
        }
    }, [isAuthenticated, user?.id, fetchResumes]);

    // Handle PDF upload success
    const handleUploadSuccess = (result) => {
        toast({
            title: "🔮 Quantum Scan Complete",
            description: "Your resume has been parsed with quantum precision!",
        });

        setTimeout(() => {
            toast({
                title: "✨ Artifact Forged",
                description: "Ready for editing in the quantum forge",
            });
        }, 300);

        if (result) {
            const encodedData = encodeURIComponent(JSON.stringify(result));
            window.location.href = `/editor?template=modern&data=${encodedData}&source=upload`;
        }
    };

    // Handle start from scratch
    const handleStartFromScratch = () => {
        toast({
            title: "🚀 New Journey Begins",
            description: "Creating a fresh canvas for your career story",
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
        });
        setSelectedIds([]);
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        toast({
            title: "🗑️ Artifacts Removed",
            description: `${selectedIds.length} artifact(s) have been archived`,
        });
        fetchResumes();
        setSelectedIds([]);
    };

    // Handle duplicate
    const handleDuplicate = (id) => {
        toast({
            title: "📄 Artifact Duplicated",
            description: "A new copy has been added to your collection",
        });
        fetchResumes();
    };

    // Render based on authentication state - but hooks are already called above
    return (
        <>
            {!isAuthenticated ? (
                // Unauthenticated view
                <section id="artifacts" className="py-20 px-6 min-h-screen flex items-center">
                    <div className="container mx-auto max-w-7xl">
                        <Header />
                        <div className="mt-4 text-center p-16 max-w-7xl mx-auto bg-[#00000060] rounded-4xl">
                            {/* Lock Icon */}
                            <div className="mb-8 flex justify-center">
                                <div className="w-24 h-24 bg-linear-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-12 h-12 text-purple-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Secure Your Creations
                            </h2>

                            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                                Your artifacts are waiting for you. Log in to access your personal collection of generated content, saved preferences, and creative history.
                            </p>

                            {/* Benefits List */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                                <div className="p-4 bg-white/5 rounded-xl backdrop-blur-xs">
                                    <svg className="w-6 h-6 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm text-gray-300">Access saved artifacts</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl backdrop-blur-xs">
                                    <svg className="w-6 h-6 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span className="text-sm text-gray-300">Create new artifacts</span>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl backdrop-blur-xs">
                                    <svg className="w-6 h-6 text-cyan-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-sm text-gray-300">Sync across devices</span>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-4 justify-items-center">
                                <Button
                                    onClick={() => setShowLoginModal(true)}
                                    className="bg-linear-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/35 transition-all duration-300 transform hover:scale-105"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Log In to Your Account
                                    </span>
                                </Button>

                                <p className="text-sm text-gray-300">
                                    Don't have an account?{' '}
                                    <button
                                        onClick={() => setShowRegisterModal(true)}
                                        className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                                    >
                                        Sign up here
                                    </button>
                                </p>
                            </div>

                            {/* Decorative Elements */}
                            <div className="mt-12 flex justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-purple-500/50"></div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : isLoading ? (
                // Loading skeleton
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
            ) : (
                // Authenticated view with content
                <section id="artifacts" className="py-20 px-6">
                    <div className="container mx-auto max-w-7xl">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
                            <Header />

                            {/* PDF Upload Component */}
                            <div className="mb-16">
                                <PdfUpload
                                    userId={user?.id}
                                    showDragDrop={false}
                                    firstButtonText="FORGE NEW ARTIFACT"
                                    secondButtonText="UPLOAD RESUME"
                                    firstButtonIcon={Sparkles}
                                    secondButtonIcon={FileUp}
                                    onStartFromScratch={handleStartFromScratch}
                                    onUploadSuccess={handleUploadSuccess}
                                    onUploadError={handleUploadError}
                                    firstButtonClassName="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden group"
                                    secondButtonClassName="!bg-[#00f3ff1c] hover:!bg-[#00f3ff30] text-white border border-cyan-500/50"
                                    layout="horizontal"
                                    gap="gap-6"
                                />
                            </div>
                        </div>

                        {/* Error message if any */}
                        {error && (
                            <div className="mb-8 p-4 bg-red-900/20 border border-red-700/50 rounded-lg text-red-400">
                                Error loading resumes: {error}
                            </div>
                        )}

                        {/* Resumes Grid */}
                        {resumes && resumes.length > 0 ? (
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
                                                onActionComplete={fetchResumes}
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
                        {selectedIds.length > 0 && (
                            <BulkOperationsBar
                                selectedIds={selectedIds}
                                onClear={clearSelection}
                                onActionComplete={fetchResumes}
                                onBulkDelete={handleBulkDelete}
                            />
                        )}
                    </div>
                </section>
            )}

            {/* Modals - always rendered */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSwitchToRegister={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                }}
            />
            <RegisterModal
                isOpen={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onSwitchToLogin={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                }}
            />
        </>
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