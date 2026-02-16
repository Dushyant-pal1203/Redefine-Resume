'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DownloadPDF from '@/components/FunctionComponent/DownloadPDF';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Share2, Edit, Loader2, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useTemplates } from '@/hooks/use-templates';
import Handlebars from 'handlebars';

// Print styles to properly format the resume for printing
const printStyles = `
  @media print {
    /* Hide everything except the resume content */
    body * {
      visibility: hidden !important;
    }
    
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
      padding: 1px !important;
      background: white !important;
      box-shadow: none !important;
    }
    
    /* Hide all UI elements */
    header, footer, button, .sticky, .fixed, nav,
    [role="button"], [class*="header"], [class*="footer"] {
      display: block !important;
    }
    
    /* Page margins */
    @page {
      margin: 0.1in;
    }
    
    /* Ensure proper box sizing */
    * {
      box-sizing: border-box !important;
    }
  }
`;

// Template Icon Mapping
const getTemplateIcon = (templateId) => {
    const icons = {
        modern: '✨',
        minimal: '🎯',
        creative: '🎨',
        professional: '📋'
    };
    return icons[templateId] || '📄';
};

// Register Handlebars helpers
if (typeof window !== 'undefined') {
    // Helper for checking if array has items
    Handlebars.registerHelper('hasItems', function (array, options) {
        if (array && Array.isArray(array) && array.length > 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    // Helper for skill categorization (for professional template)
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

    // Helper for checking if it's the last item in array
    Handlebars.registerHelper('ifLast', function (index, array, options) {
        if (index === array.length - 1) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
}

export default function PreviewPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [resumeData, setResumeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renderKey, setRenderKey] = useState(0);
    const [isContentReady, setIsContentReady] = useState(false);
    const [templateHtml, setTemplateHtml] = useState(null);
    const resumeId = params.resumeId;
    const downloadRef = useRef();
    const contentRef = useRef(null);
    const printFrameRef = useRef(null);
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

    // Load resume data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(`resume_${resumeId}`);

            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setResumeData(parsed);
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
            if (resumeData?.template && !templatesLoading) {
                setTemplateLoading(true);
                try {
                    // First check if template exists in local templates array for details
                    const localTemplate = templates.find(t => t.id === resumeData.template);
                    if (localTemplate) {
                        setTemplateDetails(localTemplate);
                    } else {
                        // If not found locally, try to fetch from API
                        try {
                            const template = await getTemplateById(resumeData.template);
                            setTemplateDetails(template?.metadata || null);
                        } catch (error) {
                            console.error('Error fetching template details:', error);
                            // Set basic details if API fails
                            setTemplateDetails({
                                id: resumeData.template,
                                name: resumeData.template.charAt(0).toUpperCase() + resumeData.template.slice(1),
                                description: `${resumeData.template} template`,
                                features: []
                            });
                        }
                    }

                    // Fetch the actual template HTML from backend
                    const response = await fetch(`http://localhost:5001/api/templates/${resumeData.template}`);
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
        if (resumeData && templateHtml) {
            setRenderKey(prev => prev + 1);

            // Small delay to ensure DOM is updated
            const timer = setTimeout(() => {
                setIsContentReady(true);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [resumeData, templateHtml]);

    // Print function
    const handlePrint = useCallback(() => {
        if (!isContentReady || !contentRef.current) {
            toast({
                title: "⚠️ Not Ready",
                description: "Please wait for the content to load completely",
            });
            return;
        }

        try {
            // Save current body content
            const originalTitle = document.title;
            const originalBody = document.body.innerHTML;

            // Get the resume content
            const resumeContent = contentRef.current.outerHTML;

            // Get all styles
            const styles = Array.from(document.styleSheets)
                .map(styleSheet => {
                    try {
                        const rules = styleSheet.cssRules || styleSheet.rules;
                        if (rules) {
                            return Array.from(rules).map(rule => rule.cssText).join('');
                        }
                    } catch (e) {
                        return '';
                    }
                    return '';
                })
                .join('');

            // Replace body with only resume content
            document.title = `${resumeData?.full_name || 'Resume'} - Print`;
            document.body.innerHTML = `
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: white; padding: 20px; }
                ${styles}
            </style>
            ${resumeContent}
        `;

            // Trigger print
            window.print();

            // Restore original content after print dialog closes
            setTimeout(() => {
                document.title = originalTitle;
                document.body.innerHTML = originalBody;
                // Re-initialize your app state if needed
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Print error:', error);
            toast({
                title: "❌ Print Failed",
                description: "Failed to open print dialog. Please try again.",
                variant: "destructive",
            });
        }
    }, [isContentReady, resumeData]);

    const renderTemplate = () => {
        if (!resumeData || !templateHtml) return null;

        try {
            // Prepare data with defaults to avoid undefined errors
            const preparedData = {
                full_name: resumeData?.full_name || '',
                email: resumeData?.email || '',
                phone: resumeData?.phone || '',
                location: resumeData?.location || '',
                website: resumeData?.website || 'dushyantpall203.vercel.app',
                github: resumeData?.github || 'github.com/Dushyant-pall203',
                linkedin: resumeData?.linkedin || 'linkedin.com/in/dushyant-pal',
                professional_summary: resumeData?.professional_summary || '',
                experience: Array.isArray(resumeData?.experience) ? resumeData.experience : [],
                education: Array.isArray(resumeData?.education) ? resumeData.education : [],
                skills: Array.isArray(resumeData?.skills) ? resumeData.skills : [],
                projects: Array.isArray(resumeData?.projects) ? resumeData.projects : []
            };

            console.log('Rendering template with data:', preparedData);

            // Compile and render the template with Handlebars
            const compiledTemplate = Handlebars.compile(templateHtml);
            const renderedHtml = compiledTemplate(preparedData);

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
        // Navigate to editor with data
        const encodedData = encodeURIComponent(JSON.stringify(resumeData));
        router.push(`/editor?resumeId=${resumeId}&data=${encodedData}&template=${resumeData.template || 'modern'}`);
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

    if (!resumeData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-7xl p-8"
                >
                    <h1 className="text-7xl text-white font-bold mb-4">Resume Not Found</h1>
                    <p className="text-gray-400 mb-8 text-4xl">
                        The resume you're looking for doesn't exist or has been deleted.
                    </p>
                    <div className='flex justify-center'>
                        <Button
                            onClick={() => router.push('/')}
                            variant="default"
                            size="lg"
                            className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-[20px] sm:text-[40px]"
                        >
                            <ArrowLeft className="w-10 h-10 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const firstName = resumeData.full_name?.split(' ')[0] || 'Resume';
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

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <DownloadPDF
                                    ref={downloadRef}
                                    resumeData={resumeData}
                                    template={resumeData.template || 'modern'}
                                    filename={`${resumeData.full_name || 'resume'}.pdf`}
                                    variant="default"
                                    size="default"
                                    label="Download PDF"
                                    showIcon={true}
                                    showLabel={true}
                                    elementId="resume-preview-content"
                                    className="p-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 text-white shadow-lg shadow-blue-600/25"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

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
                        <h1 className="text-3xl font-bold text-white! mb-2">
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
                            {templateDetails?.features && (
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
                        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex justify-center items-center"
                            style={{
                                width: '816px',
                                margin: '0 auto',
                                minHeight: '1056px',
                            }}
                        >
                            <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
                        </div>
                    ) : (
                        <div
                            id="resume-preview-content"
                            ref={contentRef}
                            className="bg-white rounded-xl shadow-2xl overflow-hidden"
                            style={{
                                width: '816px',
                                margin: '0 auto',
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
                            <Printer className="w-4 h-4 mr-2" />
                            Print Preview
                        </Button>
                    </div>

                    {/* Template Details Section */}
                    {templateDetails && (
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
                                {templateDetails.features?.map((feature, index) => (
                                    <div key={index} className="flex items-center text-gray-300 text-sm">
                                        <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
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