"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardIcon,
    CardBadge,
    CardGrid,
    CardGroup
} from "@/components/ui/cards";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    SortAsc,
    Grid,
    List,
    FileText,
    Clock,
    Eye,
    Download,
    TrendingUp,
    Loader2
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useResumes } from '@/hooks/use-resumes';
import { usePDF } from '@/hooks/use-pdf';

export default function ResumeListPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        resumes,
        isLoading: resumesLoading,
        fetchResumes,
        deleteResume,
        togglePublic,
        duplicateResume
    } = useResumes();
    const { downloadPDF, isGenerating } = usePDF();

    const [viewMode, setViewMode] = useState('grid');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResumeId, setSelectedResumeId] = useState(null);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Transform resumes data to match dashboard format
    const transformedResumes = resumes.map(resume => ({
        id: resume.resume_id,
        name: resume.resume_title || 'Untitled Resume',
        template: resume.template || 'Modern',
        lastUpdated: new Date(resume.updated_at || resume.created_at).toLocaleDateString(),
        views: resume.view_count || 0,
        status: resume.status || (resume.is_public ? 'active' : 'draft'),
        summary: resume.summary || resume.professional_summary || 'No summary available',
        experience: resume.work_experience || [],
        education: resume.education || [],
        skills: resume.skills || []
    }));

    // Calculate stats from real data
    const stats = [
        { title: 'Total Resumes', value: resumes.length.toString(), icon: FileText, color: 'purple' },
        { title: 'Total Views', value: resumes.reduce((acc, r) => acc + (r.view_count || 0), 0).toLocaleString(), icon: Eye, color: 'blue' },
        { title: 'Downloads', value: resumes.reduce((acc, r) => acc + (r.download_count || 0), 0).toLocaleString(), icon: Download, color: 'green' },
        { title: 'Public Resumes', value: resumes.filter(r => r.is_public).length.toString(), icon: TrendingUp, color: 'yellow' },
    ];

    // Calculate filter counts
    const filters = [
        { id: 'all', label: 'All Resumes', count: resumes.length },
        { id: 'active', label: 'Active', count: resumes.filter(r => r.is_public).length },
        { id: 'draft', label: 'Drafts', count: resumes.filter(r => !r.is_public).length },
        { id: 'archived', label: 'Archived', count: 0 }, // Add archive functionality if needed
    ];

    const handleCreateNewResume = () => {
        router.push('/editor');
    };

    const handleEditResume = (resume) => {
        try {
            // Navigate to editor with resume ID
            router.push(`/editor?resumeId=${resume.id}&template=${resume.template?.toLowerCase().replace(/\s+/g, '-') || 'modern'}`);
        } catch (error) {
            console.error('Error navigating to editor:', error);
            router.push(`/editor?resumeId=${resume.id}`);
        }
    };

    const handleDownloadPDF = async (e, resumeId, resumeName) => {
        e.stopPropagation();
        setSelectedResumeId(resumeId);
        const filename = `${resumeName.replace(/\s+/g, '_')}_resume.pdf`;
        await downloadPDF(resumeId, filename);
        setSelectedResumeId(null);
    };

    const handleDeleteResume = async (e, resumeId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this resume?')) {
            await deleteResume(resumeId);
        }
    };

    const handleTogglePublic = async (e, resumeId) => {
        e.stopPropagation();
        await togglePublic(resumeId);
    };

    const handleDuplicateResume = async (e, resumeId) => {
        e.stopPropagation();
        await duplicateResume(resumeId);
    };

    // Filter resumes based on selected filter and search query
    const filteredResumes = transformedResumes.filter(resume => {
        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'active' && resume.status === 'active') ||
            (selectedFilter === 'draft' && resume.status === 'draft');
        const matchesSearch = resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resume.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Color mapping for stats
    const statColorClasses = {
        purple: 'from-purple-500/20 to-pink-500/20',
        blue: 'from-blue-500/20 to-cyan-500/20',
        green: 'from-green-500/20 to-emerald-500/20',
        yellow: 'from-yellow-500/20 to-orange-500/20',
    };

    const statIconColors = {
        purple: 'text-purple-400',
        blue: 'text-blue-400',
        green: 'text-green-400',
        yellow: 'text-yellow-400',
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-gray-950/20 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-8 md:mb-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        Welcome back, {user?.name || 'User'}!
                        <div className="bg-linear-to-r from-purple-400 to-cyan-400 mt-2 w-28 h-1"></div>
                    </h1>
                    <p className="text-lg text-gray-300 mt-1">Manage and organize your resume collection</p>
                </div>
                <Button
                    onClick={handleCreateNewResume}
                    size="lg"
                    className="bg-linear-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden group"
                >
                    <Plus className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Create New Resume
                </Button>
            </div>

            {/* Stats Cards */}
            <CardGrid columns={{ default: 1, sm: 2, lg: 4 }} gap="md">
                {stats.map((stat, index) => (
                    <Card key={index} variant="elevated" hover>
                        <CardHeader>
                            <CardIcon
                                variant="gradient"
                                size="sm"
                                className={statColorClasses[stat.color]}
                            >
                                <stat.icon className={`w-4 h-4 ${statIconColors[stat.color]}`} />
                            </CardIcon>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{stat.title}</CardDescription>
                            <CardTitle className="text-2xl">{stat.value}</CardTitle>
                        </CardContent>
                    </Card>
                ))}
            </CardGrid>

            {/* Filters and Search */}
            <Card variant="elevated" padding="md">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Filter Pills */}
                    <div className="flex gap-2 flex-wrap">
                        {filters.map((filter) => (
                            <Button
                                key={filter.id}
                                variant={selectedFilter === filter.id ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedFilter(filter.id)}
                                className={selectedFilter === filter.id ? 'bg-purple-600 hover:bg-purple-700' : ''}
                            >
                                {filter.label}
                                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${selectedFilter === filter.id
                                    ? 'bg-purple-500/20 text-purple-200'
                                    : 'bg-gray-800 text-gray-400'
                                    }`}>
                                    {filter.count}
                                </span>
                            </Button>
                        ))}
                    </div>

                    {/* Search and View Toggle */}
                    <div className="flex gap-4 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full sm:w-64"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <SortAsc className="w-5 h-5" />
                        </Button>
                        <div className="flex border border-gray-800 rounded-lg overflow-hidden gap-1">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700 rounded-none' : 'rounded-none'}
                            >
                                <Grid className="w-5 h-5" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700 rounded-none' : 'rounded-none'}
                            >
                                <List className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Resume Cards */}
            {resumesLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
            ) : filteredResumes.length > 0 ? (
                viewMode === 'grid' ? (
                    <CardGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
                        {filteredResumes.map((resume) => (
                            <Card
                                key={resume.id}
                                hover
                                animate
                                className="group cursor-pointer"
                                onClick={() => handleEditResume(resume)}
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <CardIcon variant="gradient" size="md">
                                            <FileText className="w-6 h-6 text-purple-400" />
                                        </CardIcon>
                                        <div>
                                            <CardTitle gradient>{resume.name}</CardTitle>
                                            <CardDescription>{resume.template}</CardDescription>
                                        </div>
                                    </div>
                                    <CardBadge color={resume.status === 'active' ? 'green' : 'yellow'}>
                                        {resume.status}
                                    </CardBadge>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        {resume.summary}
                                    </p>

                                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {resume.lastUpdated}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {resume.views} views
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 hover:bg-purple-600/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditResume(resume);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-green-600/20"
                                        onClick={(e) => handleDownloadPDF(e, resume.id, resume.name)}
                                        disabled={isGenerating && selectedResumeId === resume.id}
                                    >
                                        {isGenerating && selectedResumeId === resume.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-blue-600/20"
                                        onClick={(e) => handleDuplicateResume(e, resume.id)}
                                    >
                                        <FileText className="w-4 h-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardGrid>
                ) : (
                    <CardGroup>
                        {filteredResumes.map((resume) => (
                            <Card
                                key={resume.id}
                                hover
                                padding="md"
                                className="group cursor-pointer"
                                onClick={() => handleEditResume(resume)}
                            >
                                <div className="flex items-center gap-4">
                                    <CardIcon variant="gradient" size="sm">
                                        <FileText className="w-4 h-4 text-purple-400" />
                                    </CardIcon>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                        <div>
                                            <CardTitle gradient className="text-base">{resume.name}</CardTitle>
                                            <CardDescription className="text-xs">{resume.template}</CardDescription>
                                        </div>

                                        <p className="text-sm text-gray-400 line-clamp-1 md:col-span-2">
                                            {resume.summary}
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {resume.lastUpdated}
                                            </span>
                                            <CardBadge color={resume.status === 'active' ? 'green' : 'yellow'}>
                                                {resume.status}
                                            </CardBadge>
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditResume(resume);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => handleDownloadPDF(e, resume.id, resume.name)}
                                                    disabled={isGenerating && selectedResumeId === resume.id}
                                                >
                                                    {isGenerating && selectedResumeId === resume.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Download className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </CardGroup>
                )
            ) : (
                <Card variant="elevated" padding="lg" className="text-center">
                    <div className="py-12">
                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No resumes found</h3>
                        <p className="text-gray-400 mb-6">
                            {searchQuery || selectedFilter !== 'all'
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "Get started by creating your first resume!"}
                        </p>
                        <Button onClick={handleCreateNewResume}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Resume
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}