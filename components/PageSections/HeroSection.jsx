"use client";

import PdfUpload from "@/components/FunctionComponent/PdfUpload";
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="relative pt-20 pb-32 px-6 m-0 bg-[#00000060]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center text-center sm:text-left gap-12">
                <div>
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-linear-to-r from-blue-300/10 to-rose-500/10 backdrop-blur-sm border border-yellow-500/20">
                        <div className="w-2 h-2 rounded-full bg-linear-to-r from-purple-600 to-blue-400 animate-pulse" />
                        <span className="text-sm font-medium bg-linear-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                            NEXT-GEN RESUME PLATFORM
                        </span>
                    </div>
                    <div className="container mx-auto max-w-6xl">
                        <div className="space-y-8">
                            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                                <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-cyan-400 to-purple-400">
                                    REDEFINED
                                </span>
                                <span className="block"></span>
                                <span className="bg-linear-to-r from-purple-500 via-pink-300 to-blue-500 bg-clip-text text-transparent">DOCUMENT</span>

                            </h1>

                            <p className="text-xl text-gray-300 max-w-3xl mx-auto ">
                                Upload your PDF resume or start from scratch. Our AI instantly parses and formats your data.
                            </p>

                            <p className="text-cyan-300 text-lg font-semibold">
                                Quantum parsing meets cosmic design.
                            </p>

                            {/* Button Section */}
                            <PdfUpload />
                        </div>
                    </div>
                </div>
                <StatsOrb />
            </div>

            {/* Background effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-100 h-100 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-100 h-100 bg-cyan-500/20 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
}
function StatsOrb() {
    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="relative mx-auto mt-16 w-64 h-64"
        >
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-purple-600/30 to-pink-500/30 backdrop-blur-sm border border-purple-500/50 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full bg-linear-to-r from-blue-600/20 to-cyan-400/20 backdrop-blur-sm border border-blue-500/30 animate-spin-slow [animation-direction:reverse]" />

            <div className="absolute inset-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">
                        99.5%
                    </div>
                    <div className="text-sm text-slate-200 mt-2">ATS SUCCESS RATE</div>
                </div>
            </div>
        </motion.div>
    );
}