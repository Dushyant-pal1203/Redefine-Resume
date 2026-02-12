'use client';

export default function CreativeTemplate({ resumeData }) {
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
        <div className="bg-linear-to-br from-purple-50 to-pink-50 shadow-2xl rounded-2xl p-8 min-h-full border border-purple-100">
            {/* Header Section */}
            <div className="relative mb-10">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-linear-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="relative">
                    <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        {resumeData.full_name || 'Your Name Here'}
                    </h1>
                    <h2 className="text-xl text-purple-700 font-medium mb-4">
                        Full Stack Web Developer
                    </h2>

                    <div className="flex flex-wrap gap-4 mt-4">
                        {resumeData.email && (
                            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {resumeData.email}
                            </div>
                        )}
                        {resumeData.phone && (
                            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                {resumeData.phone}
                            </div>
                        )}
                        {resumeData.location && (
                            <div className="flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
                                <svg className="w-4 h-4 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                {resumeData.location}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Professional Summary */}
            {resumeData.professional_summary && (
                <div className="mb-10 relative">
                    <div className="absolute -left-2 top-0 w-1 h-full bg-linear-to-b from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-purple-700 mb-3 pl-4">
                        Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed pl-4 italic">
                        {resumeData.professional_summary}
                    </p>
                </div>
            )}

            {/* Two Column Layout for Experience and Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Experience Section */}
                {experiences.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                            Work Experience
                        </h2>
                        <div className="space-y-6">
                            {experiences.map((exp, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {exp.position || 'Position'}
                                    </h3>
                                    <p className="text-purple-600 font-medium text-sm">
                                        {exp.company || 'Company'}
                                    </p>
                                    {exp.duration && (
                                        <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {exp.duration}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects Section */}
                {projects.length > 0 && (
                    <div>
                        <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                            Projects
                        </h2>
                        <div className="space-y-6">
                            {projects.map((project, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {project.name || 'Project Name'}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {project.description}
                                    </p>
                                    {project.technologies && (
                                        <div className="mt-2">
                                            <span className="text-xs text-purple-500 font-medium">Tech: </span>
                                            <span className="text-xs text-gray-500">
                                                {project.technologies}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Skills Section */}
            {skills.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Education Section */}
            {educations.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full mr-2"></span>
                        Education
                    </h2>
                    <div className="space-y-4">
                        {educations.map((edu, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {edu.degree || 'Degree'}
                                        </h3>
                                        <p className="text-purple-600 font-medium text-sm">
                                            {edu.institution || 'Institution'}
                                        </p>
                                    </div>
                                    {edu.year && (
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {edu.year}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}