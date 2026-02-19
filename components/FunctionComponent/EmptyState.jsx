"use client";

import { motion } from "framer-motion";
import { Sparkles, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
    const [width, setWidth] = useState(1200);
    const [particles, setParticles] = useState([]);
    const { isAuthenticated } = useAuth();

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
        // You can customize this based on your login modal/route
        // For example, if you have a login modal:
        // setShowLogin(true);

        // Or if you have a login page:
        window.location.href = '/login';
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
                        New here? <button
                            onClick={() => window.location.href = '/register'}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        >
                            Create an account
                        </button>
                    </motion.p>
                </>
            ) : (
                // Logged in but no resumes state
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
                            onClick={() => document.getElementById('pdf-upload')?.click()}
                            className="bg-linear-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Upload PDF
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/editor?source=scratch'}
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Start from Scratch
                        </Button>
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
        </motion.div>
    );
}