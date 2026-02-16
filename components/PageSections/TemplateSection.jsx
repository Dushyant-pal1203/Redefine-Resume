"use client";
import { motion } from "framer-motion";
import { LaptopMinimalCheck, Codesandbox, Component, Loader2, FileText } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useTemplates } from '@/hooks/use-templates';

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
            professional_summary: 'Experienced Full Stack Developer with expertise in modern web technologies including React, Node.js, and MongoDB. Passionate about creating efficient, scalable web applications.',
            experience: [],
            education: [],
            skills: [],
            projects: []
        };

        const encodedData = encodeURIComponent(JSON.stringify(sampleData));
        router.push(`/editor?template=${templateName}&data=${encodedData}`);
    };

    // Loading state
    if (isLoading) {
        return (
            <section id="templates" className="py-20 px-6">
                <div className="container mx-auto max-w-7xl">
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
                    <div className="flex flex-col items-center justify-center min-h-100">
                        <div className="text-red-400 text-xl mb-4">❌ Failed to load templates</div>
                        <p className="text-gray-400">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

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
                    {templates.map((template, index) => {
                        const gradientColors = template.color.split(' ');
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