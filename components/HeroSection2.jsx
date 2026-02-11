'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function HeroSection() {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const handlePDFUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        setIsUploading(true);
        setUploadError('');
        const formData = new FormData();
        formData.append('resume', file);

        try {
            console.log('📤 Uploading PDF...');
            const response = await axios.post('http://localhost:5000/api/upload/pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                console.log('✅ PDF parsed successfully');
                // Navigate to editor with parsed data
                router.push(`/editor?data=${encodeURIComponent(JSON.stringify(response.data.data))}`);
            } else {
                throw new Error(response.data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('❌ Upload failed:', error);
            setUploadError(error.message || 'Failed to upload PDF. Please check if the server is running.');
            alert('Upload failed: ' + (error.message || 'Server error'));
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500">
                        NEXT-GEN RESUME PLATFORM
                    </h1>
                    <h2 className="text-7xl font-bold mb-8">RESUME REDEFINED</h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Upload your PDF resume or start from scratch. Our AI instantly parses and formats your data.
                        <span className="block text-blue-400 font-semibold mt-2">
                            Quantum parsing meets cosmic design.
                        </span>
                    </p>

                    <div className="flex justify-center gap-6 mb-16 flex-wrap">
                        <button
                            onClick={() => router.push('/editor')}
                            className="px-8 py-4 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg text-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                        >
                            START FROM SCRATCH
                        </button>

                        <label className="px-8 py-4 bg-linear-to-r from-green-500 to-teal-600 rounded-lg text-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105 cursor-pointer shadow-lg relative">
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handlePDFUpload}
                                disabled={isUploading}
                            />
                            {isUploading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    PROCESSING...
                                </div>
                            ) : (
                                'UPLOAD PDF RESUME'
                            )}
                        </label>
                    </div>

                    {uploadError && (
                        <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg max-w-2xl mx-auto">
                            <p className="text-red-300">⚠️ {uploadError}</p>
                            <p className="text-sm text-red-400 mt-2">
                                Make sure the backend server is running on http://localhost:5000
                            </p>
                        </div>
                    )}

                    <div className="inline-block bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
                        <div className="text-6xl font-bold text-green-400">99.5%</div>
                        <div className="text-xl font-semibold">ATS SUCCESS RATE</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                        <h3 className="text-2xl font-bold mb-4">AI-Powered Parsing</h3>
                        <p className="text-gray-300">Intelligent PDF extraction with 99% accuracy</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                        <h3 className="text-2xl font-bold mb-4">Real-Time Preview</h3>
                        <p className="text-gray-300">See changes instantly as you edit</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all">
                        <h3 className="text-2xl font-bold mb-4">ATS Optimized</h3>
                        <p className="text-gray-300">Pass through any Applicant Tracking System</p>
                    </div>
                </div>

                <div className="mt-16 text-center text-gray-400">
                    <p className="text-sm">
                        💡 Tip: Upload your PDF resume to auto-fill all fields instantly
                    </p>
                    <p className="text-xs mt-2">
                        Backend server required: http://localhost:5000
                    </p>
                </div>
            </div>
        </div>
    );
}