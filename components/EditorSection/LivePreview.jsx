// components/EditorSection/LivePreview.jsx
'use client';

import { useState, useEffect } from 'react';
import { useTemplate } from '@/hooks/use-templates';
import Handlebars from 'handlebars';

// Add these helpers before registering Handlebars
Handlebars.registerHelper('isFrontend', function (skill) {
    const frontendSkills = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Next.js', 'Tailwind CSS', 'Bootstrap'];
    return frontendSkills.includes(skill);
});

Handlebars.registerHelper('isBackend', function (skill) {
    const backendSkills = ['Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'REST APIs'];
    return backendSkills.includes(skill);
});

Handlebars.registerHelper('isTool', function (skill) {
    const toolSkills = ['Git & GitHub', 'Vercel', 'Figma', 'Responsive Design'];
    return toolSkills.includes(skill);
});

// Template renderer component with Handlebars
function TemplateRenderer({ template, resumeData }) {
    if (!template || !template.html) {
        return (
            <div className="text-center text-red-600 p-4">
                Template content not available
            </div>
        );
    }

    try {
        // Prepare data with defaults to avoid undefined errors
        const preparedData = {
            full_name: resumeData?.full_name || '',
            email: resumeData?.email || '',
            phone: resumeData?.phone || '',
            location: resumeData?.location || '',
            professional_summary: resumeData?.professional_summary || '',
            experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
            education: Array.isArray(resumeData?.education) ? resumeData.education : [],
            skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
            projects: Array.isArray(resumeData?.projects) ? resumeData.projects : []
        };

        console.log('Rendering template with data:', preparedData);

        // Compile and render the template with Handlebars
        const compiledTemplate = Handlebars.compile(template.html);
        const renderedHtml = compiledTemplate(preparedData);

        return (
            <div
                className="template-content"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
        );
    } catch (error) {
        console.error('Template rendering error:', error);
        return (
            <div className="text-center text-red-600 p-4">
                Error rendering template: {error.message}
                <pre className="mt-2 text-xs text-left bg-red-50 p-2 rounded overflow-auto">
                    {error.stack}
                </pre>
            </div>
        );
    }
}

export default function LivePreview({ resumeData, template: templateId }) {
    const [isClient, setIsClient] = useState(false);
    const { template, isLoading, error } = useTemplate(templateId);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Add debug logging
    useEffect(() => {
        console.log('LivePreview received resumeData:', resumeData);
        console.log('Template loaded:', template);
    }, [resumeData, template]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="text-center text-red-600 p-4">
                Failed to load template: {error || 'Template not found'}
            </div>
        );
    }

    return (
        <>
            {/* Regular preview with all styling */}
            <div id="resume-preview-content" className="h-screen overflow-y-auto p-6 bg-white rounded-lg shadow-xl">
                <div className="max-w-4xl mx-auto">
                    <TemplateRenderer template={template} resumeData={resumeData} />

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-gray-600 text-sm">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <p className="font-medium">Live Preview • Template:
                                <span className="text-blue-600 ml-1 capitalize">
                                    {templateId}
                                </span>
                            </p>
                        </div>
                        <p className="text-gray-500">Updates in real-time as you edit</p>
                    </div>
                </div>
            </div>

            {/* Hidden PDF-optimized version - only rendered on client */}
            {isClient && (
                <div id="resume-pdf-content" style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: '-9999px',
                    width: '816px',
                    backgroundColor: '#ffffff',
                    padding: '40px'
                }}>
                    <TemplateRenderer template={template} resumeData={resumeData} />
                </div>
            )}
        </>
    );
}