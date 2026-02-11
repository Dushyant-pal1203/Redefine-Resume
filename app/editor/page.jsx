'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Palette, Save, Printer } from "lucide-react";
import ResumeEditor from '@/components/ResumeEditor';
import LivePreview from '@/components/LivePreview';
import { ArrowLeft } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export default function EditorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const [template] = useState('modern');
    const [isLoading, setIsLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Check for data in URL (from HeroSection upload)
    useEffect(() => {
        const dataParam = searchParams.get('data');
        if (dataParam) {
            try {
                const parsedData = JSON.parse(decodeURIComponent(dataParam));
                console.log('📥 Data from URL:', parsedData);

                // Ensure all arrays are properly formatted
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

        // Process the parsed data to ensure proper structure
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

        // Fill empty arrays with at least one empty item
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
        setIsLoading(true);
        setSaveMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(resumeData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            console.log('💾 Saved successfully:', data);
            setSaveMessage('✅ Resume saved successfully!');

            // Clear message after 3 seconds
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('❌ Save failed:', error);
            setSaveMessage('❌ Error saving resume. Please check server connection.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle print/PDF
    const [title, setTitle] = useState("My Resume");
    const printRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: title || "Resume",
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
                                    className="hidden md:flex text-slate-400  hover:bg-transparent group"
                                >
                                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform hover:text-black" />
                                </Button>
                            </a>
                            <Separator
                                orientation="vertical"
                                className="h-6 hidden md:flex bg-slate-700"
                            />
                            <div className="flex items-center gap-4">
                                {/* <h1 className="text-2xl font-bold text-gray-800">Resume Builder</h1> */}

                                <input
                                    type="text"
                                    className="px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                                    placeholder="Resume Title"
                                />
                            </div>
                            {/* Template Selector */}
                            <div className="hidden md:flex items-center gap-2">
                                <Palette className="w-4 h-4 text-gray-500" />
                                <select
                                    className="px-3 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 bg-transparent"
                                    defaultValue=""
                                    onChange={(e) => {
                                        console.log("Selected template:", e.target.value);
                                    }}
                                >
                                    <option value="" disabled>
                                        Select template
                                    </option>
                                    <option value="template1">Template 1</option>
                                    <option value="template2">Template 2</option>
                                    <option value="template3">Template 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between flex-1">
                            {/* Viewport Controls - Desktop */}
                            <div className="hidden md:flex items-center gap-1 bg-transparent p-1 rounded-lg">

                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <Button onClick={handleSave} variant="outline" size="sm" className="flex items-center border border-white justify-center rounded-md px-4 py-3 text-[14px] font-bold bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 group hover:text-black">
                                    <Save className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                                    Save
                                </Button>
                                <Button onClick={handlePrint} variant="default" size="sm" className="flex items-center border border-white justify-center rounded-md px-4 py-3 text-[14px] font-bold bg-linear-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 group hover:text-black">
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
                <div className="w-2/3">
                    <LivePreview
                        resumeData={resumeData}
                        template={template}
                    />
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                            Saving...
                        </>
                    ) : (
                        '💾 Save Resume'
                    )}
                </button>

                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="fixed top-6 left-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-gray-700"
                >
                    ← Back to Home
                </button>

                {/* Save Message */}
                {saveMessage && (
                    <div className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${saveMessage.includes('✅') ? 'bg-green-900/90 border border-green-700' : 'bg-red-900/90 border border-red-700'
                        } text-white backdrop-blur-sm`}>
                        {saveMessage.includes('✅') ? '✅' : '❌'}
                        {saveMessage.replace('✅', '').replace('❌', '')}
                    </div>
                )}

                {/* Status Indicator */}
                <div className="fixed bottom-6 left-6 bg-gray-800/80 backdrop-blur-sm text-gray-300 text-sm px-3 py-2 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${saveMessage.includes('✅') ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <span>Auto-save: {saveMessage.includes('✅') ? 'Saved' : 'Ready'}</span>
                    </div>
                </div>
            </div>
        </>
    );
}