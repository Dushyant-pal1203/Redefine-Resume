'use client';

export default function LivePreview({ resumeData, template = 'modern' }) {
    const formatArray = (arr) => {
        if (!arr || !Array.isArray(arr)) return [];
        return arr.filter(item => {
            if (typeof item === 'string') return item.trim() !== '';
            if (typeof item === 'object') {
                return Object.values(item).some(val =>
                    val && val.toString().trim() !== ''
                );
            }
            return false;
        });
    };

    const experiences = formatArray(resumeData.experience);
    const educations = formatArray(resumeData.education);
    const skills = formatArray(resumeData.skills)
        .filter(skill => typeof skill === 'string' && skill.trim() !== '');
    const projects = formatArray(resumeData.projects);

    return (
        <div className="h-screen overflow-y-auto bg-linear-to-b from-gray-50 to-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 min-h-full border border-gray-200">
                {/* Header Section */}
                <div className="border-b-2 border-blue-600 pb-6 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {resumeData.full_name || 'Your Name Here'}
                    </h1>
                    <h2 className="text-xl text-blue-700 font-medium mb-4">
                        Full Stack Web Developer
                    </h2>

                    <div className="flex flex-wrap gap-4 mt-4 text-gray-700">
                        {resumeData.email && resumeData.email !== 'email@example.com' && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {resumeData.email}
                            </div>
                        )}

                        {resumeData.phone && resumeData.phone !== 'Phone number' && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                {resumeData.phone}
                            </div>
                        )}

                        {resumeData.location && resumeData.location !== 'Location, Country' && (
                            <div className="flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {resumeData.location}
                            </div>
                        )}
                    </div>
                </div>

                {/* Professional Summary */}
                {resumeData.professional_summary &&
                    resumeData.professional_summary !== 'Describe your professional background...' && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                <span className="bg-blue-600 w-1 h-6 mr-3 rounded"></span>
                                Professional Summary
                            </h2>
                            <p className="text-gray-700 leading-relaxed pl-4 border-l-2 border-blue-100">
                                {resumeData.professional_summary}
                            </p>
                        </div>
                    )}

                {/* Experience Section */}
                {experiences.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-600 w-1 h-6 mr-3 rounded"></span>
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {experiences.map((exp, index) => (
                                <div key={index} className="pl-4 border-l-2 border-blue-200">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {exp.position || 'Position'}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-1 mb-3 gap-2">
                                        <span className="text-blue-700 font-medium">
                                            {exp.company || 'Company'}
                                        </span>
                                        {exp.duration && (
                                            <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                                                {exp.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projects.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-600 w-1 h-6 mr-3 rounded"></span>
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {projects.map((project, index) => (
                                <div key={index} className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-blue-200 transition-colors">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {project.name || 'Project Name'}
                                    </h3>
                                    <p className="text-gray-700 mb-3">
                                        {project.description || 'Project description will appear here.'}
                                    </p>
                                    {project.technologies && (
                                        <div className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Technologies: </span>
                                            {project.technologies}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills Section */}
                {skills.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-600 w-1 h-6 mr-3 rounded"></span>
                            Skills
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium hover:bg-blue-200 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education Section */}
                {educations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-600 w-1 h-6 mr-3 rounded"></span>
                            Education
                        </h2>
                        <div className="space-y-6">
                            {educations.map((edu, index) => (
                                <div key={index} className="pl-4 border-l-2 border-blue-200">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {edu.degree || 'Degree'}
                                    </h3>
                                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-1 mb-3 gap-2">
                                        <span className="text-blue-700 font-medium">
                                            {edu.institution || 'Institution'}
                                        </span>
                                        {edu.year && (
                                            <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
                                                {edu.year}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-300 text-center text-gray-600 text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="font-medium">Live Preview • Template:
                            <span className="text-blue-600 ml-1">
                                {template.charAt(0).toUpperCase() + template.slice(1)}
                            </span>
                        </p>
                    </div>
                    <p className="text-gray-500">Updates in real-time as you edit</p>
                </div>
            </div>
        </div>
    );
}