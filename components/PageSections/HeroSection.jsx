"use client";

import { motion } from "framer-motion";
import { useUser } from "@/hooks/use-user";
import { FileInput, Sparkles, Zap, Shield, Star } from "lucide-react";
import PdfUpload from "@/components/FunctionComponent/PdfUpload";

export default function HeroSection() {
    const { user } = useUser();

    return (
        <section className="relative py-12 px-6 m-0 overflow-hidden bg-[#0000006e]">
            {/* Animated background orbs - cosmic glow effect */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[80vmax] h-[80vmax] bg-purple-600/20 rounded-full blur-[100px] animate-[floatOrb_18s_infinite_alternate_ease-in-out]" />
                <div className="absolute -bottom-40 -left-40 w-[70vmax] h-[70vmax] bg-cyan-500/20 rounded-full blur-[100px] animate-[floatOrb_22s_infinite_alternate-reverse_ease-in-out]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vmax] h-[50vmax] bg-pink-500/15 rounded-full blur-[120px] animate-[pulseGlow_12s_infinite_alternate]" />

                {/* Grid overlay for tech feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-size-[48px_48px] pointer-events-none" />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                {/* Left Content */}
                <div className="flex-1 text-center lg:text-left">
                    {/* Cosmic badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 backdrop-blur-sm border border-purple-500/30 mb-4"
                    >
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-400 to-cyan-400 animate-pulse" />
                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-purple-400 blur-sm animate-ping opacity-60" />
                        </div>
                        <span className="text-sm font-semibold bg-linear-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                            NEXT-GEN AI RESUME PLATFORM
                        </span>
                        <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    </motion.div>

                    {/* Main Heading with staggered animation */}
                    <div className="space-y-4 mb-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
                        >
                            <span className="bg-linear-to-r from-purple-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
                                REDEFINED
                            </span>
                            <br />
                            <span className="bg-linear-to-r from-purple-500 via-pink-400 to-blue-500 bg-clip-text text-transparent relative inline-block">
                                RESUME
                                <motion.span
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    className="absolute -bottom-2 left-0 h-0.75 bg-linear-to-r from-purple-500 to-cyan-500 rounded-full"
                                />
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Upload your PDF resume or start from scratch. Our AI instantly parses and formats your data with quantum precision.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="text-cyan-300 text-lg font-semibold flex items-center gap-2 justify-center lg:justify-start"
                        >
                            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            Quantum parsing meets cosmic design.
                        </motion.p>
                    </div>

                    {/* Button Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        {/* <PdfUpload
                            variant="default"
                            layout="horizontal"
                            className="justify-items-center lg:justify-items-start"
                            showDragDrop={false}
                            firstButtonText="FORGE NEW ARTIFACT"
                            secondButtonText="UPLOAD RESUME"
                            secondButtonIcon={FileInput}
                            firstButtonIcon={Sparkles}
                            firstButtonClassName="group relative overflow-hidden bg-linear-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
                            secondButtonClassName="!bg-white/5 backdrop-blur-sm hover:!bg-white/15 border border-purple-500/40 text-white transition-all duration-300 hover:border-cyan-400/60"
                            onDataExtracted={(data) => {
                                console.log('PDF data extracted:', data);
                            }}
                            onUploadSuccess={(result) => {
                                console.log('Upload successful:', result);
                            }}
                            onUploadError={(error) => {
                                console.error('Upload error:', error);
                            }}
                        /> */}
                        <PdfUpload
                            userId={user?.id}
                            className="justify-items-center lg:justify-items-start"
                            showDragDrop={false}
                            firstButtonText="FORGE NEW ARTIFACT"
                            secondButtonText="UPLOAD RESUME"
                            secondButtonIcon={FileInput}
                            firstButtonIcon={Sparkles}
                            firstButtonClassName="group relative overflow-hidden bg-linear-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
                            secondButtonClassName="!bg-white/5 backdrop-blur-sm hover:!bg-white/15 border border-purple-500/40 text-white transition-all duration-300 hover:border-cyan-400/60"
                            layout="horizontal"
                            gap="gap-5"
                        />
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="flex flex-wrap items-center gap-6 mt-10 justify-center lg:justify-start"
                    >
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span>ATS Optimized</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span>4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <div className="flex -space-x-2">
                                {["/avatars/1.jpg", "/avatars/2.jpg", "/avatars/3.jpg"].map((src, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full bg-linear-to-r from-purple-500 to-pink-500 border-2 border-[#02010a] flex items-center justify-center text-[10px] font-bold text-white">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <span>10k+ users</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Stats Orb with enhanced animations */}
                <StatsOrb />
            </div>

            {/* Custom CSS animations - add to your global CSS or use tailwind config */}
            <style jsx>{`
                @keyframes floatOrb {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(4%, 6%) scale(1.08); }
                }
                @keyframes pulseGlow {
                    0% { opacity: 0.3; transform: scale(1); }
                    100% { opacity: 0.7; transform: scale(1.12); }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 12s linear infinite;
                }
                .animate-spin-reverse {
                    animation: spin-reverse 15s linear infinite;
                }
            `}</style>
        </section>
    );
}

// Stats Orb Component - Enhanced with 3D depth and glowing rings
function StatsOrb() {
    return (
        <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.4 }}
            className="relative mx-auto mt-8 lg:mt-0 w-72 h-72 md:w-80 md:h-80"
        >
            {/* Outer glowing rings */}
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-600/20 to-pink-500/20 blur-xl animate-pulse" />

            {/* Rotating rings layer 1 */}
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-600/30 to-pink-500/30 backdrop-blur-sm border border-purple-500/50 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 rounded-full bg-purple-400 shadow-lg shadow-purple-500" />
            </div>

            {/* Rotating rings layer 2 (reverse) */}
            <div className="absolute inset-3 rounded-full bg-linear-to-r from-blue-600/20 to-cyan-400/20 backdrop-blur-sm border border-blue-500/30 animate-spin-reverse">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500" />
            </div>

            {/* Inner ring */}
            <div className="absolute inset-6 rounded-full bg-linear-to-br from-purple-500/10 to-transparent border border-purple-400/20 backdrop-blur-sm" />

            {/* Core content */}
            <div className="absolute inset-8 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
                    className="text-center bg-linear-to-br from-white/5 to-white/0 backdrop-blur-md rounded-full w-full h-full flex flex-col items-center justify-center border border-white/10"
                >
                    {/* Main stat number */}
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1 }}
                            className="text-5xl md:text-6xl font-black bg-linear-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
                        >
                            99.5%
                        </motion.div>
                        <div className="absolute -top-1 -right-4">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                        </div>
                    </div>

                    {/* Label */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        className="text-sm font-semibold text-slate-300 mt-2 tracking-wide"
                    >
                        ATS SUCCESS RATE
                    </motion.div>

                    {/* Sub label with sparkle */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 1.3 }}
                        className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-linear-to-r from-purple-500/20 to-cyan-500/20 text-[10px] font-medium text-cyan-300"
                    >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>TOP 1% SCORE</span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative floating particles */}
            <motion.div
                animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-3 -right-2 w-2 h-2 rounded-full bg-purple-400 shadow-lg"
            />
            <motion.div
                animate={{ y: [0, 6, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-2 -left-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg"
            />
            <motion.div
                animate={{ x: [0, 5, 0], opacity: [0.2, 0.7, 0.2] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-1/2 -right-1 w-1.5 h-1.5 rounded-full bg-pink-400 shadow-lg"
            />
            <motion.div
                animate={{ x: [0, -5, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-1/3 -left-1 w-1 h-1 rounded-full bg-yellow-400 shadow-lg"
            />
        </motion.div>
    );
}

// Optional: Add custom variants for the floating animation
const floatingAnimation = {
    initial: { y: 0 },
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};