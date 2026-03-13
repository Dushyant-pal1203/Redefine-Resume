'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DownloadPDF from '@/components/FunctionComponent/DownloadPDF';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Edit, Loader2, Printer, Eye, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useTemplates } from '@/hooks/use-templates';
import Handlebars from 'handlebars';
import { convertToFlexibleFormat } from '@/lib/resume-schema';

// Enhanced print styles for better print output
const printStyles = `
  @media print {
    body * { visibility: hidden !important; }
    #resume-preview-content, #resume-preview-content * { visibility: visible !important; }
    #resume-preview-content {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    .template-content { page-break-inside: avoid; }
    h1, h2, h3, h4, h5, h6 { page-break-after: avoid; }
    p, .section { page-break-inside: avoid; }
    @page { size: letter; margin: 0.5in !important; }
    .bg-gray-50, .bg-gray-100, .bg-blue-50 { background: white !important; }
    .text-gray-600, .text-gray-700, .text-gray-800 { color: black !important; }
    button, .no-print { display: none !important; }
  }
`;

// Template Icon Mapping
const getTemplateIcon = (templateId) => {
    const icons = {
        modern: '✨',
        minimal: '🎯',
        creative: '🎨',
        professional: '📋',
        executive: '👔',
        classic: '📄',
        contemporary: '🌟'
    };
    return icons[templateId] || '📄';
};

// Register Handlebars helpers
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [fetchError, setFetchError] = useState(null);

    const resumeId = params.resumeId;
    const downloadRef = useRef();
    const contentRef = useRef(null);
    const printPreviewRef = useRef(null);
    const { templates, isLoading: templatesLoading, getTemplateById } = useTemplates();
    const [templateDetails, setTemplateDetails] = useState(null);
    const [templateLoading, setTemplateLoading] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    // Load resume data from localStorage or fetch from API
    useEffect(() => {
        const loadResumeData = async () => {
            if (typeof window !== 'undefined') {
                try {
                    // First try to get from localStorage
                    const stored = localStorage.getItem(`resume_${resumeId}`);

                    if (stored) {
                        // Data found in localStorage
                        const parsed = JSON.parse(stored);
                        console.log("📦 Loaded resume from localStorage:", parsed);
                        setResumeData(parsed);
                        const flexible = convertToFlexibleFormat(parsed);
                        setFlexibleData(flexible);
                        setLoading(false);
                    } else {
                        // If not in localStorage, try to fetch from API
                        console.log("🌐 Fetching resume from API:", resumeId);
                        try {
                            const response = await fetch(`/api/resumes/${resumeId}`);
                            if (response.ok) {
                                const result = await response.json();
                                if (result.success && result.data) {
                                    setResumeData(result.data);
                                    const flexible = convertToFlexibleFormat(result.data);
                                    setFlexibleData(flexible);
                                } else {
                                    setFetchError("Resume data not found");
                                }
                            } else {
                                setFetchError(`Failed to fetch resume: ${response.status}`);
                            }
                        } catch (apiError) {
                            console.error("API fetch error:", apiError);
                            setFetchError("Could not load resume data");
                        } finally {
                            setLoading(false);
                        }
                    }
                } catch (error) {
                    console.error('Error parsing resume data:', error);
                    toast({
                        title: "❌ Error",
                        description: "Failed to load resume data",
                        variant: "destructive",
                    });
                    setFetchError(error.message);
                    setLoading(false);
                }
            }
        };

        loadResumeData();
    }, [resumeId, toast]);

    // Fetch template HTML and details
    useEffect(() => {
        const fetchTemplateContent = async () => {
            if (!resumeData) return;

            const templateId = resumeData.template || 'modern';
            console.log("🎨 Fetching template:", templateId);

            if (!templatesLoading) {
                setTemplateLoading(true);
                try {
                    // Get template details
                    const localTemplate = templates.find(t => t.id === templateId);
                    if (localTemplate) {
                        setTemplateDetails(localTemplate);
                    } else {
                        try {
                            const template = await getTemplateById(templateId);
                            setTemplateDetails(template?.metadata || null);
                        } catch (error) {
                            console.error('Error fetching template details:', error);
                            setTemplateDetails({
                                id: templateId,
                                name: templateId.charAt(0).toUpperCase() + templateId.slice(1),
                                description: `${templateId} template`,
                                features: []
                            });
                        }
                    }

                    // Fetch template HTML
                    const response = await fetch(`http://localhost:5001/api/templates/${templateId}`);
                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data.html) {
                            console.log("✅ Template HTML loaded");
                            setTemplateHtml(result.data.html);
                        } else {
                            console.error("Template HTML not found in response");
                        }
                    } else {
                        console.error("Failed to fetch template:", response.status);
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

    // Force re-render after data is loaded
    useEffect(() => {
        if (flexibleData && templateHtml) {
            console.log("🔄 Re-rendering template with data");
            setRenderKey(prev => prev + 1);
            const timer = setTimeout(() => {
                setIsContentReady(true);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [flexibleData, templateHtml]);

    const handlePrint = useCallback(() => {
        if (!isContentReady || !contentRef.current) {
            toast({
                title: "⚠️ Not Ready",
                description: "Please wait for the content to load completely",
            });
            return;
        }
        setShowPrintPreview(true);
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

        const personal = flexibleData.personal || {};
        const summary = flexibleData.summary || {};
        const skills = flexibleData.skills || {};

        const portfolioDisplay = personal.portfolio_display || '';
        const linkedinDisplay = personal.linkedin_display || '';
        const githubDisplay = personal.github_display || '';

        const portfolioUrl = personal.portfolio_url || personal.portfolio || '';
        const linkedinUrl = personal.linkedin_url || personal.linkedin || '';
        const githubUrl = personal.github_url || personal.github || '';

        const cleanPortfolioUrl = portfolioUrl ? (portfolioUrl.startsWith('http') ? portfolioUrl : `https://${portfolioUrl}`) : '';
        const cleanLinkedinUrl = linkedinUrl ? (linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`) : '';
        const cleanGithubUrl = githubUrl ? (githubUrl.startsWith('http') ? githubUrl : `https://${githubUrl}`) : '';

        return {
            full_name: personal.full_name || '',
            name: personal.full_name || '',
            job_title: personal.job_title || '',
            title: personal.job_title || '',
            headline: personal.headline || '',
            email: personal.email || '',
            phone: personal.phone || '',
            location: personal.location || '',
            portfolio_display: portfolioDisplay,
            portfolio_url: cleanPortfolioUrl,
            linkedin_display: linkedinDisplay,
            linkedin_url: cleanLinkedinUrl,
            github_display: githubDisplay,
            github_url: cleanGithubUrl,
            portfolio: cleanPortfolioUrl,
            linkedin: cleanLinkedinUrl,
            github: cleanGithubUrl,
            website: cleanPortfolioUrl,
            professional_summary: summary.summary || '',
            summary: summary.summary || '',
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
            skills: {
                technical: Array.isArray(skills.technical) ? skills.technical : [],
                soft: Array.isArray(skills.soft) ? skills.soft : [],
                languages: Array.isArray(skills.languages) ? skills.languages : []
            },
            technical_skills: Array.isArray(skills.technical) ? skills.technical : [],
            soft_skills: Array.isArray(skills.soft) ? skills.soft : [],
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
            certifications: Array.isArray(flexibleData.certifications) ? flexibleData.certifications : [],
            languages: Array.isArray(flexibleData.languages)
                ? flexibleData.languages
                : (Array.isArray(skills.languages) ? skills.languages.map(l => ({ language: l, proficiency: 'Professional' })) : []),
            publications: Array.isArray(flexibleData.publications) ? flexibleData.publications : [],
            awards: Array.isArray(flexibleData.awards) ? flexibleData.awards : [],
            volunteering: Array.isArray(flexibleData.volunteering) ? flexibleData.volunteering : [],
            interests: Array.isArray(flexibleData.interests) ? flexibleData.interests : [],
            template: resumeData?.template || 'modern',
            theme_color: resumeData?.theme_color || '#2563eb',
            font_family: resumeData?.font_family || 'Inter',
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
            const templateData = prepareDataForTemplate();
            console.log("📊 Template data prepared:", templateData);
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
                <div className="text-center text-red-600 p-8">
                    <h3 className="text-xl font-bold mb-4">Error Rendering Template</h3>
                    <p className="text-sm">{error.message}</p>
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
                    className="flex flex-col items-center gap-6 px-4 text-center"
                >
                    <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                    </div>
                    <div>
                        <div className="text-white text-xl sm:text-2xl font-bold mb-2">Loading Preview</div>
                        <div className="text-gray-400 text-sm sm:text-base">Preparing your resume...</div>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!resumeData || !flexibleData || fetchError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-2xl"
                >
                    <h1 className="text-2xl sm:text-4xl text-white font-bold mb-4">Resume Not Found</h1>
                    <p className="text-gray-400 mb-8 text-base sm:text-lg">
                        {fetchError || "The resume you're looking for doesn't exist or has been deleted."}
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-base sm:text-lg px-6 sm:px-8"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Back to Dashboard
                    </Button>
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
            {/* Print Preview Modal */}
            <AnimatePresence>
                {showPrintPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-9999 flex items-center justify-center p-2 sm:p-4"
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
                            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">Print Preview</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPrintPreview(false)}
                                        className="text-gray-600 text-xs sm:text-sm px-2 sm:px-3"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleActualPrint}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-3"
                                    >
                                        <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        Print
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-100">
                                <div className="flex justify-center overflow-x-auto">
                                    <div
                                        ref={printPreviewRef}
                                        className="shadow-xl"
                                        style={{
                                            transform: windowWidth < 640 ? 'scale(0.6)' : windowWidth < 1024 ? 'scale(0.7)' : 'scale(0.8)',
                                            transformOrigin: 'top center',
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
                            <div className="px-4 sm:px-6 py-2 sm:py-3 border-t border-gray-200 bg-gray-50 text-xs sm:text-sm text-gray-600">
                                <p>💡 Tip: Use the print dialog to adjust page settings like margins and paper size.</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 z-40 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween' }}
                            className="absolute right-0 top-0 bottom-0 w-64 bg-gray-900 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-end mb-6">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-white/60 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={handleCopyLink}
                                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 justify-start"
                                >
                                    <Share2 className="w-4 h-4 mr-3" />
                                    Share
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handleEdit}
                                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 justify-start"
                                >
                                    <Edit className="w-4 h-4 mr-3" />
                                    Edit
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={handlePrint}
                                    className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 justify-start"
                                >
                                    <Printer className="w-4 h-4 mr-3" />
                                    Print
                                </Button>
                                <div className="pt-2">
                                    <DownloadPDF
                                        ref={downloadRef}
                                        resumeId={resumeId}
                                        filename={`${personal.full_name || 'resume'}-${templateId}.pdf`}
                                        template={templateId}
                                        resumeData={flexibleData}
                                        className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white w-full justify-start"
                                        showIcon={true}
                                        showLabel={true}
                                        label="Download PDF"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
                <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
                        {/* Back Button */}
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-2 sm:px-4 h-8 sm:h-10"
                            >
                                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                <span className="hidden sm:inline text-xs sm:text-sm">Back</span>
                            </Button>
                        </motion.div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-2 lg:gap-3">
                            {/* Template Info */}
                            {templateDetails && (
                                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                                    <span className="text-xl">{templateIcon}</span>
                                    <span className="text-white/80 text-sm whitespace-nowrap">
                                        {templateDetails.name}
                                    </span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {[
                                { icon: Share2, action: handleCopyLink, label: 'Share' },
                                { icon: Edit, action: handleEdit, label: 'Edit' },
                                { icon: Printer, action: handlePrint, label: 'Print' }
                            ].map(({ icon: Icon, action, label }) => (
                                <motion.div key={label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="ghost"
                                        onClick={action}
                                        className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 lg:px-4 h-9 lg:h-10"
                                    >
                                        <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 lg:mr-2" />
                                        <span className="hidden lg:inline text-sm">{label}</span>
                                    </Button>
                                </motion.div>
                            ))}

                            {/* PDF Button */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <DownloadPDF
                                    ref={downloadRef}
                                    resumeId={resumeId}
                                    filename={`${personal.full_name || 'resume'}-${templateId}.pdf`}
                                    template={templateId}
                                    resumeData={flexibleData}
                                    className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white shadow-lg shadow-blue-600/25 px-3 lg:px-4 h-9 lg:h-10"
                                    showIcon={true}
                                    showLabel={windowWidth >= 1024}
                                    label="PDF"
                                />
                            </motion.div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex items-center gap-2 md:hidden">
                            {/* Template Icon for Mobile */}
                            {templateDetails && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-lg border border-white/10">
                                    <span className="text-base">{templateIcon}</span>
                                    <span className="text-white/80 text-xs truncate max-w-20">
                                        {templateDetails.name}
                                    </span>
                                </div>
                            )}

                            <Button
                                variant="ghost"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <ChevronRight className="w-4 h-4 -ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Title Section */}
                    <div className="mb-4 sm:mb-6 lg:mb-8 text-center">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 px-2">
                            {resumeData.resume_title || `${firstName}'s Resume`}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center gap-2 px-2">
                            {templateLoading ? (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Loading...
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs sm:text-sm capitalize flex items-center gap-2">
                                    <span>{templateIcon}</span>
                                    {templateDetails?.name || templateId}
                                </span>
                            )}

                            {/* Template Features - Hidden on mobile */}
                            {templateDetails?.features && templateDetails.features.length > 0 && (
                                <div className="hidden lg:flex items-center gap-2">
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

                    {/* Resume Preview Container */}
                    <div className="flex justify-center overflow-x-auto pb-4">
                        {!isContentReady || templateLoading || !templateHtml ? (
                            <div
                                className="bg-white rounded-xl shadow-2xl overflow-hidden flex justify-center items-center"
                                style={{
                                    width: '100%',
                                    maxWidth: '816px',
                                    minHeight: windowWidth < 640 ? '400px' : windowWidth < 768 ? '600px' : '800px',
                                    aspectRatio: '816/1056',
                                }}
                            >
                                <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin text-purple-600" />
                            </div>
                        ) : (
                            <div
                                id="resume-preview-content"
                                ref={contentRef}
                                className="bg-white rounded-xl shadow-2xl overflow-hidden"
                                style={{
                                    width: '100%',
                                    maxWidth: '816px',
                                    transform: windowWidth < 640 ? 'scale(0.9)' : 'scale(1)',
                                    transformOrigin: 'top center',
                                }}
                            >
                                <div className="p-1">
                                    {renderTemplate()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 lg:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs sm:text-sm"
                        >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                            className="bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs sm:text-sm"
                        >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Preview
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyLink}
                            className="bg-white/5 hover:bg-white/10 text-white border-white/10 text-xs sm:text-sm"
                        >
                            <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Share
                        </Button>
                        <DownloadPDF
                            ref={downloadRef}
                            resumeId={resumeId}
                            filename={`${personal.full_name || 'resume'}-${templateId}.pdf`}
                            template={templateId}
                            resumeData={flexibleData}
                            className="bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white text-xs sm:text-sm px-3 sm:px-4"
                            showIcon={true}
                            showLabel={true}
                            label="PDF"
                            size="sm"
                        />
                    </div>

                    {/* Template Details Section */}
                    {templateDetails && templateDetails.features && templateDetails.features.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 sm:mt-8 p-4 sm:p-6 bg-white/5 rounded-xl border border-white/10"
                        >
                            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-xl sm:text-2xl">{templateIcon}</span>
                                About the {templateDetails.name} Template
                            </h3>
                            <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">{templateDetails.description}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                                {templateDetails.features.map((feature, index) => (
                                    <div key={index} className="flex items-center text-gray-300 text-xs sm:text-sm">
                                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="truncate">{feature}</span>
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