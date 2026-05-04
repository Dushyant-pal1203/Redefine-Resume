// components/FunctionComponent/EmptyState.jsx
"use client";

import { motion } from "framer-motion";
import { Sparkles, LogIn, Rocket, FileText, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import PdfUpload from "./PdfUpload";
import { useRouter } from "next/navigation";

export default function EmptyState() {
    const [width, setWidth] = useState(1200);
    const [particles, setParticles] = useState([]);
    const [showUploadSection, setShowUploadSection] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setWidth(window.innerWidth);

        // Generate particles only on client
        const generated = Array.from({ length: 20 }).map(() => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * 400 + 200,
            opacity: 0.2 + Math.random() * 0.5,
            scale: 0.5 + Math.random() * 1.5,
            duration: 5 + Math.random() * 5,
        }));

        setParticles(generated);
    }, []);

    const handleLogin = () => {
        router.push('/login');
    };

    const handleStartFromScratch = () => {
        router.push('/editor?source=scratch');
    };

    const handleDataExtracted = (data) => {
        console.log('PDF data extracted:', data);
        // Store in session storage for the editor to use
        sessionStorage.setItem('uploadedResumeData', JSON.stringify(data));
        // Navigate to editor with the data
        router.push('/editor?source=upload');
    };

    const handleUploadSuccess = (result) => {
        console.log('Upload successful:', result);
    };

    const handleUploadError = (error) => {
        console.error('Upload error:', error);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 px-4 border border-gray-700 rounded-[20px] bg-gray-800/50 backdrop-blur-sm relative overflow-hidden"
        >
            {/* Animated Orb */}
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

                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-2 rounded-full bg-linear-to-r from-purple-600/20 to-pink-500/20 blur-xl"
                />

                <div className="absolute inset-4 rounded-full bg-linear-to-r from-purple-600/30 to-pink-500/30 animate-pulse" />

                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Sparkles className="w-12 h-12 text-purple-300" />
                    </motion.div>
                </div>
            </div>

            {!isAuthenticated ? (
                // Not logged in state
                <>
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        LOGIN REQUIRED
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
                    >
                        Please log in to view and manage your resume artifacts.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Button
                            onClick={handleLogin}
                            className="bg-linear-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white px-8 py-6 text-lg rounded-xl font-semibold group"
                        >
                            <LogIn className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Login to Continue
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-gray-500 mt-6"
                    >
                        New here?{" "}
                        <button
                            onClick={() => router.push('/register')}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Create an account
                        </button>
                    </motion.p>
                </>
            ) : !showUploadSection ? (
                // Logged in but no resumes - Show initial choices
                <>
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        VOID DETECTED
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
                    >
                        Your constellation awaits its first star. Upload a PDF or forge a new resume artifact from scratch.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            onClick={() => setShowUploadSection(true)}
                            className="bg-linear-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold group"
                        >
                            <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Upload PDF
                        </Button>
                        <Button
                            onClick={handleStartFromScratch}
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold group"
                        >
                            <Rocket className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                            Start from Scratch
                        </Button>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xs text-gray-500 mt-6"
                    >
                        Supported: PDF files only. Your data will be automatically parsed.
                    </motion.p>
                </>
            ) : (
                // Upload section visible
                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-white">Upload Your Resume</h3>
                            <Button
                                variant="ghost"
                                onClick={() => setShowUploadSection(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ← Back
                            </Button>
                        </div>

                        <PdfUpload
                            variant="card"
                            layout="vertical"
                            showDragDrop={true}
                            showFirstButton={false}
                            secondButtonText="Select PDF File"
                            secondButtonClassName="bg-linear-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600"
                            buttonSize="default"
                            onDataExtracted={handleDataExtracted}
                            onUploadSuccess={handleUploadSuccess}
                            onUploadError={handleUploadError}
                            animate={true}
                            navigationParams={{
                                userId: user?.id,
                            }}
                        />

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Your data is secure and encrypted
                        </div>
                    </motion.div>
                </>
            )}

            {/* Decorative Grid Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-size-[64px_64px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-77.5 w-77.5 rounded-full bg-purple-600/10 blur-[100px]" />
                <div className="absolute left-1/3 right-0 top-1/4 -z-10 h-62.5 w-62.5 rounded-full bg-cyan-600/10 blur-[100px]" />
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        initial={{
                            x: p.x,
                            y: p.y,
                            opacity: p.opacity,
                            scale: p.scale
                        }}
                        animate={{
                            y: [null, -20, 20, -20, 20, -20],
                            opacity: [null, 0.1, 0.3, 0.1, 0.3, 0.1]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Animated border gradient */}
            <motion.div
                className="absolute inset-0 rounded-[20px] -z-10"
                animate={{
                    boxShadow: [
                        "0 0 0 0 rgba(139, 92, 246, 0)",
                        "0 0 20px 0 rgba(139, 92, 246, 0.3)",
                        "0 0 0 0 rgba(139, 92, 246, 0)"
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </motion.div>
    );
}