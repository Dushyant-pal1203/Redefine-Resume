// components/EditorSection/LivePreview.jsx
'use client';

import { useState, useEffect } from 'react';
import { useTemplate } from '@/hooks/use-templates';
import Handlebars from 'handlebars';
import { isValidUrl } from '@/lib/utils';

// Add these helpers before registering Handlebars
Handlebars.registerHelper('isFrontend', function (skill) {
    const frontendSkills = ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'React.js', 'Next.js', 'Next', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Vue', 'Vue.js', 'Angular', 'Svelte', 'CSS', 'HTML', 'SASS', 'SCSS', 'Styled Components', 'Material-UI', 'MUI'];
    return frontendSkills.includes(skill);
});

Handlebars.registerHelper('isBackend', function (skill) {
    const backendSkills = ['Node.js', 'Node', 'Express.js', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQL', 'REST APIs', 'REST', 'GraphQL', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Django', 'Flask', 'Spring', 'ASP.NET'];
    return backendSkills.includes(skill);
});

Handlebars.registerHelper('isTool', function (skill) {
    const toolSkills = ['Git', 'GitHub', 'Git & GitHub', 'Vercel', 'Netlify', 'Heroku', 'AWS', 'Docker', 'Kubernetes', 'Figma', 'Adobe XD', 'Sketch', 'Responsive Design', 'Jest', 'Cypress', 'Webpack', 'Vite', 'NPM', 'Yarn'];
    return toolSkills.includes(skill);
});

// Helper to check if value exists and is not empty
Handlebars.registerHelper('ifExists', function (value, options) {
    if (value && (typeof value === 'string' ? value.trim() !== '' : (Array.isArray(value) ? value.length > 0 : true))) {
        return options.fn(this);
    }
    return options.inverse(this);
});

// Helper to format date (YYYY-MM to Month YYYY)
Handlebars.registerHelper('formatDate', function (dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
        return dateString;
    }
});

// Helper to check if URL is valid
Handlebars.registerHelper('isValidUrl', function (url) {
    return isValidUrl(url);
});

// Helper to get display text for URL (uses display name if available, otherwise extracts from URL)
Handlebars.registerHelper('getUrlDisplay', function (url, displayName) {
    if (displayName && displayName.trim()) return displayName;
    if (!url) return '';
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace(/^www\./, '');
    } catch {
        return url;
    }
});

// Helper to extract nested properties safely
Handlebars.registerHelper('extract', function (obj, path) {
    if (!obj) return '';
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
});

// Helper to join array with separator
Handlebars.registerHelper('join', function (array, separator = ', ') {
    if (!Array.isArray(array)) return '';
    return array.join(separator);
});

// Helper to limit array items
Handlebars.registerHelper('limit', function (array, limit) {
    if (!Array.isArray(array)) return [];
    return array.slice(0, limit);
});

// Helper to calculate duration between dates
Handlebars.registerHelper('calculateDuration', function (startDate, endDate, current) {
    if (!startDate) return '';

    const start = new Date(startDate);
    const end = current ? new Date() : (endDate ? new Date(endDate) : new Date());

    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) return `${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`;
    if (remainingMonths === 0) return `${years} yr${years !== 1 ? 's' : ''}`;
    return `${years} yr${years !== 1 ? 's' : ''} ${remainingMonths} mo${remainingMonths !== 1 ? 's' : ''}`;
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
        // Prepare data with proper structure matching ResumeEditor output
        const preparedData = {
            personal: resumeData?.personal || {
                full_name: '',
                job_title: '',
                headline: '',
                email: '',
                phone: '',
                location: '',
                // New URL fields from ResumeEditor
                portfolio_url: '',
                linkedin_url: '',
                github_url: '',
                // Display names
                portfolio_display: '',
                linkedin_display: '',
                github_display: '',
                // Legacy fields for backward compatibility
                website: '',
                linkedin: '',
                github: '',
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

        // Map new URL fields to legacy fields for backward compatibility
        const mappedPersonal = {
            ...preparedData.personal,
            // Map new fields to old field names for templates that use old naming
            website: preparedData.personal.portfolio_url || preparedData.personal.website,
            linkedin: preparedData.personal.linkedin_url || preparedData.personal.linkedin,
            github: preparedData.personal.github_url || preparedData.personal.github,
        };

        // Add flattened properties for backward compatibility with old templates
        const flattenedData = {
            // Personal info
            full_name: mappedPersonal.full_name,
            email: mappedPersonal.email,
            phone: mappedPersonal.phone,
            location: mappedPersonal.location,
            job_title: mappedPersonal.job_title,
            headline: mappedPersonal.headline,
            professional_summary: preparedData.summary.summary,

            // URLs (both new and old naming)
            portfolio_url: mappedPersonal.portfolio_url,
            linkedin_url: mappedPersonal.linkedin_url,
            github_url: mappedPersonal.github_url,
            website: mappedPersonal.website,
            linkedin: mappedPersonal.linkedin,
            github: mappedPersonal.github,

            // Display names
            portfolio_display: mappedPersonal.portfolio_display,
            linkedin_display: mappedPersonal.linkedin_display,
            github_display: mappedPersonal.github_display,

            // Structured data
            personal: mappedPersonal,
            summary: preparedData.summary,
            experience: preparedData.experience,
            education: preparedData.education,
            skills: preparedData.skills,
            projects: preparedData.projects,
            certifications: preparedData.certifications,
            languages: preparedData.languages,
            publications: preparedData.publications,
            awards: preparedData.awards,
            volunteering: preparedData.volunteering,
            interests: preparedData.interests,

            // Helper flags
            hasTechnicalSkills: preparedData.skills.technical && preparedData.skills.technical.length > 0,
            hasSoftSkills: preparedData.skills.soft && preparedData.skills.soft.length > 0,
            hasLanguages: preparedData.skills.languages && preparedData.skills.languages.length > 0,
            hasExperience: preparedData.experience.length > 0,
            hasEducation: preparedData.education.length > 0,
            hasProjects: preparedData.projects.length > 0,
            hasCertifications: preparedData.certifications.length > 0,
            hasPersonalUrl: !!(mappedPersonal.portfolio_url || mappedPersonal.linkedin_url || mappedPersonal.github_url)
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