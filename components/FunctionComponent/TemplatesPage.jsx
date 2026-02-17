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
    Star
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';
import { Button } from "@/components/ui/button";

// Icon mapping component with expanded icon set
const IconComponent = ({ iconName, className }) => {
    const icons = {
        // Original icons
        LaptopMinimalCheck: LaptopMinimalCheck,
        Codesandbox: Codesandbox,
        Component: Component,
        FileText: FileText,

        // Additional icons for auto-generation
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
    // Predefined color combinations for first 3 templates
    const predefinedColors = [
        { from: 'from-cyan-500', to: 'to-blue-600', hover: 'cyan' },        // Modern
        { from: 'from-emerald-500', to: 'to-teal-600', hover: 'emerald' },  // Minimal
        { from: 'from-purple-500', to: 'to-pink-600', hover: 'purple' }     // Creative
    ];

    // If it's one of the first 3, return predefined colors
    if (index < 3) {
        return predefinedColors[index];
    }

    // Generate random colors for templates beyond the first 3
    const colorPairs = [
        { from: 'from-amber-500', to: 'to-orange-600', hover: 'amber' },
        { from: 'from-rose-500', to: 'to-red-600', hover: 'rose' },
        { from: 'from-indigo-500', to: 'to-violet-600', hover: 'indigo' },
        { from: 'from-green-500', to: 'to-lime-600', hover: 'green' },
        { from: 'from-fuchsia-500', to: 'to-pink-600', hover: 'fuchsia' },
        { from: 'from-blue-500', to: 'to-sky-600', hover: 'blue' },
        { from: 'from-orange-500', to: 'to-amber-600', hover: 'orange' },
        { from: 'from-teal-500', to: 'to-cyan-600', hover: 'teal' },
        { from: 'from-violet-500', to: 'to-purple-600', hover: 'violet' },
        { from: 'from-rose-500', to: 'to-pink-600', hover: 'rose' },
        { from: 'from-sky-500', to: 'to-blue-600', hover: 'sky' },
        { from: 'from-lime-500', to: 'to-green-600', hover: 'lime' },
        { from: 'from-yellow-500', to: 'to-amber-600', hover: 'yellow' },
        { from: 'from-pink-500', to: 'to-rose-600', hover: 'pink' }
    ];

    // Use modulo to cycle through color pairs, but offset by 3 to avoid repeating the first three
    const colorIndex = (index - 3) % colorPairs.length;
    return colorPairs[colorIndex];
};

// Icon generation utility
const generateTemplateIcon = (index, templateName = '') => {
    // Predefined icons for first 3 templates (matching their original icons)
    const predefinedIcons = [
        'LaptopMinimalCheck',  // Modern
        'Codesandbox',         // Minimal
        'Component'            // Creative
    ];

    // If it's one of the first 3, return predefined icons
    if (index < 3) {
        return predefinedIcons[index];
    }

    // Icon pool for templates beyond the first 3
    const iconPool = [
        'Palette',
        'Sparkles',
        'Globe',
        'Zap',
        'Shield',
        'Rocket',
        'Brain',
        'Code2',
        'Briefcase',
        'GraduationCap',
        'Award',
        'Target',
        'Lightbulb',
        'HeartHandshake',
        'Gem',
        'Flame',
        'Feather',
        'Star'
    ];

    // You can also use template name to generate consistent icons
    // For example, if template name contains certain keywords
    if (templateName.toLowerCase().includes('tech') || templateName.toLowerCase().includes('code')) {
        return 'Code2';
    } else if (templateName.toLowerCase().includes('creative') || templateName.toLowerCase().includes('design')) {
        return 'Palette';
    } else if (templateName.toLowerCase().includes('executive') || templateName.toLowerCase().includes('business')) {
        return 'Briefcase';
    } else if (templateName.toLowerCase().includes('academic') || templateName.toLowerCase().includes('education')) {
        return 'GraduationCap';
    } else if (templateName.toLowerCase().includes('simple') || templateName.toLowerCase().includes('basic')) {
        return 'Feather';
    }

    // Otherwise, use modulo to cycle through icons
    const iconIndex = (index - 3) % iconPool.length;
    return iconPool[iconIndex];
};

// Generate gradient string for className
const getGradientClass = (colors) => {
    return `bg-linear-to-r ${colors.from} ${colors.to}`;
};

export default function TemplatesPage() {
    const router = useRouter();
    const { templates, isLoading, error } = useTemplates();

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

    const handleGoBack = () => {
        router.push('/#templates');
    };

    // Loading state
    if (isLoading) {
        return (
            <section className="min-h-screen py-4 px-6 bg-black">
                <div className="container mx-auto max-w-7xl">
                    {/* Header with Back Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center justify-between"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            size="lg"
                            className="bg-[#00f3ff1c]! hover:bg-[#00f3ff30]!  border border-cyan-500/50 group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>

                        {/* Void Detected Badge */}
                        <div className="text-lg text-gray-300">
                            <span className="text-cyan-400">✦</span> VOID DETECTED
                        </div>
                    </motion.div>
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                        <p className="text-gray-400 text-lg">Loading templates...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="min-h-screen py-4 px-6 bg-[#00000091]">
                <div className="container mx-auto max-w-7xl">
                    {/* Header with Back Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center justify-between"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            size="lg"
                            className="bg-[#00f3ff1c]! hover:bg-[#00f3ff30]!  border border-cyan-500/50 group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>

                        {/* Void Detected Badge */}
                        <div className="text-lg text-gray-300">
                            <span className="text-cyan-400">✦</span> VOID DETECTED
                        </div>
                    </motion.div>
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        {/* Animated Icon */}
                        <div className="text-6xl mb-6 animate-bounce">
                            🌐
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl font-bold text-white mb-3">
                            Unable to Connect to Server
                        </h2>

                        {/* Subtext */}
                        <p className="text-gray-400 max-w-md mb-6">
                            We're having trouble establishing a connection with the server.
                            Please check your internet connection or try again in a moment.
                        </p>

                        {/* Error Details */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 max-w-lg">
                                {error}
                            </div>
                        )}

                        {/* Retry Button */}
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 
                                   text-white font-semibold rounded-xl 
                                   hover:scale-105 hover:shadow-lg 
                                   transition-all duration-300"
                        >
                            🔄 Reconnect
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <main className="min-h-screen bg-[#00000091]">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative py-4 px-6">
                <div className="container mx-auto max-w-7xl">
                    {/* Header with Back Button */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 flex items-center justify-between"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            size="lg"
                            className="bg-[#00f3ff1c]! hover:bg-[#00f3ff30]!  border border-cyan-500/50 group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>

                        {/* Void Detected Badge */}
                        <div className="text-lg text-gray-300">
                            <span className="text-cyan-400">✦</span> VOID DETECTED
                        </div>
                    </motion.div>

                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-16 text-center"
                    >
                        <h1 className=" md:text-7xl font-bold mb-6">
                            <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                ALL TEMPLATES
                            </span>
                        </h1>
                        <p className=" text-gray-300 max-w-2xl mx-auto">
                            Explore our complete collection of professional resume templates.
                            Each template is crafted to make your career story stand out.
                        </p>

                        {/* Template Count */}
                        <div className="mt-4 text-lg text-gray-400">
                            <span className="text-cyan-400">{templates.length}</span> templates available
                        </div>
                    </motion.div>

                    {/* Templates Grid - All Templates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {templates.map((template, index) => {
                            const colors = generateTemplateColors(index);
                            const gradientClass = getGradientClass(colors);
                            const iconName = generateTemplateIcon(index, template.name);

                            return (
                                <motion.div
                                    key={template.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={`group relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-${colors.hover}-400 transition-all duration-300 hover:shadow-2xl hover:shadow-${colors.hover}-500/10 h-full flex flex-col`}>
                                        {/* Glow Effect */}
                                        <div className={`absolute -inset-0.5 bg-linear-to-r ${colors.from} ${colors.to} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>

                                        {/* Content */}
                                        <div className="relative flex flex-col h-full">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                                                {template.badge && (
                                                    <span className={`px-3 py-1 bg-${colors.hover}-500/20 text-${colors.hover}-300 rounded-full text-sm font-medium`}>
                                                        {template.badge}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Preview Area */}
                                            <div className="mb-6">
                                                <div className={`h-48 ${gradientClass}/20 rounded-xl mb-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                                                    <div className="text-center">
                                                        <div className={`w-16 h-16 mx-auto mb-3 ${gradientClass} rounded-full flex items-center justify-center`}>
                                                            <IconComponent
                                                                iconName={iconName}
                                                                className="w-8 h-8 text-white"
                                                            />
                                                        </div>
                                                        <span className="text-white font-medium">Preview</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-400">
                                                    {template.description}
                                                </p>
                                            </div>

                                            {/* Features List */}
                                            <div className="space-y-3 mb-6 grow">
                                                {template.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center text-gray-300">
                                                        <svg className={`w-5 h-5 text-${colors.hover}-400 mr-2 shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Use Template Button */}
                                            <button
                                                onClick={() => handleUseTemplate(template.id)}
                                                className={`w-full py-3 ${gradientClass} text-white font-semibold rounded-lg hover:from-${colors.hover}-600 hover:to-${colors.hover}-600 transition-all duration-300 transform hover:-translate-y-1 mt-auto`}
                                            >
                                                Use This Template
                                            </button>
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
                        className="mt-16 text-center"
                    >
                        <Button
                            onClick={handleGoBack}
                            variant="outline"
                            size="lg"
                            className="bg-[#00f3ff1c]! hover:bg-[#00f3ff30]! border-gray-800 text-gray-300 hover:text-white hover:border-cyan-400 transition-all duration-300 group"
                        >
                            <ArrowLeft className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform duration-500" />
                            Return to Homepage
                        </Button>

                        {/* Your Artifacts Text */}
                        <div className="mt-8 text-xs text-gray-600">
                            {/* YOUR ARTIFACTS • FORGENE • UPLOAD RESUME */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}