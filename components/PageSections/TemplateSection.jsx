// components/PageSections/TemplateSection.jsx
"use client";
import { motion } from "framer-motion";
import {
    LaptopMinimalCheck,
    Codesandbox,
    Component,
    Loader2,
    FileText,
    ArrowRight,
    Star,
    Eye,
    Sparkles
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useState } from 'react';

// Icon mapping component
const IconComponent = ({ iconName, className }) => {
    const icons = {
        LaptopMinimalCheck: LaptopMinimalCheck,
        Codesandbox: Codesandbox,
        Component: Component,
        FileText: FileText
    };

    const Icon = icons[iconName] || FileText;
    return <Icon className={className} />;
};

export default function TemplateSection() {
    const router = useRouter();
    const { templates, isLoading, error } = useTemplates();
    const [imageErrors, setImageErrors] = useState({});

    const handleUseTemplate = (templateName) => {
        const sampleData = {
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

        const encodedData = encodeURIComponent(JSON.stringify(sampleData));
        router.push(`/editor?template=${templateName}&data=${encodedData}`);
    };

    const handleViewAllTemplates = () => {
        router.push('/templates');
    };

    const handlePreviewTemplate = (templateId) => {
        router.push(`/preview-template/${templateId}`);
    };

    const handleImageError = (templateId) => {
        setImageErrors(prev => ({ ...prev, [templateId]: true }));
    };

    // Loading state
    if (isLoading) {
        return (
            <section id="templates" className="py-20 px-6 bg-[#0000005f]">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center md:text-left"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                <span className="text-xs text-cyan-400 font-medium">PROFESSIONAL TEMPLATES</span>
                            </div>
                            <h2 className="text-5xl md:text-6xl font-bold mb-4">
                                <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                    Template
                                </span>
                                <span className="text-white ml-4">Gallery</span>
                            </h2>
                            <p className="text-xl text-gray-300 max-w-2xl">
                                Choose from our collection of professionally designed templates
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                onClick={handleViewAllTemplates}
                                className="group bg-transparent hover:bg-white/5 relative px-8 py-6 text-lg border border-gray-700 hover:border-cyan-400 text-white font-semibold rounded-xl transition-all duration-300"
                            >
                                <span>View All Templates</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-100">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                            <Loader2 className="relative w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        </div>
                        <p className="text-gray-400 text-lg">Loading professional templates...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section id="templates" className="py-20 px-6 bg-[#0000005f]">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                            <span className="text-xs text-red-400 font-medium">CONNECTION ERROR</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold mb-4">
                            <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                Unable to Load
                            </span>
                            <span className="text-white ml-4">Templates</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            We're having trouble connecting to our template gallery
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-100 text-center">
                        <div className="text-8xl mb-6 animate-bounce">🌐</div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            Connection Failed
                        </h3>
                        <p className="text-gray-400 max-w-md mb-6">
                            Please check your internet connection and try again
                        </p>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 max-w-lg">
                                {error}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                            🔄 Retry Connection
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Take only first 3 templates
    const displayedTemplates = templates.slice(0, 3);

    return (
        <section id="templates" className="py-20 px-6 bg-[#0000005f] relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-cyan-400 font-medium">PROFESSIONAL TEMPLATES</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold mb-4">
                            <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                Template
                            </span>
                            <span className="text-white"> Gallery</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl">
                            Choose from our collection of professionally designed templates and create your perfect resume in minutes
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-amber-300 to-cyan-200 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                            <Button
                                onClick={handleViewAllTemplates}
                                className="relative bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50 px-8 py-6 text-lg border border-gray-700 group-hover:border-cyan-400 text-white font-semibold rounded-xl transition-all duration-300"
                            >
                                <span>Browse All Templates</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {displayedTemplates.map((template, index) => {
                        const gradientColors = {
                            modern: "from-cyan-500 to-blue-600",
                            minimal: "from-emerald-500 to-teal-600",
                            creative: "from-purple-500 to-pink-600"
                        };
                        const hoverColor = template.id === 'modern' ? 'cyan' :
                            template.id === 'minimal' ? 'emerald' :
                                template.id === 'professional' ? 'purple' : 'white';
                        const gradient = gradientColors[template.id] || "from-gray-500 to-gray-600";
                        const hasImageError = imageErrors[template.id];
                        const hasPreviewImage = template.previewImage && !hasImageError;

                        return (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8 }}
                                className="group"
                            >
                                <div className={`relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-${hoverColor}-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-${hoverColor}-500/20`}>
                                    {/* Template Preview Image Area */}
                                    <div className="relative h-64 overflow-hidden bg-linear-to-br from-gray-800 to-gray-900">
                                        {/* Use template image if available, otherwise show preview */}
                                        {hasPreviewImage ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={template.previewImage}
                                                    alt={`${template.name} template preview`}
                                                    fill
                                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                                    onError={() => handleImageError(template.id)}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <button
                                                        onClick={() => handlePreviewTemplate(template.id)}
                                                        className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-all"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Preview Template
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // Fallback preview if no image
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <div className={`w-20 h-20 mx-auto mb-4 bg-linear-to-r ${gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                                                        <IconComponent
                                                            iconName={template.icon}
                                                            className="w-10 h-10 text-white"
                                                        />
                                                    </div>
                                                    <p className="text-gray-400 text-sm">Template Preview</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Badge */}
                                        {template.badge && (
                                            <div className="absolute top-4 right-4">
                                                <span className={`px-3 py-1 bg-${hoverColor}-500/20 backdrop-blur-sm text-black rounded-full text-xs font-medium border border-${hoverColor}-500/30`}>
                                                    {template.badge}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Template Info */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                <span className="text-sm text-gray-400">4.9</span>
                                            </div>
                                        </div>

                                        <p className="text-gray-400 mb-4 line-clamp-2">
                                            {template.description || `Professional ${template.name.toLowerCase()} template perfect for modern resumes`}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2 mb-6">
                                            {template.features?.slice(0, 3).map((feature, i) => (
                                                <div key={i} className="flex items-center text-sm text-gray-300">
                                                    <svg className={`w-4 h-4 text-${hoverColor}-400 mr-2 shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="line-clamp-1">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handlePreviewTemplate(template.id)}
                                                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => handleUseTemplate(template.id)}
                                                className={`flex-1 py-2.5 bg-linear-to-r ${gradient} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5`}
                                            >
                                                Use Template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <span className="text-gray-400">✨</span>
                        <span className="text-sm text-gray-300">All templates are ATS-friendly and fully customizable</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}