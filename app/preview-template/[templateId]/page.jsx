// app/preview-template/[templateId]/page.jsx
"use client";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Sparkles, Printer, Share2, CheckCircle, X, Eye, Edit, FileText } from "lucide-react";
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useTemplates } from '@/hooks/use-templates';
import { useToast } from '@/hooks/use-toast';

export default function TemplatePreviewPage({ params }) {
    const router = useRouter();
    const { toast } = useToast();
    const { templates, isLoading: templatesLoading } = useTemplates();
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const getTemplateId = async () => {
            const { templateId } = await params;
            if (templates && templates.length > 0) {
                const template = templates.find(t => t.id === templateId);
                setSelectedTemplate(template);
            }
        };

        getTemplateId();
    }, [params, templates]);

    const handleUseTemplate = () => {
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
        router.push(`/editor?template=${selectedTemplate?.id}&data=${encodedData}`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${selectedTemplate?.name} Template`,
                    text: `Check out this ${selectedTemplate?.name} resume template!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            toast({
                title: "✅ Link Copied",
                description: "Template link copied to clipboard",
            });
        }
    };

    if (templatesLoading || !selectedTemplate) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="relative w-12 h-12 border-4 border-gray-700 border-t-cyan-400 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 mt-4">Loading template preview...</p>
                </div>
            </div>
        );
    }

    if (!selectedTemplate) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Template Not Found</h2>
                    <p className="text-gray-400 mb-6">The template you're looking for doesn't exist.</p>
                    <Button
                        onClick={() => router.push('/templates')}
                        className="bg-linear-to-r from-cyan-500 to-blue-600 text-white"
                    >
                        Browse Templates
                    </Button>
                </div>
            </div>
        );
    }

    const gradientClasses = {
        modern: "from-cyan-500 to-blue-600",
        minimal: "from-emerald-500 to-teal-600",
        creative: "from-purple-500 to-pink-600"
    };

    const hoverColor = selectedTemplate.id === 'modern' ? 'cyan' :
        selectedTemplate.id === 'minimal' ? 'emerald' :
            selectedTemplate.id === 'creative' ? 'purple' : 'gray';

    const gradient = gradientClasses[selectedTemplate.id] || "from-gray-500 to-gray-600";

    return (
        <div className="min-h-screen bg-black">
            {/* Success Toast */}
            {showSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    className="fixed top-20 right-4 z-50 bg-green-500/90 backdrop-blur-md text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>Link copied to clipboard!</span>
                </motion.div>
            )}

            {/* Header */}
            <header className="fixed top-20 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleShare}
                                variant="outline"
                                className="border-gray-700 hover:border-cyan-400 text-white"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button
                                onClick={handleUseTemplate}
                                className={`bg-linear-to-r ${gradient} text-white hover:shadow-lg transition-all`}
                            >
                                Use This Template
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-25 pb-12">
                <div className="container mx-auto px-6">
                    {/* Template Info Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs text-cyan-400 font-medium">TEMPLATE PREVIEW</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3">
                            <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                {selectedTemplate.name}
                            </span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            {selectedTemplate.description || `Professional ${selectedTemplate.name.toLowerCase()} template perfect for modern resumes`}
                        </p>

                        {/* Rating and Stats */}
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-1">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-400">4.9 (128 reviews)</span>
                            </div>
                            {selectedTemplate.badge && (
                                <div className={`px-2 py-1 bg-${hoverColor}-500/20 rounded-full text-xs text-${hoverColor}-300`}>
                                    {selectedTemplate.badge}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Preview Area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className={`relative bg-gray-900/30 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl shadow-${hoverColor}-500/10`}>
                            {/* Zoom Overlay */}
                            {isZoomed && (
                                <div
                                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-8 cursor-zoom-out"
                                    onClick={() => setIsZoomed(false)}
                                >
                                    <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto">
                                        <button
                                            onClick={() => setIsZoomed(false)}
                                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                                        >
                                            <X className="w-6 h-6 text-white" />
                                        </button>
                                        {selectedTemplate.previewImage ? (
                                            <Image
                                                src={selectedTemplate.previewImage}
                                                alt={`${selectedTemplate.name} template preview`}
                                                width={50}
                                                height={50}
                                                className="w-full h-auto rounded-lg shadow-2xl"
                                                priority
                                            />
                                        ) : (
                                            <div className="w-full min-h-150 bg-gray-800 rounded-lg flex items-center justify-center">
                                                <FileText className="w-24 h-24 text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Template Image */}
                            <div
                                className="relative cursor-zoom-in"
                                onClick={() => setIsZoomed(true)}
                            >
                                {selectedTemplate.previewImage ? (
                                    <Image
                                        src={selectedTemplate.previewImage}
                                        alt={`${selectedTemplate.name} template preview`}
                                        width={50}
                                        height={50}
                                        className="w-full h-screen px-80"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full min-h-150 bg-linear-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center">
                                        <FileText className="w-32 h-32 text-gray-600 mb-4" />
                                        <p className="text-gray-400">Template Preview Image</p>
                                        <p className="text-gray-500 text-sm mt-2">{selectedTemplate.name} Template</p>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="bg-white/10 backdrop-blur-md rounded-lg px-6 py-3">
                                            <Eye className="w-6 h-6 text-white mx-auto mb-2" />
                                            <p className="text-white font-medium">Click to zoom in</p>
                                            <p className="text-gray-300 text-sm mt-1">View detailed preview</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-12 text-center"
                        >
                            <div className="bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl p-8 border border-gray-800">
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Ready to create your professional resume?
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Get started with the {selectedTemplate.name} template and land your dream job
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={handleUseTemplate}
                                        className={`bg-linear-to-r ${gradient} text-white px-8 py-3 text-lg hover:shadow-lg transition-all`}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Use This Template Now
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Template Info Cards */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-900/20 rounded-lg p-4 text-center border border-gray-800">
                                <div className="text-2xl mb-2">📄</div>
                                <h4 className="text-white font-medium text-sm">ATS-Friendly</h4>
                                <p className="text-gray-500 text-xs mt-1">Optimized for applicant tracking systems</p>
                            </div>
                            <div className="bg-gray-900/20 rounded-lg p-4 text-center border border-gray-800">
                                <div className="text-2xl mb-2">🎨</div>
                                <h4 className="text-white font-medium text-sm">Customizable</h4>
                                <p className="text-gray-500 text-xs mt-1">Fully customizable colors and fonts</p>
                            </div>
                            <div className="bg-gray-900/20 rounded-lg p-4 text-center border border-gray-800">
                                <div className="text-2xl mb-2">⚡</div>
                                <h4 className="text-white font-medium text-sm">Easy to Use</h4>
                                <p className="text-gray-500 text-xs mt-1">Simple drag-and-drop interface</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}