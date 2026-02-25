'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DownloadPDF from '@/components/FunctionComponent/DownloadPDF';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Edit, Loader2, Printer, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useTemplates } from '@/hooks/use-templates';
import Handlebars from 'handlebars';
import { convertToFlexibleFormat } from '@/lib/resume-schema';

// Enhanced print styles for better print output
const printStyles = `
  @media print {
    /* Hide all UI elements */
    body * {
      visibility: hidden !important;
    }
    
    /* Show only the resume content */
    #resume-preview-content, 
    #resume-preview-content * {
      visibility: visible !important;
    }
    
    #resume-preview-content {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
      box-shadow: none !important;
    }
    
    /* Ensure proper page breaks */
    .template-content {
      page-break-inside: avoid;
    }
    
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }
    
    p, .section {
      page-break-inside: avoid;
    }
    
    /* Page margins */
    @page {
      size: letter;
      margin: 0.5in !important;
    }
    
    /* Remove background colors for better printing */
    .bg-gray-50, .bg-gray-100, .bg-blue-50 {
      background: white !important;
    }
    
    /* Ensure text is black for better contrast */
    .text-gray-600, .text-gray-700, .text-gray-800 {
      color: black !important;
    }
    
    /* Hide any interactive elements */
    button, .no-print {
      display: none !important;
    }
  }
`;

// Print preview modal styles
const printPreviewStyles = `
  .print-preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  
  .print-preview-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 900px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .print-preview-header {
    padding: 16px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
  }
  
  .print-preview-body {
    flex: 1;
    overflow: auto;
    padding: 24px;
    background: #f3f4f6;
    display: flex;
    justify-content: center;
  }
  
  .print-preview-scale {
    transform: scale(0.8);
    transform-origin: top center;
    background: white;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }
`;

// Template Icon Mapping
const getTemplateIcon = (templateId) => {
    const icons = {
        modern: '✨',
        minimal: '🎯',
        creative: '🎨',
        professional: '📋',
        executive: '👔'
    };
    return icons[templateId] || '📄';
};

// Register Handlebars helpers (same as before)
if (typeof window !== 'undefined') {
    Handlebars.registerHelper('hasItems', function (array, options) {
        if (array && Array.isArray(array) && array.length > 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('ifLast', function (index, array, options) {
        if (index === array.length - 1) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('formatDate', function (date) {
        if (!date) return 'Present';
        try {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
            });
        } catch {
            return date;
        }
    });

    Handlebars.registerHelper('ifExists', function (value, options) {
        if (value && value.toString().trim() !== '') {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    Handlebars.registerHelper('join', function (array, separator) {
        if (Array.isArray(array)) {
            return array.join(separator || ', ');
        }
        return array || '';
    });

    Handlebars.registerHelper('eq', function (a, b) {
        return a === b;
    });

    Handlebars.registerHelper('or', function (a, b) {
        return a || b;
    });
}

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [resumeData, setResumeData] = useState(null);
    const [flexibleData, setFlexibleData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renderKey, setRenderKey] = useState(0);
    const [isContentReady, setIsContentReady] = useState(false);
    const [templateHtml, setTemplateHtml] = useState(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const resumeId = params.resumeId;
    const downloadRef = useRef();
    const contentRef = useRef(null);
    const printPreviewRef = useRef(null);
    const { templates, isLoading: templatesLoading, getTemplateById } = useTemplates();
    const [templateDetails, setTemplateDetails] = useState(null);
    const [templateLoading, setTemplateLoading] = useState(false);

    // Add print styles to document
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = printStyles;
        style.id = 'print-styles';
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById('print-styles');
            if (existingStyle) {
                document.head.removeChild(existingStyle);
            }
        };
    }, []);

    // Add print preview styles
    useEffect(() => {
        if (showPrintPreview) {
            const style = document.createElement('style');
            style.innerHTML = printPreviewStyles;
            style.id = 'print-preview-styles';
            document.head.appendChild(style);

            return () => {
                const existingStyle = document.getElementById('print-preview-styles');
                if (existingStyle) {
                    document.head.removeChild(existingStyle);
                }
            };
        }
    }, [showPrintPreview]);

    // Load resume data from localStorage and convert to flexible format
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`resume_${resumeId}`);

            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setResumeData(parsed);

                    // Convert to flexible format using the schema function
                    const flexible = convertToFlexibleFormat(parsed);
                    setFlexibleData(flexible);

                    console.log('Converted to flexible format:', flexible);
                } catch (error) {
                    console.error('Error parsing resume data:', error);
                    toast({
                        title: "❌ Error",
                        description: "Failed to load resume data",
                        variant: "destructive",
                    });
                }
            }
            setLoading(false);
        }
    }, [resumeId, toast]);

    // Fetch template HTML and details when resumeData is loaded
    useEffect(() => {
        const fetchTemplateContent = async () => {
            const templateId = resumeData?.template || 'modern';

            if (resumeData && !templatesLoading) {
                setTemplateLoading(true);
                try {
                    // First check if template exists in local templates array for details
                    const localTemplate = templates.find(t => t.id === templateId);
                    if (localTemplate) {
                        setTemplateDetails(localTemplate);
                    } else {
                        // If not found locally, try to fetch from API
                        try {
                            const template = await getTemplateById(templateId);
                            setTemplateDetails(template?.metadata || null);
                        } catch (error) {
                            console.error('Error fetching template details:', error);
                            // Set basic details if API fails
                            setTemplateDetails({
                                id: templateId,
                                name: templateId.charAt(0).toUpperCase() + templateId.slice(1),
                                description: `${templateId} template`,
                                features: []
                            });
                        }
                    }

                    // Fetch the actual template HTML from backend
                    const response = await fetch(`http://localhost:5001/api/templates/${templateId}`);
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data.html) {
                            setTemplateHtml(result.data.html);
                        } else {
                            console.error('Template HTML not found in response');
                        }
                    } else {
                        console.error('Failed to fetch template HTML');
                    }
                } catch (error) {
                    console.error('Error fetching template content:', error);
                    toast({
                        title: "❌ Template Error",
                        description: "Failed to load template. Using fallback.",
                        variant: "destructive",
                    });
                } finally {
                    setTemplateLoading(false);
                }
            }
        };

        fetchTemplateContent();
    }, [resumeData, templates, templatesLoading, getTemplateById, toast]);

    // Force re-render after data is loaded and mark content as ready
    useEffect(() => {
        if (flexibleData && templateHtml) {
            setRenderKey(prev => prev + 1);

            // Small delay to ensure DOM is updated
            const timer = setTimeout(() => {
                setIsContentReady(true);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [flexibleData, templateHtml]);

    // Enhanced print function with preview
    const handlePrint = useCallback(() => {
        if (!isContentReady || !contentRef.current) {
            toast({
                title: "⚠️ Not Ready",
                description: "Please wait for the content to load completely",
            });
            return;
        }

        try {
            // Show print preview first
            setShowPrintPreview(true);
        } catch (error) {
            console.error('Print preview error:', error);
            toast({
                title: "❌ Print Preview Failed",
                description: "Failed to open print preview. Please try again.",
                variant: "destructive",
            });
        }
    }, [isContentReady, toast]);

    const handleActualPrint = useCallback(() => {
        try {
            window.print();
            setShowPrintPreview(false);

            toast({
                title: "✅ Print Initiated",
                description: "Print dialog opened successfully",
            });
        } catch (error) {
            console.error('Print error:', error);
            toast({
                title: "❌ Print Failed",
                description: "Failed to open print dialog. Please try again.",
                variant: "destructive",
            });
        }
    }, [toast]);

    const prepareDataForTemplate = () => {
        if (!flexibleData) return null;

        // Prepare data in the format expected by templates
        const personal = flexibleData.personal || {};
        const summary = flexibleData.summary || {};
        const skills = flexibleData.skills || {};

        // Get display names
        const portfolioDisplay = personal.portfolio_display || '';
        const linkedinDisplay = personal.linkedin_display || '';
        const githubDisplay = personal.github_display || '';

        // Get URLs
        const portfolioUrl = personal.portfolio_url || personal.portfolio || '';
        const linkedinUrl = personal.linkedin_url || personal.linkedin || '';
        const githubUrl = personal.github_url || personal.github || '';

        // Clean URLs
        const cleanPortfolioUrl = portfolioUrl ? (portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`) : '';
        const cleanLinkedinUrl = linkedinUrl ? (linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`) : '';
        const cleanGithubUrl = githubUrl ? (githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`) : '';

        return {
            // Personal Information
            full_name: personal.full_name || '',
            name: personal.full_name || '',
            job_title: personal.job_title || '',
            title: personal.job_title || '',
            headline: personal.headline || '',
            email: personal.email || '',
            phone: personal.phone || '',
            location: personal.location || '',

            // Social Links
            portfolio_display: portfolioDisplay,
            portfolio_url: cleanPortfolioUrl,

            linkedin_display: linkedinDisplay,
            linkedin_url: cleanLinkedinUrl,

            github_display: githubDisplay,
            github_url: cleanGithubUrl,

            // Legacy fields for backward compatibility
            portfolio: cleanPortfolioUrl,
            linkedin: cleanLinkedinUrl,
            github: cleanGithubUrl,
            website: cleanPortfolioUrl,

            // Professional Summary
            professional_summary: summary.summary || '',
            summary: summary.summary || '',

            // Experience
            experience: Array.isArray(flexibleData.experience)
                ? flexibleData.experience.map(exp => ({
                    title: exp.title || exp.position || '',
                    company: exp.company || '',
                    location: exp.location || '',
                    start_date: exp.start_date || exp.startDate || '',
                    end_date: exp.end_date || exp.endDate || '',
                    current: exp.current || false,
                    description: exp.description || '',
                    achievements: exp.achievements || [],
                    position: exp.title || exp.position || ''
                }))
                : [],

            // Education
            education: Array.isArray(flexibleData.education)
                ? flexibleData.education.map(edu => ({
                    degree: edu.degree || '',
                    institution: edu.institution || edu.school || '',
                    location: edu.location || '',
                    start_date: edu.start_date || edu.startDate || '',
                    end_date: edu.end_date || edu.endDate || '',
                    current: edu.current || false,
                    grade: edu.grade || '',
                    description: edu.description || '',
                    school: edu.institution || edu.school || ''
                }))
                : [],

            // Skills
            skills: {
                technical: Array.isArray(skills.technical) ? skills.technical : [],
                soft: Array.isArray(skills.soft) ? skills.soft : [],
                languages: Array.isArray(skills.languages) ? skills.languages : []
            },
            technical_skills: Array.isArray(skills.technical) ? skills.technical : [],
            soft_skills: Array.isArray(skills.soft) ? skills.soft : [],

            // Projects
            projects: Array.isArray(flexibleData.projects)
                ? flexibleData.projects.map(proj => ({
                    name: proj.name || '',
                    description: proj.description || '',
                    technologies: proj.technologies || [],
                    url: proj.url || '',
                    start_date: proj.start_date || '',
                    end_date: proj.end_date || '',
                    highlights: proj.highlights || []
                }))
                : [],

            // Other sections
            certifications: Array.isArray(flexibleData.certifications)
                ? flexibleData.certifications
                : [],

            languages: Array.isArray(flexibleData.languages)
                ? flexibleData.languages
                : (Array.isArray(skills.languages) ? skills.languages.map(l => ({ language: l, proficiency: 'Professional' })) : []),

            publications: Array.isArray(flexibleData.publications)
                ? flexibleData.publications
                : [],

            awards: Array.isArray(flexibleData.awards)
                ? flexibleData.awards
                : [],

            volunteering: Array.isArray(flexibleData.volunteering)
                ? flexibleData.volunteering
                : [],

            interests: Array.isArray(flexibleData.interests)
                ? flexibleData.interests
                : [],

            // Template settings
            template: resumeData?.template || 'modern',
            theme_color: resumeData?.theme_color || '#2563eb',
            font_family: resumeData?.font_family || 'Inter',

            // Metadata
            generatedAt: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
    };

    const renderTemplate = () => {
        if (!flexibleData || !templateHtml) return null;

        try {
            // Prepare data for template
            const templateData = prepareDataForTemplate();

            console.log('Rendering template with data:', templateData);

            // Compile and render the template with Handlebars
            const compiledTemplate = Handlebars.compile(templateHtml);
            const renderedHtml = compiledTemplate(templateData);

            return (
                <div
                    key={`template-${renderKey}`}
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                    className="template-content"
                />
            );
        } catch (error) {
            console.error('Template rendering error:', error);
            return (
                <div className="text-center text-red-600">
                    <h3 className="text-xl font-bold mb-4">Error Rendering Template</h3>
                    <p className="text-sm">{error.message}</p>
                    <pre className="mt-4 text-xs text-left bg-red-50 p-4 rounded overflow-auto max-h-96">
                        {error.stack}
                    </pre>
                </div>
            );
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/preview/${resumeId}`);
        toast({
            title: "✅ Link Copied",
            description: "Share link copied to clipboard",
        });
    };

    const handleEdit = () => {
        router.push(`/editor?resumeId=${resumeId}`);
    };

    if (loading || templatesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                    <div className="text-center">
                        <div className="text-white text-2xl font-bold mb-2">Loading Preview</div>
                        <div className="text-gray-400 text-sm">Preparing your resume...</div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!resumeData || !flexibleData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl"
                >
                    <h1 className="text-4xl text-white font-bold mb-4">Resume Not Found</h1>
                    <p className="text-gray-400 mb-8 text-lg">
                        The resume you're looking for doesn't exist or has been deleted.
                    </p>
                    <div className='flex justify-center'>
                        <Button
                            onClick={() => router.push('/')}
                            variant="default"
                            size="lg"
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const personal = flexibleData.personal || {};
    const firstName = personal.full_name?.split(' ')[0] || 'Resume';
    const templateId = resumeData.template || 'modern';
    const templateIcon = getTemplateIcon(templateId);

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900/20 to-gray-900">
            {/* Preview Header */}
            <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            {/* Template Info */}
                            {templateDetails && (
                                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                                    <span className="text-xl">{templateIcon}</span>
                                    <span className="text-white/80 text-sm">
                                        {templateDetails.name} Template
                                    </span>
                                </div>
                            )}

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={handleCopyLink}
                                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={handleEdit}
                                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={handlePrint}
                                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Print
                                </Button>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <DownloadPDF
                                    ref={downloadRef}
                                    resumeId={resumeId}
                                    filename={`${personal.full_name || 'resume'}-${templateId}.pdf`}
                                    template={templateId}
                                    variant="default"
                                    size="sm"
                                    label="PDF"
                                    showIcon={true}
                                    showLabel={true}
                                    resumeData={flexibleData}
                                    className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white shadow-lg shadow-blue-600/25"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Print Preview Modal */}
            <AnimatePresence>
                {showPrintPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="print-preview-modal fixed inset-0 bg-black/75 z-9999 flex items-center justify-center p-4"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setShowPrintPreview(false);
                            }
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Printer className="w-5 h-5 text-gray-600" />
                                    <h2 className="text-lg font-semibold text-gray-800">Print Preview</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPrintPreview(false)}
                                        className="text-gray-600"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleActualPrint}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Printer className="w-4 h-4 mr-2" />
                                        Print
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-6 bg-gray-100">
                                <div className="flex justify-center">
                                    <div
                                        ref={printPreviewRef}
                                        className="shadow-xl transform scale-[0.8] origin-top"
                                        style={{
                                            width: '816px',
                                            backgroundColor: 'white',
                                        }}
                                    >
                                        {isContentReady && templateHtml && (
                                            <div className="p-1">
                                                {renderTemplate()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
                                <p>💡 Tip: Use the print dialog to adjust page settings like margins and paper size.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Resume Content */}
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Resume Title */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {resumeData.resume_title || `${firstName}'s Resume`}
                        </h1>
                        <div className="flex items-center justify-center gap-2">
                            {templateLoading ? (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Loading template...
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm capitalize flex items-center gap-2">
                                    <span>{templateIcon}</span>
                                    {templateDetails?.name || templateId} template
                                </span>
                            )}

                            {/* Template Features Badges */}
                            {templateDetails?.features && templateDetails.features.length > 0 && (
                                <div className="hidden md:flex items-center gap-2">
                                    {templateDetails.features.slice(0, 2).map((feature, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-0.5 bg-white/5 text-white/60 rounded-full text-xs"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resume Preview */}
                    {!isContentReady || templateLoading || !templateHtml ? (
                        <div
                            className="bg-white rounded-xl shadow-2xl overflow-hidden flex justify-center items-center mx-auto"
                            style={{
                                width: '816px',
                                minHeight: '1056px',
                            }}
                        >
                            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                        </div>
                    ) : (
                        <div
                            id="resume-preview-content"
                            ref={contentRef}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto"
                            style={{
                                width: '816px',
                                minHeight: '1056px',
                            }}
                        >
                            <div className="p-1">
                                {renderTemplate()}
                            </div>
                        </div>
                    )}

                    {/* Action Footer */}
                    <div className="mt-8 flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleEdit}
                            className="bg-white/5 hover:bg-white/10 text-white border-white/10"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Resume
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="bg-white/5 hover:bg-white/10 text-white border-white/10"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            Print Preview
                        </Button>
                    </div>

                    {/* Template Details Section */}
                    {templateDetails && templateDetails.features && templateDetails.features.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10"
                        >
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <span className="text-xl">{templateIcon}</span>
                                About the {templateDetails.name} Template
                            </h3>
                            <p className="text-gray-400 mb-4">{templateDetails.description}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {templateDetails.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-gray-300 text-sm">
                                        <svg className="w-4 h-4 text-green-400 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}