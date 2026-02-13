'use client';

import { useState, useEffect } from 'react';
import { FileUp } from "lucide-react";
import { useUploadResume } from "@/hooks/use-resumes";

export default function ResumeEditor({ resumeData, onUpdate, onPDFUpload }) {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        professional_summary: '',
        experience: [{ company: '', position: '', duration: '' }],
        education: [{ institution: '', degree: '', year: '' }],
        skills: [''],
        projects: [{ name: '', description: '', technologies: '' }]
    });

    const { mutate: uploadResume, isLoading: isUploading } = useUploadResume();

    // Update form when resumeData changes
    useEffect(() => {
        console.log('🔄 ResumeEditor received new data');
        if (resumeData) {
            setFormData({
                full_name: resumeData.full_name || '',
                email: resumeData.email || '',
                phone: resumeData.phone || '',
                location: resumeData.location || '',
                professional_summary: resumeData.professional_summary || '',
                experience: Array.isArray(resumeData.experience) && resumeData.experience.length > 0
                    ? resumeData.experience
                    : [{ company: '', position: '', duration: '' }],
                education: Array.isArray(resumeData.education) && resumeData.education.length > 0
                    ? resumeData.education
                    : [{ institution: '', degree: '', year: '' }],
                skills: Array.isArray(resumeData.skills) && resumeData.skills.length > 0
                    ? resumeData.skills
                    : [''],
                projects: Array.isArray(resumeData.projects) && resumeData.projects.length > 0
                    ? resumeData.projects
                    : [{ name: '', description: '', technologies: '' }]
            });
        }
    }, [resumeData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = {
            ...formData,
            [name]: value
        };
        setFormData(updated);
        onUpdate(updated);
    };

    const handleArrayChange = (section, index, field, value) => {
        const updated = [...formData[section]];
        if (!updated[index]) {
            updated[index] = {};
        }
        updated[index] = {
            ...updated[index],
            [field]: value
        };
        const newFormData = {
            ...formData,
            [section]: updated
        };
        setFormData(newFormData);
        onUpdate(newFormData);
    };

    const handleSkillsChange = (index, value) => {
        const updated = [...formData.skills];
        updated[index] = value;
        const newFormData = {
            ...formData,
            skills: updated.filter(skill => skill.trim() !== '')
        };
        setFormData(newFormData);
        onUpdate(newFormData);
    };

    const addArrayItem = (section, defaultItem) => {
        const newFormData = {
            ...formData,
            [section]: [...formData[section], defaultItem]
        };
        setFormData(newFormData);
        onUpdate(newFormData);
    };

    const removeArrayItem = (section, index) => {
        const updated = formData[section].filter((_, i) => i !== index);
        const newFormData = {
            ...formData,
            [section]: updated.length > 0 ? updated : [section === 'skills' ? '' : {}]
        };
        setFormData(newFormData);
        onUpdate(newFormData);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please select a PDF file');
            return;
        }

        try {
            console.log('📤 Uploading PDF using hook...');
            const response = await uploadResume(file);

            if (response?.data) {
                console.log('✅ PDF parsed successfully:', response.data);
                onPDFUpload(response.data);
            } else if (response?.success && response?.data) {
                console.log('✅ PDF parsed successfully:', response.data);
                onPDFUpload(response.data);
            } else {
                throw new Error('Invalid response format from server');
            }

            // Reset file input
            e.target.value = '';
        } catch (error) {
            console.error('❌ Upload failed:', error);
            alert(`Failed to parse PDF: ${error.message}\n\nMake sure the backend server is running`);
        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-900 text-white p-6">
            <h2 className="text-3xl font-bold mb-6 text-white">Resume Editor</h2>

            {/* PDF Upload Section */}
            <div className="mb-8 bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2"><FileUp className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" /></span>
                    Upload PDF Resume
                </h3>
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {isUploading && (
                            <div className="absolute right-3 top-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-400"></div>
                            </div>
                        )}
                    </div>

                    {isUploading && (
                        <div className="text-blue-400 text-center py-2">
                            Parsing PDF... This may take a few seconds
                        </div>
                    )}

                    <div className="text-gray-400 text-sm space-y-2">
                        <p>• Upload your resume PDF to automatically fill all fields below</p>
                        <p>• Supported: Single-page PDF resumes with clear text</p>
                        <p className="text-yellow-400">• Make sure backend server is running</p>
                    </div>
                </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Personal Information
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 text-gray-300">Full Name *</label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-300">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            placeholder="john@example.com"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-300">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            placeholder="+1 (123) 456-7890"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-300">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            placeholder="New York, NY"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-gray-300">Professional Summary *</label>
                        <textarea
                            name="professional_summary"
                            value={formData.professional_summary}
                            onChange={handleChange}
                            rows={6}
                            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y"
                            placeholder="Describe your professional background, skills, and career objectives..."
                        />
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="mr-2">💼</span>
                        Experience
                    </h3>
                    <button
                        onClick={() => addArrayItem('experience', { company: '', position: '', duration: '' })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                        + Add Experience
                    </button>
                </div>

                {formData.experience.map((exp, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-700 rounded border border-gray-600">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-300">Experience #{index + 1}</h4>
                            <button
                                onClick={() => removeArrayItem('experience', index)}
                                className="text-red-400 hover:text-red-300 text-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Company Name"
                                value={exp.company || ''}
                                onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Position/Role"
                                value={exp.position || ''}
                                onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Duration (e.g., Jan 2020 - Present)"
                                value={exp.duration || ''}
                                onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="mr-2">🎓</span>
                        Education
                    </h3>
                    <button
                        onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                        + Add Education
                    </button>
                </div>

                {formData.education.map((edu, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-700 rounded border border-gray-600">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-300">Education #{index + 1}</h4>
                            <button
                                onClick={() => removeArrayItem('education', index)}
                                className="text-red-400 hover:text-red-300 text-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Institution Name"
                                value={edu.institution || ''}
                                onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Degree/Program"
                                value={edu.degree || ''}
                                onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Year/GPA"
                                value={edu.year || ''}
                                onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Skills Section */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="mr-2">⚡</span>
                        Skills
                    </h3>
                    <button
                        onClick={() => addArrayItem('skills', '')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                        + Add Skill
                    </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map((skill, index) => (
                        skill !== '' && (
                            <div key={index} className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded border border-gray-600">
                                <input
                                    type="text"
                                    value={skill}
                                    onChange={(e) => handleSkillsChange(index, e.target.value)}
                                    className="bg-transparent border-none outline-none min-w-30 text-white"
                                    placeholder="Add skill"
                                />
                                <button
                                    onClick={() => removeArrayItem('skills', index)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        )
                    ))}
                </div>

                {formData.skills.filter(s => s !== '').length === 0 && (
                    <p className="text-gray-400 text-center py-4">No skills added yet. Click "Add Skill" to add your skills.</p>
                )}
            </div>

            {/* Projects Section */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center">
                        <span className="mr-2">🚀</span>
                        Projects
                    </h3>
                    <button
                        onClick={() => addArrayItem('projects', { name: '', description: '', technologies: '' })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                    >
                        + Add Project
                    </button>
                </div>

                {formData.projects.map((project, index) => (
                    <div key={index} className="mb-4 p-4 bg-gray-700 rounded border border-gray-600">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-300">Project #{index + 1}</h4>
                            <button
                                onClick={() => removeArrayItem('projects', index)}
                                className="text-red-400 hover:text-red-300 text-lg transition-colors"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={project.name || ''}
                                onChange={(e) => handleArrayChange('projects', index, 'name', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                            <textarea
                                placeholder="Project Description"
                                value={project.description || ''}
                                onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                                rows={3}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y"
                            />
                            <input
                                type="text"
                                placeholder="Technologies Used (comma separated)"
                                value={project.technologies || ''}
                                onChange={(e) => handleArrayChange('projects', index, 'technologies', e.target.value)}
                                className="w-full p-2 bg-gray-600 rounded border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}