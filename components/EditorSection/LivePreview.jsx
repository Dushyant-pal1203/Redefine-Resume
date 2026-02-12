'use client';

import ModernTemplate from '@/components/templates/ModernTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';

export default function LivePreview({ resumeData, template = 'modern' }) {
    const renderTemplate = () => {
        switch (template) {
            case 'modern':
                return <ModernTemplate resumeData={resumeData} />;
            case 'minimal':
                return <MinimalTemplate resumeData={resumeData} />;
            case 'creative':
                return <CreativeTemplate resumeData={resumeData} />;
            default:
                return <ModernTemplate resumeData={resumeData} />;
        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-linear-to-b from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                {renderTemplate()}

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="font-medium">Live Preview • Template:
                            <span className="text-blue-600 ml-1 capitalize">
                                {template}
                            </span>
                        </p>
                    </div>
                    <p className="text-gray-500">Updates in real-time as you edit</p>
                </div>
            </div>
        </div>
    );
}