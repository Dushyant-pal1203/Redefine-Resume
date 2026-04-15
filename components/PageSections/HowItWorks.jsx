"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
    Upload,
    Sparkles,
    ArrowRight,
    CheckCircle,
    Zap,
    Cpu,
    LayoutTemplate,
    Palette,
    Pencil,
    Download
} from "lucide-react";

export default function HowItWorks() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const steps = [
        {
            id: 1,
            title: "Upload or Start Fresh",
            description: "Upload your existing PDF resume or build from scratch.",
            icon: Upload,
            gradient: "from-purple-500 to-pink-500",
            features: ["PDF/DOCX", "Manual builder", "Smart parsing"]
        },
        {
            id: 2,
            title: "AI Quantum Parsing",
            description: "AI-powered editor helps you optimize content and fix grammar.",
            icon: Pencil,
            gradient: "from-cyan-500 to-blue-500",
            features: ["AI suggestions", "Grammar check", "Keyword optimization"]
        },
        {
            id: 3,
            title: "Choose Your Artifact",
            description: "Pick templates and customize design in real-time.",
            icon: Palette,
            gradient: "from-purple-500 to-cyan-500",
            features: ["20+ templates", "Live preview", "Unlimited edits"]
        },
        {
            id: 4,
            title: "Download & Conquer",
            description: "Export your polished resume & track your ATS score instantly",
            icon: Download,
            gradient: "from-pink-500 to-purple-500",
            features: ["PDF export", "ATS score", "Share link"]
        }
    ];

    // 🔁 Auto loop
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % steps.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isPaused, steps.length]);

    return (
        <section className="relative py-20 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <div ref={ref} className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center md:text-left mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                            How It
                        </span>
                        <span className="text-white ml-4">Works</span>
                    </h2>
                    <p className="text-xl text-gray-300">
                        Choose a template or upload your PDF - we'll handle the rest for you.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = activeIndex === index;
                        const isLast = index === steps.length - 1;

                        return (
                            <motion.div
                                key={step.id}
                                onMouseEnter={() => setIsPaused(true)}
                                onMouseLeave={() => setIsPaused(false)}
                                animate={{
                                    y: isActive ? -10 : 0,
                                    scale: isActive ? 1.05 : 1
                                }}
                                transition={{ duration: 0.4 }}
                                className="relative group"
                            >
                                {/* Arrow */}
                                {!isLast && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-linear-to-r from-purple-500/40 to-cyan-500/40">
                                        <ArrowRight className="absolute -right-2 -top-1.5 w-4 h-4 text-purple-400/60" />
                                    </div>
                                )}

                                <div className="relative bg-[#1c1917] rounded-2xl p-6 border border-purple-500/20 h-full">

                                    {/* Glow */}
                                    <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`}>
                                        <div className={`absolute inset-0 rounded-2xl bg-linear-to-r ${step.gradient} blur-2xl opacity-20`} />
                                    </div>

                                    {/* Number */}
                                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-linear-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
                                        {step.id}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${step.gradient} p-px mb-5`}>
                                        <div className="w-full h-full bg-black rounded-xl flex items-center justify-center">
                                            <Icon className="text-white" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm mb-4">
                                        {step.description}
                                    </p>

                                    {/* Features */}
                                    <div className="flex flex-wrap gap-2">
                                        {step.features.map((f, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-white/5 rounded-full text-gray-300">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom info */}
                <div className=" mt-8 md:mt-12 flex justify-center">
                    <div className="flex gap-4 md:gap-6 text-xs md:text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Real-time AI
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-cyan-400" />
                            Instant formatting
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            ATS optimized
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}