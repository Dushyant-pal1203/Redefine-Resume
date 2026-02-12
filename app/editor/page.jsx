"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Save, Printer, ArrowLeft } from "lucide-react";
import ResumeEditor from '@/components/EditorSection/ResumeEditor';
import LivePreview from '@/components/EditorSection/LivePreview';
import { useReactToPrint } from "react-to-print";
import { useSaveResume } from "@/hooks/use-resumes";

function EditorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { mutate: saveResume, isLoading: isSaving } = useSaveResume();

    const [resumeData, setResumeData] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        professional_summary: 'Experienced Full Stack Developer with expertise in modern web technologies including React, Node.js, and MongoDB. Passionate about creating efficient, scalable web applications.',
        experience: [],
        education: [],
        skills: [],
        projects: []
    });

    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [saveMessage, setSaveMessage] = useState('');
    const [resumeId, setResumeId] = useState(null);

    // Check for data in URL (from HeroSection upload)
    useEffect(() => {
        const dataParam = searchParams.get('data');
        const templateParam = searchParams.get('template');
        const idParam = searchParams.get('resumeId');

        if (templateParam) {
            setSelectedTemplate(templateParam);
        }

        if (idParam) {
            setResumeId(idParam);
        }

        if (dataParam) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam));
                console.log('📥 Data from URL:', parsedData);

                const processedData = {
                    ...parsedData,
                    resume_id: idParam || parsedData.resume_id || parsedData.id,
                    experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
                    education: Array.isArray(parsedData.education) ? parsedData.education : [],
                    skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
                    projects: Array.isArray(parsedData.projects) ? parsedData.projects : []
                };

                setResumeData(processedData);
            } catch (error) {
                console.error('❌ Error parsing URL data:', error);
            }
        }
    }, [searchParams]);

    const handleUpdate = (data) => {
        setResumeData(data);
    };

    const handlePDFUpload = (parsedData) => {
        console.log('📄 PDF Upload - Parsed Data:', parsedData);

        const processedData = {
            full_name: parsedData.full_name || '',
            email: parsedData.email || '',
            phone: parsedData.phone || '',
            location: parsedData.location || '',
            professional_summary: parsedData.professional_summary || '',
            experience: Array.isArray(parsedData.experience) ? parsedData.experience : [],
            education: Array.isArray(parsedData.education) ? parsedData.education : [],
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
            projects: Array.isArray(parsedData.projects) ? parsedData.projects : []
        };

        if (processedData.experience.length === 0) {
            processedData.experience = [{ company: '', position: '', duration: '' }];
        }
        if (processedData.education.length === 0) {
            processedData.education = [{ institution: '', degree: '', year: '' }];
        }
        if (processedData.skills.length === 0) {
            processedData.skills = [''];
        }
        if (processedData.projects.length === 0) {
            processedData.projects = [{ name: '', description: '', technologies: '' }];
        }

        setResumeData(processedData);
    };

    const handleSave = async () => {
        setSaveMessage('');

        try {
            const dataToSave = {
                ...resumeData,
                template: selectedTemplate,
                resume_id: resumeId
            };

            const result = await saveResume(dataToSave);

            if (result.data?.resume_id) {
                setResumeId(result.data.resume_id);
            }

            setSaveMessage('✅ Resume saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('❌ Save failed:', error);
            setSaveMessage('❌ Error saving resume. Please check server connection.');
        }
    };

    const handleTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);
    };

    // Handle print/PDF
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "My Resume",
    });

    return (
        <>
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-2 flex-1">
                            <a href="/">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hidden md:flex text-slate-400 hover:bg-transparent group"
                                >
                                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform hover:text-black" />
                                </Button>
                            </a>
                            <Separator
                                orientation="vertical"
                                className="h-6 hidden md:flex bg-slate-700"
                            />
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    className="px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                    placeholder="Resume Title"
                                    defaultValue={resumeData.full_name ? `${resumeData.full_name}'s Resume` : 'My Resume'}
                                />
                            </div>
                            {/* Template Selector */}
                            <div className="hidden md:flex items-center gap-2">
                                <Palette className="w-4 h-4 text-gray-500" />
                                <select
                                    value={selectedTemplate}
                                    onChange={handleTemplateChange}
                                    className="px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-transparent"
                                >
                                    <option value="modern">Modern</option>
                                    <option value="minimal">Minimal</option>
                                    <option value="creative">Creative</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between flex-1">
                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-auto">
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center border border-white justify-center rounded-md px-4 py-3 text-[14px] font-bold bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 group hover:text-black"
                                    disabled={isSaving}
                                >
                                    <Save className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    onClick={handlePrint}
                                    variant="default"
                                    size="sm"
                                    className="flex items-center border border-white justify-center rounded-md px-4 py-3 text-[14px] font-bold bg-linear-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 group hover:text-black"
                                >
                                    <Printer className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                                    Print/PDF
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex h-screen bg-gray-900">
                {/* Left Panel - Editor */}
                <div className="w-1/3">
                    <ResumeEditor
                        resumeData={resumeData}
                        onUpdate={handleUpdate}
                        onPDFUpload={handlePDFUpload}
                    />
                </div>

                {/* Right Panel - Preview */}
                <div className="w-2/3" ref={printRef}>
                    <LivePreview
                        resumeData={resumeData}
                        template={selectedTemplate}
                    />
                </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
                <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${saveMessage.includes('✅') ? 'bg-green-900/90 border border-green-700' : 'bg-red-900/90 border border-red-700'
                    } text-white backdrop-blur-sm z-50`}>
                    {saveMessage}
                </div>
            )}
        </>
    );
}

export default function EditorPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EditorContent />
        </Suspense>
    );
}