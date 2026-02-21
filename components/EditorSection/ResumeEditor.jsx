// components/EditorSection/ResumeEditor.jsx
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileUp,
    User,
    Mail,
    Phone,
    MapPin,
    FileText,
    Briefcase,
    GraduationCap,
    Zap,
    Rocket,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    GripVertical,
    Sparkles,
    AlertCircle,
    CheckCircle,
    X,
    Save,
    Globe,
    Link as LinkIcon,
    Github,
    Linkedin,
    Award,
    Trophy,
    BookOpen,
    Heart,
    Coffee,
    Code,
    Palette,
    Music,
    Globe2,
    Languages,
    Users,
    Target,
    Lightbulb,
    Shield,
    Star,
    Clock,
    Calendar,
    ExternalLink,
    Settings,
    RefreshCw,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUploadResume, useCreateResume } from "@/hooks/use-resumes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
    convertToOldFormat,
    convertToFlexibleFormat,
    convertDatabaseToFlexibleFormat,
    validateResumeData,
    generateId,
    getEmptyResumeData
} from '@/lib/resume-schema';
import { isValidUrl, cleanUrl } from '@/lib/utils';


// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder, rows = 3 }) => {
    const [showToolbar, setShowToolbar] = useState(false);

    const applyFormat = (format) => {
        const textarea = document.getElementById('rich-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);

        let formattedText = '';
        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'bullet':
                formattedText = `• ${selectedText}`;
                break;
            default:
                formattedText = selectedText;
        }

        const newValue = value.substring(0, start) + formattedText + value.substring(end);
        onChange(newValue);
    };

    return (
        <div className="relative">
            <div className="absolute right-2 top-2 z-10">
                <button
                    onClick={() => setShowToolbar(!showToolbar)}
                    className="p-1.5 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                    <Settings className="w-4 h-4 text-gray-300" />
                </button>
            </div>

            <AnimatePresence>
                {showToolbar && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -top-12 left-0 right-0 bg-gray-800 rounded-lg p-2 flex gap-2 border border-gray-700 z-20"
                    >
                        <button
                            onClick={() => applyFormat('bold')}
                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                            title="Bold"
                        >
                            <span className="font-bold text-white">B</span>
                        </button>
                        <button
                            onClick={() => applyFormat('italic')}
                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                            title="Italic"
                        >
                            <span className="italic text-white">I</span>
                        </button>
                        <button
                            onClick={() => applyFormat('bullet')}
                            className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                            title="Bullet Point"
                        >
                            <span className="text-white">•</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <textarea
                id="rich-textarea"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all resize-y"
                placeholder={placeholder}
            />
        </div>
    );
};

// Skill Input Component
const SkillInput = ({ skills = [], onChange, category }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const commonSkills = {
        technical: [
            'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Java',
            'C++', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'Docker', 'AWS', 'GraphQL',
            'REST APIs', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Vue.js',
            'Angular', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Flutter'
        ],
        soft: [
            'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking',
            'Time Management', 'Adaptability', 'Creativity', 'Collaboration', 'Empathy',
            'Conflict Resolution', 'Decision Making', 'Negotiation', 'Presentation'
        ],
        languages: [
            'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
            'Russian', 'Arabic', 'Portuguese', 'Italian', 'Dutch', 'Hindi'
        ]
    };

    const getSuggestions = (input) => {
        if (!input) return [];
        const lowercaseInput = input.toLowerCase();
        return (commonSkills[category] || []).filter(skill =>
            skill.toLowerCase().includes(lowercaseInput) &&
            !skills.includes(skill)
        ).slice(0, 5);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            if (!skills.includes(inputValue.trim())) {
                onChange([...skills, inputValue.trim()]);
                setInputValue('');
                setSuggestions([]);
            }
        } else if (e.key === 'Backspace' && !inputValue && skills.length > 0) {
            onChange(skills.slice(0, -1));
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        setSuggestions(getSuggestions(value));
    };

    const addSuggestion = (suggestion) => {
        if (!skills.includes(suggestion)) {
            onChange([...skills, suggestion]);
            setInputValue('');
            setSuggestions([]);
        }
    };

    const removeSkill = (indexToRemove) => {
        onChange(skills.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-3">
            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                    <motion.span
                        key={`${skill}-${index}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="group flex items-center gap-1 px-3 py-1.5 bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/30"
                    >
                        <span className="text-sm">{skill}</span>
                        <button
                            onClick={() => removeSkill(index)}
                            className="ml-1 p-0.5 hover:bg-purple-500/20 rounded-full transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </motion.span>
                ))}
            </div>

            {/* Input Area */}
            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder={`Type a ${category} skill and press Enter...`}
                />

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                    {suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-10"
                        >
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={suggestion}
                                    onClick={() => addSuggestion(suggestion)}
                                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-purple-500/10 hover:text-purple-300 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Date Range Picker Component
const DateRangePicker = ({ startDate, endDate, current, onChange }) => {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                    <input
                        type="month"
                        value={startDate}
                        onChange={(e) => onChange('start_date', e.target.value)}
                        className="w-full p-2 bg-gray-800/50 rounded border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                        disabled={current}
                    />
                </div>
                <div>
                    <label className="block text-xs text-gray-400 mb-1">End Date</label>
                    <input
                        type="month"
                        value={current ? '' : endDate}
                        onChange={(e) => onChange('end_date', e.target.value)}
                        className="w-full p-2 bg-gray-800/50 rounded border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
                        disabled={current}
                    />
                </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={current}
                    onChange={(e) => onChange('current', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Currently working here</span>
            </label>
        </div>
    );
};

// Section Component
function Section({ title, icon: Icon, children, expanded, onToggle }) {
    return (
        <motion.div
            layout
            className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden backdrop-blur-sm"
        >
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">{title}</h3>
                </div>
                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-700/50"
                    >
                        <div className="p-4">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Dynamic Section Component for arrays
function DynamicSection({
    title,
    icon: Icon,
    items,
    expanded,
    onToggle,
    onAdd,
    onRemove,
    onMove,
    children,
    layout,
    hideTitle = false
}) {
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        if (onMove) {
            onMove(draggedIndex, index);
            setDraggedIndex(index);
        }
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id || index}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative p-4 bg-gray-800/50 rounded-lg border ${draggedIndex === index ? 'border-purple-500 shadow-lg' : 'border-gray-700'
                            } group cursor-move`}
                    >
                        {/* Drag Handle */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="w-4 h-4 text-gray-500" />
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={() => onRemove(index)}
                            className="absolute right-2 top-2 p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="pl-6">
                            {children(item, index)}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>

            {!hideTitle && onAdd && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onAdd}
                    className="w-full border-gray-700 hover:border-purple-500 hover:text-purple-400"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {title?.slice(0, -1) || 'Item'}
                </Button>
            )}
        </div>
    );
}

// Main ResumeEditor Component
export default function ResumeEditor({
    resumeData: initialData,
    onUpdate,
    onPDFUpload,
    layout = "comfortable",
    template = "modern"
}) {
    const [formData, setFormData] = useState(() => {
        // Convert to flexible format if needed
        if (initialData) {
            const converted = !initialData.personal ? convertToFlexibleFormat(initialData) : initialData;
            return converted;
        }
        return getEmptyResumeData();
    });

    // Use refs to track state without causing re-renders
    const isInitialMount = useRef(true);
    const isUpdatingFromParent = useRef(false);
    const pendingParentUpdate = useRef(false);
    const formDataRef = useRef(formData);

    // Update ref when formData changes
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    // Handle parent updates separately from local changes
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (initialData) {
            // Mark that we're updating from parent to avoid feedback loop
            isUpdatingFromParent.current = true;

            const newData = !initialData.personal ? convertToFlexibleFormat(initialData) : initialData;

            setFormData(prevData => {
                // Only update if data has changed
                if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
                    return newData;
                }
                return prevData;
            });

            // Reset the flag after a short delay
            setTimeout(() => {
                isUpdatingFromParent.current = false;
            }, 100);
        }
    }, [initialData]);

    // Notify parent of changes, but only if they came from user interaction
    useEffect(() => {
        if (isInitialMount.current) return;
        if (isUpdatingFromParent.current) return;

        if (pendingParentUpdate.current && onUpdate) {
            const timeoutId = setTimeout(() => {
                onUpdate(formDataRef.current);
                pendingParentUpdate.current = false;
            }, 300); // Debounce updates

            return () => clearTimeout(timeoutId);
        }
    }, [formData, onUpdate]);

    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: false,
        languages: false,
        publications: false,
        awards: false,
        volunteering: false,
        interests: false,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [autoSaveStatus, setAutoSaveStatus] = useState(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const { uploadResume, isLoading: isUploading } = useUploadResume();
    const { mutate: createResume, isLoading: isCreating } = useCreateResume();
    const { user, isAuthenticated } = useAuth();
    const { toast } = useToast();
    const autoSaveTimer = useRef(null);

    // Auto-save functionality
    useEffect(() => {
        if (!unsavedChanges) return;

        if (autoSaveTimer.current) {
            clearTimeout(autoSaveTimer.current);
        }

        autoSaveTimer.current = setTimeout(() => {
            handleAutoSave();
        }, 2000);

        return () => {
            if (autoSaveTimer.current) {
                clearTimeout(autoSaveTimer.current);
            }
        };
    }, [formData, unsavedChanges]);

    const handleAutoSave = async () => {
        setAutoSaveStatus('saving');
        // Auto-save implementation
        setTimeout(() => {
            setAutoSaveStatus('saved');
            setTimeout(() => setAutoSaveStatus(null), 2000);
        }, 1000);
    };

    const handleChange = useCallback((section, field, value) => {
        setFormData(prev => {
            let newData;
            if (section === 'personal') {
                newData = {
                    ...prev,
                    personal: { ...prev.personal, [field]: value }
                };
            } else if (section === 'summary') {
                newData = {
                    ...prev,
                    summary: { ...prev.summary, [field]: value }
                };
            } else if (section === 'skills') {
                newData = {
                    ...prev,
                    skills: { ...prev.skills, [field]: value }
                };
            } else {
                newData = {
                    ...prev,
                    [section]: value
                };
            }

            setUnsavedChanges(true);
            pendingParentUpdate.current = true;

            return newData;
        });

        setTouchedFields(prev => ({ ...prev, [`${section}.${field}`]: true }));

        // Validate
        const validation = validateResumeData(formData);
        if (!validation.isValid) {
            const errors = {};
            validation.errors.forEach(err => {
                errors[err.field] = err.message;
            });
            setValidationErrors(errors);
        }
    }, []);

    const handleArrayChange = useCallback((section, index, field, value) => {
        setFormData(prev => {
            const updated = [...(prev[section] || [])];
            if (!updated[index]) {
                updated[index] = {};
            }
            updated[index] = {
                ...updated[index],
                [field]: value
            };
            const newData = { ...prev, [section]: updated };

            setUnsavedChanges(true);
            pendingParentUpdate.current = true;

            return newData;
        });
    }, []);

    const addArrayItem = useCallback((section, defaultItem) => {
        setFormData(prev => {
            const newItem = { ...defaultItem, id: generateId() };
            const newData = {
                ...prev,
                [section]: [...(prev[section] || []), newItem]
            };

            setUnsavedChanges(true);
            pendingParentUpdate.current = true;

            toast({
                title: `✨ Added new ${section.slice(0, -1)}`,
                description: "You can now fill in the details.",
            });

            return newData;
        });
    }, [toast]);

    const removeArrayItem = useCallback((section, index) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [section]: (prev[section] || []).filter((_, i) => i !== index)
            };

            setUnsavedChanges(true);
            pendingParentUpdate.current = true;

            toast({
                title: "🗑️ Item removed",
                description: "The item has been removed.",
            });

            return newData;
        });
    }, [toast]);

    const moveArrayItem = useCallback((section, fromIndex, toIndex) => {
        setFormData(prev => {
            const updated = [...(prev[section] || [])];
            const [movedItem] = updated.splice(fromIndex, 1);
            updated.splice(toIndex, 0, movedItem);
            const newData = { ...prev, [section]: updated };

            setUnsavedChanges(true);
            pendingParentUpdate.current = true;

            return newData;
        });
    }, []);

    const handleFileUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast({
                title: "❌ Invalid File",
                description: "Please select a PDF file.",
                variant: "destructive",
            });
            return;
        }

        if (!user?.id) {
            toast({
                title: "❌ Upload Failed",
                description: "Please log in to upload resumes.",
                variant: "destructive",
            });
            return;
        }

        try {
            console.log('📤 Uploading PDF:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');

            const result = await uploadResume(file, user.id);

            console.log('📥 Upload result:', result);

            if (!result) {
                throw new Error('No response from server');
            }

            // Check if any fields need attention
            const missingFields = [];
            if (!result.email) missingFields.push('email');
            if (!result.phone) missingFields.push('phone');
            if (!result.location) missingFields.push('location');

            if (missingFields.length > 0) {
                toast({
                    title: "⚠️ Some Information Missing",
                    description: `${missingFields.join(', ')} not found in PDF. You can fill them manually.`,
                    variant: "default",
                });
            }

            // Use the imported database converter function
            const flexibleData = convertDatabaseToFlexibleFormat(result);

            // Mark that we're updating from parent to avoid feedback loop
            isUpdatingFromParent.current = true;

            setFormData(flexibleData);
            setUnsavedChanges(true);

            // Reset the flag
            setTimeout(() => {
                isUpdatingFromParent.current = false;
            }, 100);

            // Notify parent separately if needed
            if (onPDFUpload) {
                onPDFUpload(result);
            }

            toast({
                title: "✅ PDF Uploaded",
                description: "Resume parsed successfully. Please review the extracted information.",
            });

            // Clear the file input
            e.target.value = '';

        } catch (error) {
            console.error('❌ Upload failed:', error);
            toast({
                title: "❌ Upload Failed",
                description: error?.message || "Failed to parse PDF. Make sure the backend is running.",
                variant: "destructive",
            });
        }
    }, [uploadResume, user, onPDFUpload, toast]);

    // In ResumeEditor.jsx - Update the handleSave function

    const handleSave = async () => {
        // Validate before saving
        const validation = validateResumeData(formData);
        if (!validation.isValid) {
            toast({
                title: "❌ Validation Failed",
                description: "Please fix the errors before saving.",
                variant: "destructive",
            });
            return;
        }

        setAutoSaveStatus('saving');

        try {
            // First, clean up URLs to ensure they're valid
            const cleanedFormData = JSON.parse(JSON.stringify(formData)); // Deep clone

            // Clean URLs in personal section
            if (cleanedFormData.personal) {
                // Function to validate and clean URL
                const cleanUrl = (url) => {
                    if (!url || url.trim() === '') return '';

                    // Remove any whitespace
                    let cleaned = url.trim();

                    // If it's already a valid URL, return it
                    try {
                        new URL(cleaned);
                        return cleaned;
                    } catch {
                        // Not a valid URL, try to fix it
                        if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
                            cleaned = 'https://' + cleaned;
                        }

                        // Try again
                        try {
                            new URL(cleaned);
                            return cleaned;
                        } catch {
                            // Still invalid, return empty string
                            return '';
                        }
                    }
                };

                // Clean each URL field
                cleanedFormData.personal.portfolio_url = cleanUrl(cleanedFormData.personal.portfolio_url);
                cleanedFormData.personal.linkedin_url = cleanUrl(cleanedFormData.personal.linkedin_url);
                cleanedFormData.personal.github_url = cleanUrl(cleanedFormData.personal.github_url);
            }

            // Clean URLs in projects
            if (cleanedFormData.projects && Array.isArray(cleanedFormData.projects)) {
                cleanedFormData.projects = cleanedFormData.projects.map(project => ({
                    ...project,
                    url: project.url ? cleanUrl(project.url) : ''
                }));
            }

            // Clean URLs in certifications
            if (cleanedFormData.certifications && Array.isArray(cleanedFormData.certifications)) {
                cleanedFormData.certifications = cleanedFormData.certifications.map(cert => ({
                    ...cert,
                    url: cert.url ? cleanUrl(cert.url) : ''
                }));
            }

            const oldFormatData = convertToOldFormat(cleanedFormData);

            // Remove any fields that might cause issues
            const { resume_id, id, ...cleanData } = oldFormatData;

            // Ensure all URL fields are either valid URLs or empty strings
            const urlFields = ['portfolio_url', 'linkedin_url', 'github_url',];
            urlFields.forEach(field => {
                if (cleanData[field] && typeof cleanData[field] === 'string') {
                    try {
                        new URL(cleanData[field]);
                    } catch {
                        // If invalid, set to empty string
                        cleanData[field] = '';
                    }
                }
            });

            const resumeToSave = {
                ...cleanData,
                resume_title: cleanData.resume_title || `${cleanData.full_name || 'Untitled'}'s Resume`,
                template: template || 'modern',
            };

            console.log('Saving resume with cleaned URLs:', resumeToSave);

            // Call your API to save
            const result = await createResume(resumeToSave);

            if (result) {
                setAutoSaveStatus('saved');
                setUnsavedChanges(false);

                toast({
                    title: "✅ Saved",
                    description: "Your resume has been saved successfully.",
                });
            }

            setTimeout(() => setAutoSaveStatus(null), 2000);
        } catch (error) {
            console.error('Save error:', error);
            setAutoSaveStatus('error');
            toast({
                title: "❌ Save Failed",
                description: error.message || "Could not save your resume.",
                variant: "destructive",
            });
        }
    };

    const toggleSection = useCallback((section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }, []);

    // Input classes based on layout
    const inputClasses = layout === 'compact'
        ? "w-full p-2 bg-gray-800/50 rounded border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors text-sm"
        : "w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-colors";

    const sectionClasses = layout === 'compact'
        ? "space-y-3"
        : "space-y-4";

    // Section icons mapping
    const sectionIcons = {
        personal: User,
        summary: FileText,
        experience: Briefcase,
        education: GraduationCap,
        skills: Zap,
        projects: Rocket,
        certifications: Award,
        languages: Languages,
        publications: BookOpen,
        awards: Trophy,
        volunteering: Heart,
        interests: Target,
    };

    // Auto-save indicator
    const AutoSaveIndicator = () => {
        if (!autoSaveStatus) return null;

        const indicators = {
            saving: { icon: RefreshCw, text: '', className: 'text-yellow-400 animate-spin' },
            saved: { icon: CheckCircle, text: 'All changes saved', className: 'text-green-400' },
            error: { icon: AlertTriangle, text: 'Save failed', className: 'text-red-400' },
        };

        const { icon: Icon, text, className } = indicators[autoSaveStatus];

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-sm"
            >
                <Icon className={`w-4 h-4 ${autoSaveStatus === 'saving' ? 'animate-spin' : ''} ${className}`} />
                <span className={className}>{text}</span>
            </motion.div>
        );
    };

    const isValidUrl = (url) => {
        if (!url || typeof url !== 'string') return false;

        const trimmedUrl = url.trim();
        if (!trimmedUrl) return false;

        try {
            if (!/^https?:\/\//i.test(trimmedUrl)) {
                return false;
            }
            const urlObj = new URL(trimmedUrl);
            const hostname = urlObj.hostname;
            return hostname && hostname.length >= 3 && hostname.includes('.');
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-linear-to-b from-gray-900 to-gray-800">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Resume Editor
                        </h2>
                        <AutoSaveIndicator />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSave}
                            disabled={!unsavedChanges || isCreating}
                            className="border-gray-700 hover:border-purple-500"
                        >
                            {isCreating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* PDF Upload Section */}
                    <Section
                        title="Upload Resume"
                        icon={FileUp}
                        expanded={true}
                        onToggle={() => { }}
                    >
                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="w-full p-3 bg-gray-800/50 rounded-lg border border-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                />

                                <AnimatePresence>
                                    {isUploading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute right-3 top-3"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-purple-400">Processing...</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {!isAuthenticated && (
                                <div className="flex items-start gap-2 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-yellow-400">
                                        Please log in to upload resumes.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-start gap-2 text-xs text-gray-400">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Upload your PDF resume to automatically fill all fields below. Supported: Single-page PDF resumes with clear text.</p>
                            </div>
                        </div>
                    </Section>

                    {/* Personal Information */}
                    <Section
                        title="Personal Information"
                        icon={User}
                        expanded={expandedSections.personal}
                        onToggle={() => toggleSection('personal')}
                    >
                        <div className={sectionClasses}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.personal?.full_name || ''}
                                        onChange={(e) => handleChange('personal', 'full_name', e.target.value)}
                                        className={`${inputClasses} ${touchedFields['personal.full_name'] && !formData.personal?.full_name
                                            ? 'border-red-500'
                                            : ''
                                            }`}
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Professional Headline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.personal?.job_title || ''}
                                        onChange={(e) => handleChange('personal', 'job_title', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Full Stack Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Professional Sub Headline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.personal?.headline || ''}
                                        onChange={(e) => handleChange('personal', 'headline', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Full Stack Developer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        Email <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="email"
                                            value={formData.personal?.email || ''}
                                            onChange={(e) => handleChange('personal', 'email', e.target.value)}
                                            className={`${inputClasses} pl-10 ${validationErrors['personal.email'] ? 'border-red-500' : ''
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    {validationErrors['personal.email'] && (
                                        <p className="mt-1 text-xs text-red-400">{validationErrors['personal.email']}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="tel"
                                            value={formData.personal?.phone || ''}
                                            onChange={(e) => handleChange('personal', 'phone', e.target.value)}
                                            className={`${inputClasses} pl-10`}
                                            placeholder="+1 (123) 456-7890"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-300">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.personal?.location || ''}
                                        onChange={(e) => handleChange('personal', 'location', e.target.value)}
                                        className={`${inputClasses} pl-10`}
                                        placeholder="New York, NY"
                                    />
                                </div>
                            </div>

                            {/* Display Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Portfolio Display Name</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.personal?.portfolio_display || ''}
                                            onChange={(e) => handleChange('personal', 'portfolio_display', e.target.value)}
                                            className={`${inputClasses} pl-10`}
                                            placeholder="My Portfolio"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">LinkedIn Display Name</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.personal?.linkedin_display || ''}
                                            onChange={(e) => handleChange('personal', 'linkedin_display', e.target.value)}
                                            className={`${inputClasses} pl-10`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">GitHub Display Name</label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            value={formData.personal?.github_display || ''}
                                            onChange={(e) => handleChange('personal', 'github_display', e.target.value)}
                                            className={`${inputClasses} pl-10`}
                                            placeholder="johndoe"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* URL Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">Portfolio URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="url"
                                            value={formData.personal?.portfolio_url || ''}
                                            onChange={(e) => {
                                                handleChange('personal', 'portfolio_url', e.target.value);
                                            }}
                                            onBlur={(e) => {
                                                let value = e.target.value;
                                                if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                                                    // Auto-add https://
                                                    handleChange('personal', 'portfolio_url', `https://${value}`);
                                                }
                                            }}
                                            className={`${inputClasses} pl-10 ${formData.personal?.portfolio_url &&
                                                !isValidUrl(formData.personal?.portfolio_url) ? 'border-yellow-500' : ''
                                                }`}
                                            placeholder="https://johndoe.com"
                                        />
                                        {formData.personal?.portfolio_url && !isValidUrl(formData.personal?.portfolio_url) && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        )}
                                    </div>
                                    {formData.personal?.portfolio_url && !isValidUrl(formData.personal?.portfolio_url) && (
                                        <p className="mt-1 text-xs text-yellow-500">
                                            Please enter a valid URL (e.g., https://example.com)
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        LinkedIn URL
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="url"
                                            value={formData.personal?.linkedin_url || ''}
                                            onChange={(e) => {
                                                handleChange('personal', 'linkedin_url', e.target.value);
                                            }}
                                            onBlur={(e) => {
                                                let value = e.target.value;
                                                if (
                                                    value &&
                                                    !value.startsWith('http://') &&
                                                    !value.startsWith('https://')
                                                ) {
                                                    handleChange('personal', 'linkedin_url', `https://${value}`);
                                                }
                                            }}
                                            className={`${inputClasses} pl-10 ${formData.personal?.linkedin_url &&
                                                !isValidUrl(formData.personal?.linkedin_url)
                                                ? 'border-yellow-500'
                                                : ''
                                                }`}
                                            placeholder="https://linkedin.com/in/johndoe"
                                        />
                                        {formData.personal?.linkedin_url &&
                                            !isValidUrl(formData.personal?.linkedin_url) && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                </div>
                                            )}
                                    </div>

                                    {formData.personal?.linkedin_url &&
                                        !isValidUrl(formData.personal?.linkedin_url) && (
                                            <p className="mt-1 text-xs text-yellow-500">
                                                Please enter a valid URL (e.g., https://linkedin.com/in/username)
                                            </p>
                                        )}
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-300">
                                        GitHub URL
                                    </label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input
                                            type="url"
                                            value={formData.personal?.github_url || ''}
                                            onChange={(e) => {
                                                handleChange('personal', 'github_url', e.target.value);
                                            }}
                                            onBlur={(e) => {
                                                let value = e.target.value;
                                                if (
                                                    value &&
                                                    !value.startsWith('http://') &&
                                                    !value.startsWith('https://')
                                                ) {
                                                    handleChange('personal', 'github_url', `https://${value}`);
                                                }
                                            }}
                                            className={`${inputClasses} pl-10 ${formData.personal?.github_url &&
                                                !isValidUrl(formData.personal?.github_url)
                                                ? 'border-yellow-500'
                                                : ''
                                                }`}
                                            placeholder="https://github.com/johndoe"
                                        />
                                        {formData.personal?.github_url &&
                                            !isValidUrl(formData.personal?.github_url) && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                                </div>
                                            )}
                                    </div>

                                    {formData.personal?.github_url &&
                                        !isValidUrl(formData.personal?.github_url) && (
                                            <p className="mt-1 text-xs text-yellow-500">
                                                Please enter a valid URL (e.g., https://github.com/username)
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Help text */}
                            <div className="flex items-start gap-2 p-3 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-400">
                                    URLs will automatically get https:// if you forget to add it. Make sure to include the full URL for proper linking.
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* Professional Summary */}
                    <Section
                        title="Professional Summary"
                        icon={FileText}
                        expanded={expandedSections.summary}
                        onToggle={() => toggleSection('summary')}
                    >
                        <div>
                            <RichTextEditor
                                value={formData.summary?.summary || ''}
                                onChange={(value) => handleChange('summary', 'summary', value)}
                                placeholder="Describe your professional background, skills, and career objectives..."
                                rows={layout === 'compact' ? 4 : 6}
                            />
                            <div className="mt-1 text-xs text-gray-500 text-right">
                                {formData.summary?.summary?.length || 0} characters
                            </div>
                        </div>
                    </Section>

                    {/* Experience Section */}
                    <Section
                        title="Work Experience"
                        icon={Briefcase}
                        expanded={expandedSections.experience}
                        onToggle={() => toggleSection('experience')}
                    >
                        <DynamicSection
                            items={formData.experience || []}
                            onAdd={() => addArrayItem('experience', {
                                title: '',
                                company: '',
                                location: '',
                                start_date: '',
                                end_date: '',
                                current: false,
                                description: '',
                                achievements: []
                            })}
                            onRemove={(index) => removeArrayItem('experience', index)}
                            onMove={(from, to) => moveArrayItem('experience', from, to)}
                            layout={layout}
                        >
                            {(item, index) => (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={item.title || ''}
                                            onChange={(e) => handleArrayChange('experience', index, 'title', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Job Title *"
                                        />
                                        <input
                                            type="text"
                                            value={item.company || ''}
                                            onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Company *"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={item.location || ''}
                                        onChange={(e) => handleArrayChange('experience', index, 'location', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Location"
                                    />

                                    <DateRangePicker
                                        startDate={item.start_date || ''}
                                        endDate={item.end_date || ''}
                                        current={item.current || false}
                                        onChange={(field, value) => handleArrayChange('experience', index, field, value)}
                                    />

                                    <RichTextEditor
                                        value={item.description || ''}
                                        onChange={(value) => handleArrayChange('experience', index, 'description', value)}
                                        placeholder="Describe your responsibilities and achievements..."
                                        rows={3}
                                    />

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-400">
                                            Key Achievements
                                        </label>
                                        <SkillInput
                                            skills={item.achievements || []}
                                            onChange={(newAchievements) =>
                                                handleArrayChange('experience', index, 'achievements', newAchievements)
                                            }
                                            category="soft"
                                        />
                                    </div>
                                </div>
                            )}
                        </DynamicSection>
                    </Section>

                    {/* Education Section */}
                    <Section
                        title="Education"
                        icon={GraduationCap}
                        expanded={expandedSections.education}
                        onToggle={() => toggleSection('education')}
                    >
                        <DynamicSection
                            items={formData.education || []}
                            onAdd={() => addArrayItem('education', {
                                degree: '',
                                institution: '',
                                location: '',
                                start_date: '',
                                end_date: '',
                                current: false,
                                grade: '',
                                description: ''
                            })}
                            onRemove={(index) => removeArrayItem('education', index)}
                            onMove={(from, to) => moveArrayItem('education', from, to)}
                            layout={layout}
                        >
                            {(item, index) => (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            value={item.degree || ''}
                                            onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Degree *"
                                        />
                                        <input
                                            type="text"
                                            value={item.institution || ''}
                                            onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                            className={inputClasses}
                                            placeholder="Institution *"
                                        />
                                    </div>

                                    <input
                                        type="text"
                                        value={item.location || ''}
                                        onChange={(e) => handleArrayChange('education', index, 'location', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Location"
                                    />

                                    <DateRangePicker
                                        startDate={item.start_date || ''}
                                        endDate={item.end_date || ''}
                                        current={item.current || false}
                                        onChange={(field, value) => handleArrayChange('education', index, field, value)}
                                    />

                                    <input
                                        type="text"
                                        value={item.grade || ''}
                                        onChange={(e) => handleArrayChange('education', index, 'grade', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Grade/GPA"
                                    />

                                    <RichTextEditor
                                        value={item.description || ''}
                                        onChange={(value) => handleArrayChange('education', index, 'description', value)}
                                        placeholder="Additional details..."
                                        rows={2}
                                    />
                                </div>
                            )}
                        </DynamicSection>
                    </Section>

                    {/* Skills Section */}
                    <Section
                        title="Skills"
                        icon={Zap}
                        expanded={expandedSections.skills}
                        onToggle={() => toggleSection('skills')}
                    >
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Technical Skills</h4>
                                <SkillInput
                                    skills={formData.skills?.technical || []}
                                    onChange={(newSkills) =>
                                        handleChange('skills', 'technical', newSkills)
                                    }
                                    category="technical"
                                />
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Soft Skills</h4>
                                <SkillInput
                                    skills={formData.skills?.soft || []}
                                    onChange={(newSkills) =>
                                        handleChange('skills', 'soft', newSkills)
                                    }
                                    category="soft"
                                />
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-gray-300 mb-3">Languages</h4>
                                <SkillInput
                                    skills={formData.skills?.languages || []}
                                    onChange={(newSkills) =>
                                        handleChange('skills', 'languages', newSkills)
                                    }
                                    category="languages"
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Projects Section */}
                    <Section
                        title="Projects"
                        icon={Rocket}
                        expanded={expandedSections.projects}
                        onToggle={() => toggleSection('projects')}
                    >
                        <DynamicSection
                            items={formData.projects || []}
                            onAdd={() => addArrayItem('projects', {
                                name: '',
                                description: '',
                                technologies: [],
                                url: '',
                                start_date: '',
                                end_date: '',
                                current: false,
                                highlights: []
                            })}
                            onRemove={(index) => removeArrayItem('projects', index)}
                            onMove={(from, to) => moveArrayItem('projects', from, to)}
                            layout={layout}
                        >
                            {(item, index) => (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={item.name || ''}
                                        onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Project Name *"
                                    />

                                    <RichTextEditor
                                        value={item.description || ''}
                                        onChange={(value) => handleArrayChange('projects', index, 'description', value)}
                                        placeholder="Describe the project..."
                                        rows={3}
                                    />

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-400">
                                            Technologies Used
                                        </label>
                                        <SkillInput
                                            skills={item.technologies || []}
                                            onChange={(newTech) =>
                                                handleArrayChange('projects', index, 'technologies', newTech)
                                            }
                                            category="technical"
                                        />
                                    </div>

                                    <input
                                        type="url"
                                        value={item.url || ''}
                                        onChange={(e) => handleArrayChange('projects', index, 'url', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Project URL"
                                    />

                                    <DateRangePicker
                                        startDate={item.start_date || ''}
                                        endDate={item.end_date || ''}
                                        current={item.current || false}
                                        onChange={(field, value) => handleArrayChange('projects', index, field, value)}
                                    />
                                </div>
                            )}
                        </DynamicSection>
                    </Section>

                    {/* Additional Sections (collapsed by default) */}
                    <Section
                        title="Certifications"
                        icon={Award}
                        expanded={expandedSections.certifications}
                        onToggle={() => toggleSection('certifications')}
                    >
                        <DynamicSection
                            items={formData.certifications || []}
                            onAdd={() => addArrayItem('certifications', {
                                name: '',
                                issuer: '',
                                date: '',
                                url: '',
                                credential_id: '',
                                description: ''
                            })}
                            onRemove={(index) => removeArrayItem('certifications', index)}
                            layout={layout}
                            hideTitle
                        >
                            {(item, index) => (
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={item.name || ''}
                                        onChange={(e) => handleArrayChange('certifications', index, 'name', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Certification Name"
                                    />
                                    <input
                                        type="text"
                                        value={item.issuer || ''}
                                        onChange={(e) => handleArrayChange('certifications', index, 'issuer', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Issuing Organization"
                                    />
                                    <input
                                        type="month"
                                        value={item.date || ''}
                                        onChange={(e) => handleArrayChange('certifications', index, 'date', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Issue Date"
                                    />
                                    <input
                                        type="url"
                                        value={item.url || ''}
                                        onChange={(e) => handleArrayChange('certifications', index, 'url', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Credential URL"
                                    />
                                </div>
                            )}
                        </DynamicSection>
                    </Section>

                    <Section
                        title="Languages"
                        icon={Languages}
                        expanded={expandedSections.languages}
                        onToggle={() => toggleSection('languages')}
                    >
                        <DynamicSection
                            items={formData.languages || []}
                            onAdd={() => addArrayItem('languages', {
                                language: '',
                                proficiency: 'fluent'
                            })}
                            onRemove={(index) => removeArrayItem('languages', index)}
                            layout={layout}
                            hideTitle
                        >
                            {(item, index) => (
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={item.language || ''}
                                        onChange={(e) => handleArrayChange('languages', index, 'language', e.target.value)}
                                        className={inputClasses}
                                        placeholder="Language"
                                    />
                                    <select
                                        value={item.proficiency || 'fluent'}
                                        onChange={(e) => handleArrayChange('languages', index, 'proficiency', e.target.value)}
                                        className={inputClasses}
                                    >
                                        <option value="native">Native</option>
                                        <option value="fluent">Fluent</option>
                                        <option value="professional">Professional</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="basic">Basic</option>
                                    </select>
                                </div>
                            )}
                        </DynamicSection>
                    </Section>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}