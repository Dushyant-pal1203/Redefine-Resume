// components/FunctionComponent/TemplatesPage.jsx
"use client";
import { motion } from "framer-motion";
import {
    LaptopMinimalCheck,
    Codesandbox,
    Component,
    Loader2,
    FileText,
    ArrowLeft,
    Palette,
    Sparkles,
    Globe,
    Zap,
    Shield,
    Rocket,
    Brain,
    Code2,
    Briefcase,
    GraduationCap,
    Award,
    Target,
    Lightbulb,
    HeartHandshake,
    Gem,
    Flame,
    Feather,
    Star,
    Eye,
    Download,
    CheckCircle,
    TrendingUp
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { useState } from 'react';

// Icon mapping component with expanded icon set
const IconComponent = ({ iconName, className }) => {
    const icons = {
        LaptopMinimalCheck: LaptopMinimalCheck,
        Codesandbox: Codesandbox,
        Component: Component,
        FileText: FileText,
        Palette: Palette,
        Sparkles: Sparkles,
        Globe: Globe,
        Zap: Zap,
        Shield: Shield,
        Rocket: Rocket,
        Brain: Brain,
        Code2: Code2,
        Briefcase: Briefcase,
        GraduationCap: GraduationCap,
        Award: Award,
        Target: Target,
        Lightbulb: Lightbulb,
        HeartHandshake: HeartHandshake,
        Gem: Gem,
        Flame: Flame,
        Feather: Feather,
        Star: Star
    };

    const Icon = icons[iconName] || FileText;
    return <Icon className={className} />;
};

// Color generation utility
const generateTemplateColors = (index) => {
    const predefinedColors = [
        { from: 'from-cyan-500', to: 'to-blue-600', hover: 'cyan', glow: 'cyan-500' },
        { from: 'from-emerald-500', to: 'to-teal-600', hover: 'emerald', glow: 'emerald-500' },
        { from: 'from-purple-500', to: 'to-pink-600', hover: 'purple', glow: 'purple-500' },
        { from: 'from-amber-500', to: 'to-orange-600', hover: 'amber', glow: 'amber-500' },
        { from: 'from-rose-500', to: 'to-red-600', hover: 'rose', glow: 'rose-500' },
        { from: 'from-indigo-500', to: 'to-violet-600', hover: 'indigo', glow: 'indigo-500' }
    ];

    const colorIndex = index % predefinedColors.length;
    return predefinedColors[colorIndex];
};

// Icon generation utility
const generateTemplateIcon = (index, templateName = '') => {
    const predefinedIcons = ['LaptopMinimalCheck', 'Codesandbox', 'Component', 'Palette', 'Sparkles', 'Globe'];

    if (templateName.toLowerCase().includes('tech') || templateName.toLowerCase().includes('code')) {
        return 'Code2';
    } else if (templateName.toLowerCase().includes('creative') || templateName.toLowerCase().includes('design')) {
        return 'Palette';
    } else if (templateName.toLowerCase().includes('executive') || templateName.toLowerCase().includes('business')) {
        return 'Briefcase';
    }

    const iconIndex = index % predefinedIcons.length;
    return predefinedIcons[iconIndex];
};

// Generate gradient string for className
const getGradientClass = (colors) => {
    return `bg-linear-to-r ${colors.from} ${colors.to}`;
};

export default function TemplatesPage() {
    const router = useRouter();
    const { templates, isLoading, error } = useTemplates();
    const [hoveredTemplate, setHoveredTemplate] = useState(null);
    const [imageErrors, setImageErrors] = useState({});

    const handleUseTemplate = (templateId) => {
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
        router.push(`/editor?template=${templateId}&data=${encodedData}`);
    };

    const handlePreviewTemplate = (templateId) => {
        router.push(`/preview-template/${templateId}`);
    };

    const handleGoBack = () => {
        router.push('/#templates');
    };

    const handleImageError = (templateId) => {
        setImageErrors(prev => ({ ...prev, [templateId]: true }));
    };

    // Loading state
    if (isLoading) {
        return (
            <section className="min-h-screen py-8 px-6 bg-[#0000005f]">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center justify-between flex-wrap gap-4"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            className="bg-white/5 hover:bg-white/10 border border-white/10 group flex items-center text-gray-300 hover:text-white transition-all duration-300 rounded-xl px-6 py-5"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                            <span className="text-sm text-cyan-400 font-medium">LOADING TEMPLATES</span>
                        </div>
                    </motion.div>

                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                            <Loader2 className="relative w-16 h-16 text-cyan-400 animate-spin mb-6" />
                        </div>
                        <p className="text-gray-400 text-lg">Loading professional templates...</p>
                        <p className="text-gray-500 text-sm mt-2">Preparing your gallery</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="min-h-screen py-8 px-6 bg-[#0000005f]">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center justify-between flex-wrap gap-4"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            className="bg-white/5 hover:bg-white/10 border border-white/10 group flex items-center text-gray-300 hover:text-white transition-all duration-300 rounded-xl px-6 py-5"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
                            <span className="text-sm text-red-400 font-medium">CONNECTION ERROR</span>
                        </div>
                    </motion.div>

                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <div className="text-8xl mb-6 animate-bounce">🌐</div>
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Unable to Connect to Server
                        </h2>
                        <p className="text-gray-400 max-w-md mb-6">
                            We're having trouble establishing a connection with the server.
                            Please check your internet connection or try again in a moment.
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
                            🔄 Reconnect
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <main className="min-h-screen bg-[#0000005f]">
            {/* Animated Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-blue-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative py-8 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center justify-between flex-wrap gap-4"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 group flex items-center text-gray-300 hover:text-white transition-all duration-300 rounded-xl px-6 py-5"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>

                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm text-cyan-400 font-medium">TEMPLATE GALLERY</span>
                        </div>
                    </motion.div>

                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-16 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                            <Star className="w-4 h-4 text-amber-400" />
                            <span className="text-xs text-amber-400 font-medium">PROFESSIONAL COLLECTION</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="bg-linear-to-r from-amber-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                                All Templates
                            </span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-6xl mx-auto">
                            Explore our complete collection of professionally crafted resume templates.
                            Each design is optimized to make your career story shine.
                        </p>

                        {/* Stats */}
                        <div className="mt-6 flex items-center justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <Gem className="w-4 h-4 text-cyan-400" />
                                </div>
                                <span className="text-gray-300">
                                    <span className="text-cyan-400 font-bold">{templates.length}</span> Templates
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-purple-400" />
                                </div>
                                <span className="text-gray-300">
                                    <span className="text-purple-400 font-bold">ATS-Friendly</span> Designs
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, index) => {
                            const colors = generateTemplateColors(index);
                            const gradientClass = getGradientClass(colors);
                            const iconName = generateTemplateIcon(index, template.name);
                            const hasImageError = imageErrors[template.id];
                            const hasPreviewImage = template.previewImage && !hasImageError;

                            return (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    onHoverStart={() => setHoveredTemplate(template.id)}
                                    onHoverEnd={() => setHoveredTemplate(null)}
                                    className="relative"
                                >
                                    <div className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 h-full flex flex-col">
                                        {/* Animated Glow Effect */}
                                        <div className={`absolute -inset-0.5 bg-linear-to-r ${colors.from} ${colors.to} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 pointer-events-none`}></div>

                                        {/* Preview Image Area */}
                                        <div className="relative h-56 overflow-hidden bg-linear-to-br from-gray-800 to-gray-900">
                                            {hasPreviewImage ? (
                                                <>
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={template.previewImage}
                                                            alt={`${template.name} template preview`}
                                                            fill
                                                            className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                                            onError={() => handleImageError(template.id)}
                                                        />
                                                        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                                                    </div>
                                                    {/* Hover Overlay - Fixed click issues */}
                                                    <div
                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 pointer-events-none group-hover:pointer-events-auto"
                                                        style={{ zIndex: 10 }}
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePreviewTemplate(template.id);
                                                            }}
                                                            className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-all transform hover:scale-105 cursor-pointer"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Quick Preview
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                // Fallback Preview
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="text-center transform transition-transform duration-300 group-hover:scale-105">
                                                        <div className={`w-20 h-20 mx-auto mb-4 ${gradientClass} rounded-2xl flex items-center justify-center shadow-xl`}>
                                                            <IconComponent
                                                                iconName={iconName}
                                                                className="w-10 h-10 text-white"
                                                            />
                                                        </div>
                                                        <p className="text-gray-400 text-sm">Template Preview</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Badge */}
                                            {template.badge && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className={`px-3 py-1 bg-${colors.hover}-500/20 backdrop-blur-sm text-${colors.hover}-300 rounded-full text-xs font-medium border border-${colors.hover}-500/30`}>
                                                        {template.badge}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Popular Badge for first 3 */}
                                            {index < 3 && (
                                                <div className="absolute top-4 left-4 z-10">
                                                    <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-sm text-amber-300 rounded-full text-xs font-medium flex items-center gap-1 border border-amber-500/30">
                                                        <Flame className="w-3 h-3" />
                                                        Popular
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1 relative z-10">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-amber-300 group-hover:to-cyan-200 group-hover:bg-clip-text transition-all duration-300">
                                                    {template.name}
                                                </h3>
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    <span className="text-sm text-gray-400">4.9</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-400 mb-4 line-clamp-2">
                                                {template.description || `Professional ${template.name.toLowerCase()} template designed for modern resumes and career success.`}
                                            </p>

                                            {/* Features */}
                                            <div className="space-y-2 mb-6 flex-1">
                                                {template.features?.slice(0, 3).map((feature, i) => (
                                                    <div key={i} className="flex items-center text-sm text-gray-300">
                                                        <CheckCircle className={`w-4 h-4 text-${colors.hover}-400 mr-2 shrink-0`} />
                                                        <span className="line-clamp-1">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 mt-auto">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePreviewTemplate(template.id);
                                                    }}
                                                    className="flex-1 py-2.5 bg-gray-800/50 hover:bg-gray-700/50 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 cursor-pointer relative z-20"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUseTemplate(template.id);
                                                    }}
                                                    className={`flex-1 py-2.5 ${gradientClass} text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer relative z-20`}
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Use
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom Navigation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 text-center"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            className="bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:border-cyan-400 transition-all duration-300 group rounded-xl px-8 py-6 text-lg"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Return to Homepage
                        </Button>

                        {/* Footer Note */}
                        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-300">
                            <span>✨ ATS-Friendly</span>
                            <span>•</span>
                            <span>📄 Instant PDF Export</span>
                            <span>•</span>
                            <span>🎨 Fully Customizable</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}