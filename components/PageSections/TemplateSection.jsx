"use client";
import { motion } from "framer-motion";
import { LaptopMinimalCheck, Codesandbox, Component } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function TemplateSection() {
    const router = useRouter();

    const handleUseTemplate = (templateName) => {
        // You can pass empty data or load sample data for each template
        const sampleData = {
            full_name: '',
            email: '',
            phone: '',
            location: '',
            professional_summary: 'Experienced Full Stack Developer with expertise in modern web technologies including React, Node.js, and MongoDB. Passionate about creating efficient, scalable web applications.',
            experience: [],
            education: [],
            skills: [],
            projects: []
        };

        const encodedData = encodeURIComponent(JSON.stringify(sampleData));
        router.push(`/editor?template=${templateName}&data=${encodedData}`);
    };

    return (
        <section id="templates" className="py-20 px-6 bg-no-repeat bg-center bg-contain">
            <div className="container mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6">
                        <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                            TEMPLATE
                        </span>
                        <span className="text-white ml-4">GALAXY</span>
                    </h2>
                    <p className="text-xl text-gray-300">
                        Choose a template or upload your PDF - we'll handle the rest for you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Modern Template */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className="group relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white">Modern</h3>
                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">
                                        Popular
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <div className="h-48 bg-linear-to-r from-cyan-500/20 to-blue-500/20 rounded-xl mb-4 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <LaptopMinimalCheck className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-white font-medium">Preview</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400">
                                        Clean, professional design with modern linears and sleek components. Perfect for corporate portfolios.
                                    </p>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {['linear color schemes', 'Interactive animations', 'Dark mode optimized'].map((feature, i) => (
                                        <div key={i} className="flex items-center text-gray-300">
                                            <svg className="w-5 h-5 text-cyan-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleUseTemplate('modern')}
                                    className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Use This Template
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Minimal Template */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <div className="group relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-emerald-400 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-emerald-400 to-green-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white">Minimal</h3>
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium">
                                        Lightweight
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <div className="h-48 bg-linear-to-r from-emerald-400/10 to-green-400/10 rounded-xl mb-4 flex items-center justify-center border border-emerald-500/20">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-3 border-2 border-emerald-400 rounded-full flex items-center justify-center">
                                                <Codesandbox className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-white font-medium">Preview</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400">
                                        Simple, elegant design with clean typography. Focus on content with minimal distractions and fast loading.
                                    </p>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {['Clean typography', 'Fast loading', 'Mobile-first design'].map((feature, i) => (
                                        <div key={i} className="flex items-center text-gray-300">
                                            <svg className="w-5 h-5 text-emerald-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleUseTemplate('minimal')}
                                    className="w-full py-3 bg-linear-to-r from-emerald-500 to-green-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Use This Template
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Creative Template */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        <div className="group relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-white">Creative</h3>
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                                        Artistic
                                    </span>
                                </div>
                                <div className="mb-6">
                                    <div className="h-48 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                                                <Component className="w-8 h-8 text-white" />
                                            </div>
                                            <span className="text-white font-medium">Preview</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400">
                                        Bold, artistic design with unique animations and layouts. Suitable for designers and artists to make them stand out.
                                    </p>
                                </div>
                                <div className="space-y-3 mb-6">
                                    {['Unique animations', 'Custom illustrations', 'Artistic layouts'].map((feature, i) => (
                                        <div key={i} className="flex items-center text-gray-300">
                                            <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleUseTemplate('creative')}
                                    className="w-full py-3 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    Use This Template
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}