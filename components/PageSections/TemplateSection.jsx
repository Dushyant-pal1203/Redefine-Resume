"use client";
import { motion } from "framer-motion";
import { LaptopMinimalCheck, Codesandbox, Component, Loader2, FileText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';
import { Button } from "@/components/ui/button";

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

    // Loading state
    if (isLoading) {
        return (
            <section id="templates" className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center md:text-left"
                        >
                            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                    TEMPLATES
                                </span>
                                <span className="text-white ml-4">GALAXY</span>
                            </h2>
                            <p className="text-xl text-gray-300">
                                Choose a template or upload your PDF - we'll handle the rest for you.
                            </p>
                        </motion.div>

                        {/* View All Templates Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center"
                        >
                            <div className="relative group">
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-linear-to-r from-amber-300 to-cyan-200 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>

                                {/* Button */}
                                <Button
                                    onClick={handleViewAllTemplates}
                                    className="bg-transparent hover:bg-[#05232588]! relative px-8 py-6 text-lg border border-gray-800 hover:border-cyan-400 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
                                >

                                    {/* Main button content */}
                                    <div className="flex items-center gap-3">
                                        <span>TEMPLATES</span>
                                        <span className="text-cyan-400">✦</span>
                                        <span>GALLERY</span>
                                    </div>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                    <div className="flex flex-col items-center justify-center min-h-100">
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
            <section id="templates" className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex items-center justify-between mb-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center md:text-left"
                        >
                            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                                <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                    TEMPLATES
                                </span>
                                <span className="text-white ml-4">GALAXY</span>
                            </h2>
                            <p className="text-xl text-gray-300">
                                Choose a template or upload your PDF - we'll handle the rest for you.
                            </p>
                        </motion.div>

                        {/* View All Templates Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex justify-center"
                        >
                            <div className="relative group">
                                {/* Glow effect */}
                                <div className="absolute -inset-1 bg-linear-to-r from-amber-300 to-cyan-200 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>

                                {/* Button */}
                                <Button
                                    onClick={handleViewAllTemplates}
                                    className="bg-transparent hover:bg-[#05232588]! relative px-8 py-6 text-lg border border-gray-800 hover:border-cyan-400 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
                                >

                                    {/* Main button content */}
                                    <div className="flex items-center gap-3">
                                        <span>TEMPLATES</span>
                                        <span className="text-cyan-400">✦</span>
                                        <span>GALLERY</span>
                                    </div>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
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
                            We’re having trouble establishing a connection with the server.
                            Please check your internet connection or try again in a moment.
                        </p>

                        {/* Error Details (Optional Debug Info) */}
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

    // Take only first 3 templates
    const displayedTemplates = templates.slice(0, 3);

    return (
        <section id="templates" className="py-20 px-6 bg-no-repeat bg-center bg-contain">
            <div className="container mx-auto max-w-7xl">
                {/* Header and View All Button */}
                <div className="flex items-center justify-between mb-10 ">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            <span className="bg-linear-to-r from-amber-300 to-cyan-200 bg-clip-text text-transparent">
                                TEMPLATES
                            </span>
                            <span className="text-white ml-4">GALAXY</span>
                        </h2>
                        <p className="text-xl text-gray-300">
                            Choose a template or upload your PDF - we'll handle the rest for you.
                        </p>
                    </motion.div>

                    {/* View All Templates Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-1 bg-linear-to-r from-amber-300 to-cyan-200 rounded-xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>

                            {/* Button */}
                            <Button
                                onClick={handleViewAllTemplates}
                                className="bg-transparent hover:bg-[#05232588]! relative px-8 py-6 text-lg border border-gray-800 hover:border-cyan-400 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 transform hover:-translate-y-1"
                            >

                                {/* Main button content */}
                                <div className="flex items-center gap-3">
                                    <span>TEMPLATES</span>
                                    <span className="text-cyan-400">✦</span>
                                    <span>GALLERY</span>
                                </div>
                            </Button>
                        </div>
                    </motion.div>
                </div>
                {/* Templates Section - Displaying templates in a grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {displayedTemplates.map((template, index) => {
                        const hoverColor = template.id === 'modern' ? 'cyan' :
                            template.id === 'minimal' ? 'emerald' :
                                template.id === 'creative' ? 'purple' : 'gray';

                        return (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className={`group relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-${hoverColor}-400 transition-all duration-300 hover:shadow-2xl hover:shadow-${hoverColor}-500/10`}>
                                    <div className={`absolute -inset-0.5 bg-linear-to-r ${template.color} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-white">{template.name}</h3>
                                            {template.badge && (
                                                <span className={`px-3 py-1 bg-${hoverColor}-500/20 text-${hoverColor}-300 rounded-full text-sm font-medium`}>
                                                    {template.badge}
                                                </span>
                                            )}
                                        </div>
                                        <div className="mb-6">
                                            <div className={`h-48 bg-linear-to-r ${template.color.replace('from-', 'from-').replace('to-', 'to-')}/20 rounded-xl mb-4 flex items-center justify-center`}>
                                                <div className="text-center">
                                                    <div className={`w-16 h-16 mx-auto mb-3 bg-linear-to-r ${template.color} rounded-full flex items-center justify-center`}>
                                                        <IconComponent
                                                            iconName={template.icon}
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
                                        <div className="space-y-3 mb-6">
                                            {template.features.map((feature, i) => (
                                                <div key={i} className="flex items-center text-gray-300">
                                                    <svg className={`w-5 h-5 text-${hoverColor}-400 mr-2`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleUseTemplate(template.id)}
                                            className={`w-full py-3 bg-linear-to-r ${template.color} text-white font-semibold rounded-lg hover:from-${hoverColor}-600 hover:to-${hoverColor}-600 transition-all duration-300 transform hover:-translate-y-1`}
                                        >
                                            Use This Template
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}