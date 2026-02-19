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

// Helper to extract nested properties
Handlebars.registerHelper('extract', function (obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
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
            personal: resumeData?.personal || {
                full_name: '',
                headline: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                linkedin: '',
                github: '',
                twitter: ''
            },
            summary: resumeData?.summary || { summary: '' },
            experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
            education: Array.isArray(resumeData?.education) ? resumeData.education : [],
            skills: resumeData?.skills || { technical: [], soft: [], languages: [] },
            projects: Array.isArray(resumeData?.projects) ? resumeData.projects : [],
            certifications: Array.isArray(resumeData?.certifications) ? resumeData.certifications : [],
            languages: Array.isArray(resumeData?.languages) ? resumeData.languages : [],
            publications: Array.isArray(resumeData?.publications) ? resumeData.publications : [],
            awards: Array.isArray(resumeData?.awards) ? resumeData.awards : [],
            volunteering: Array.isArray(resumeData?.volunteering) ? resumeData.volunteering : [],
            interests: Array.isArray(resumeData?.interests) ? resumeData.interests : []
        };

        // Add flattened properties for backward compatibility with old templates
        const flattenedData = {
            full_name: preparedData.personal.full_name,
            email: preparedData.personal.email,
            phone: preparedData.personal.phone,
            location: preparedData.personal.location,
            professional_summary: preparedData.summary.summary,
            headline: preparedData.personal.headline,
            website: preparedData.personal.website,
            linkedin: preparedData.personal.linkedin,
            github: preparedData.personal.github,
            twitter: preparedData.personal.twitter,
            ...preparedData
        };

        console.log('Rendering template with data:', flattenedData);

        // Compile and render the template with Handlebars
        const compiledTemplate = Handlebars.compile(template.html);
        const renderedHtml = compiledTemplate(flattenedData);

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
    const [previewKey, setPreviewKey] = useState(0);
    const { template, isLoading, error } = useTemplate(templateId);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Force re-render when resumeData changes to update the preview
    useEffect(() => {
        setPreviewKey(prev => prev + 1);
        console.log('LivePreview data updated:', resumeData);
    }, [resumeData]);

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
            <div id="resume-preview-content" key={previewKey} className="h-screen overflow-y-auto p-1 bg-white rounded-lg shadow-xl">
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