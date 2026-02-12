'use client';

export default function MinimalTemplate({ resumeData }) {
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
        <div className="bg-white shadow-lg rounded-lg p-8 min-h-full border border-gray-100">
            {/* Header Section */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
                    {resumeData.full_name || 'Your Name Here'}
                </h1>
                <h2 className="text-lg text-gray-600 font-light mb-4">
                    Full Stack Web Developer
                </h2>

                <div className="flex flex-wrap justify-center gap-4 mt-4 text-gray-500 text-sm">
                    {resumeData.email && (
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {resumeData.email}
                        </div>
                    )}
                    {resumeData.phone && (
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {resumeData.phone}
                        </div>
                    )}
                    {resumeData.location && (
                        <div className="flex items-center">
                            <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {resumeData.location}
                        </div>
                    )}
                </div>
            </div>

            {/* Professional Summary */}
            {resumeData.professional_summary && (
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-3 pb-1 border-b border-gray-200">
                        Professional Summary
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {resumeData.professional_summary}
                    </p>
                </div>
            )}

            {/* Experience Section */}
            {experiences.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4 pb-1 border-b border-gray-200">
                        Work Experience
                    </h2>
                    <div className="space-y-5">
                        {experiences.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-medium text-gray-800">
                                        {exp.position || 'Position'}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {exp.duration}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {exp.company || 'Company'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-4 pb-1 border-b border-gray-200">
                        Projects
                    </h2>
                    <div className="space-y-4">
                        {projects.map((project, index) => (
                            <div key={index}>
                                <h3 className="font-medium text-gray-800 mb-1">
                                    {project.name || 'Project Name'}
                                </h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    {project.description}
                                </p>
                                {project.technologies && (
                                    <p className="text-xs text-gray-500">
                                        {project.technologies}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills Section */}
            {skills.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-800 mb-3 pb-1 border-b border-gray-200">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <span
                                key={index}
                                className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded"
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
                    <h2 className="text-lg font-medium text-gray-800 mb-4 pb-1 border-b border-gray-200">
                        Education
                    </h2>
                    <div className="space-y-4">
                        {educations.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-medium text-gray-800">
                                        {edu.degree || 'Degree'}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {edu.year}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {edu.institution || 'Institution'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}