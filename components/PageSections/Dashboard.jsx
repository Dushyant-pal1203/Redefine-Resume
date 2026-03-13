// client/components/PageSections/Dashboard.jsx
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
    Loader2,
    MoreVertical,
    Copy,
    Trash2,
    Globe,
    Lock,
    Share2
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useResumes } from '@/hooks/use-resumes';
import { usePDF } from '@/hooks/use-pdf';
import DownloadPDF from '@/components/FunctionComponent/DownloadPDF';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeListPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        resumes,
        isLoading: resumesLoading,
        fetchResumes,
        deleteResume,
        togglePublic,
        duplicateResume,
        updateResume
    } = useResumes();
    const { downloadPDF, isGenerating } = usePDF();

    const [viewMode, setViewMode] = useState('grid');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [sortBy, setSortBy] = useState('updated');
    const [sortOrder, setSortOrder] = useState('desc');

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch resumes on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchResumes();
        }
    }, [isAuthenticated, fetchResumes]);

    // Transform resumes data to match dashboard format
    const transformedResumes = resumes.map(resume => ({
        id: resume.resume_id,
        name: resume.resume_title || 'Untitled Resume',
        template: resume.template || 'Modern',
        lastUpdated: new Date(resume.updated_at || resume.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        views: resume.view_count || 0,
        downloads: resume.download_count || 0,
        status: resume.is_public ? 'public' : 'private',
        is_public: resume.is_public || false,
        summary: resume.professional_summary || resume.summary || 'No summary available',
        experience: resume.work_experience || [],
        education: resume.education || [],
        skills: resume.skills || [],
        created_at: resume.created_at,
        updated_at: resume.updated_at
    }));

    // Calculate stats from real data
    const stats = [
        {
            title: 'Total Resumes',
            value: resumes.length.toString(),
            icon: FileText,
            color: 'purple',
            change: '+12%',
            trend: 'up'
        },
        {
            title: 'Total Views',
            value: resumes.reduce((acc, r) => acc + (r.view_count || 0), 0).toLocaleString(),
            icon: Eye,
            color: 'blue',
            change: '+23%',
            trend: 'up'
        },
        {
            title: 'Downloads',
            value: resumes.reduce((acc, r) => acc + (r.download_count || 0), 0).toLocaleString(),
            icon: Download,
            color: 'green',
            change: '+8%',
            trend: 'up'
        },
        {
            title: 'Public Resumes',
            value: resumes.filter(r => r.is_public).length.toString(),
            icon: Globe,
            color: 'yellow',
            change: '0%',
            trend: 'neutral'
        },
    ];

    // Calculate filter counts
    const filters = [
        { id: 'all', label: 'All Resumes', count: resumes.length },
        { id: 'public', label: 'Public', count: resumes.filter(r => r.is_public).length },
        { id: 'private', label: 'Private', count: resumes.filter(r => !r.is_public).length },
    ];

    // Sort and filter resumes
    const filteredResumes = transformedResumes
        .filter(resume => {
            const matchesFilter = selectedFilter === 'all' ||
                (selectedFilter === 'public' && resume.status === 'public') ||
                (selectedFilter === 'private' && resume.status === 'private');

            const matchesSearch = resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resume.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                resume.template.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        })
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === 'updated') {
                comparison = new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
            } else if (sortBy === 'views') {
                comparison = b.views - a.views;
            } else if (sortBy === 'downloads') {
                comparison = b.downloads - a.downloads;
            }
            return sortOrder === 'asc' ? -comparison : comparison;
        });

    const handleCreateNewResume = () => {
        router.push('/editor?template=modern');
    };

    const handleEditResume = (resume) => {
        try {
            router.push(`/editor?resumeId=${resume.id}&template=${resume.template?.toLowerCase() || 'modern'}`);
        } catch (error) {
            console.error('Error navigating to editor:', error);
            router.push(`/editor?resumeId=${resume.id}`);
        }
    };

    const handleDeleteResume = async (e, resumeId) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
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

    const handleShareResume = (e, resume) => {
        e.stopPropagation();
        if (resume.is_public) {
            const shareUrl = `${window.location.origin}/resume/${resume.id}`;
            navigator.clipboard.writeText(shareUrl);
            toast({
                title: "✅ Link Copied",
                description: "Shareable link copied to clipboard",
            });
        } else {
            toast({
                title: "🔒 Resume is Private",
                description: "Make it public to share",
                variant: "destructive",
            });
        }
    };

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

    const statTrendColors = {
        up: 'text-green-400',
        down: 'text-red-400',
        neutral: 'text-gray-400',
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 mb-8 md:mb-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white">
                        Welcome back, {user?.name || 'User'}!
                        <div className="bg-linear-to-r from-purple-400 to-cyan-400 mt-2 w-28 h-1 rounded-full"></div>
                    </h1>
                    <p className="text-lg text-gray-300 mt-1">Manage and organize your resume collection</p>
                </div>
                <Button
                    onClick={handleCreateNewResume}
                    size="lg"
                    className="bg-linear-to-r from-purple-600 via-pink-500 to-cyan-500 hover:shadow-2xl hover:shadow-purple-500/50 relative overflow-hidden group transform hover:scale-105 transition-all duration-300"
                >
                    <Plus className="mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                    Create New Resume
                </Button>
            </div>

            {/* Stats Cards */}
            <CardGrid columns={{ default: 1, sm: 2, lg: 4 }} gap="md">
                {stats.map((stat, index) => (
                    <Card key={index} variant="elevated" hover className="relative overflow-hidden group">
                        <div className={`absolute inset-0 bg-linear-to-br ${statColorClasses[stat.color]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        <CardHeader>
                            <CardIcon
                                variant="gradient"
                                size="sm"
                                className={`bg-linear-to-br ${statColorClasses[stat.color]}`}
                            >
                                <stat.icon className={`w-4 h-4 ${statIconColors[stat.color]}`} />
                            </CardIcon>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>{stat.title}</CardDescription>
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-2xl">{stat.value}</CardTitle>
                                <span className={`text-xs ${statTrendColors[stat.trend]}`}>
                                    {stat.change}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardGrid>

            {/* Filters and Search */}
            <Card variant="elevated" padding="md">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Filter Tabs */}
                    <Tabs defaultValue="all" value={selectedFilter} onValueChange={setSelectedFilter} className="w-full lg:w-auto">
                        <TabsList className="bg-gray-900">
                            {filters.map((filter) => (
                                <TabsTrigger key={filter.id} value={filter.id} className="relative">
                                    {filter.label}
                                    <Badge
                                        variant="secondary"
                                        className="ml-2 bg-gray-800 text-gray-300"
                                    >
                                        {filter.count}
                                    </Badge>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Search and View Toggle */}
                    <div className="flex gap-4 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search resumes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-purple-500"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="border-gray-800">
                                    <SortAsc className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setSortBy('updated')}>
                                    Last Updated
                                    {sortBy === 'updated' && (
                                        <span className="ml-2 text-purple-400">✓</span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('name')}>
                                    Name
                                    {sortBy === 'name' && (
                                        <span className="ml-2 text-purple-400">✓</span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('views')}>
                                    Most Views
                                    {sortBy === 'views' && (
                                        <span className="ml-2 text-purple-400">✓</span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('downloads')}>
                                    Most Downloaded
                                    {sortBy === 'downloads' && (
                                        <span className="ml-2 text-purple-400">✓</span>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                                    Order: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className="flex border border-gray-800 rounded-lg overflow-hidden">
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
                <CardGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} variant="elevated">
                            <CardHeader>
                                <Skeleton className="h-12 w-12 rounded-lg" />
                                <Skeleton className="h-4 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-10 w-full" />
                            </CardFooter>
                        </Card>
                    ))}
                </CardGrid>
            ) : filteredResumes.length > 0 ? (
                viewMode === 'grid' ? (
                    <CardGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
                        {filteredResumes.map((resume) => (
                            <Card
                                key={resume.id}
                                hover
                                animate
                                className="group cursor-pointer relative"
                                onClick={() => handleEditResume(resume)}
                            >
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <CardIcon variant="gradient" size="md">
                                                <FileText className="w-6 h-6 text-purple-400" />
                                            </CardIcon>
                                            <div>
                                                <CardTitle gradient className="text-lg">
                                                    {resume.name}
                                                </CardTitle>
                                                <CardDescription className="text-sm">
                                                    {resume.template}
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => handleEditResume(resume)}>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => handleDuplicateResume(e, resume.id)}>
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => handleTogglePublic(e, resume.id)}>
                                                    {resume.is_public ? (
                                                        <>
                                                            <Lock className="w-4 h-4 mr-2" />
                                                            Make Private
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe className="w-4 h-4 mr-2" />
                                                            Make Public
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => handleShareResume(e, resume)}>
                                                    <Share2 className="w-4 h-4 mr-2" />
                                                    Share
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={(e) => handleDeleteResume(e, resume.id)}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardBadge color={resume.is_public ? 'green' : 'yellow'}>
                                        {resume.is_public ? 'Public' : 'Private'}
                                    </CardBadge>
                                </CardHeader>

                                <CardContent>
                                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                                        {resume.summary}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {resume.lastUpdated}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {resume.views} views
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Download className="w-3 h-3" />
                                            {resume.downloads} downloads
                                        </span>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex gap-2">
                                    <DownloadPDF
                                        resumeId={resume.id}
                                        template={resume.template.toLowerCase()}
                                        label=""
                                        iconOnly
                                        variant="ghost"
                                        size="sm"
                                        className="hover:bg-green-600/20"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex-1 hover:bg-purple-600/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditResume(resume);
                                        }}
                                    >
                                        Edit Resume
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

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                                        <div className="md:col-span-1">
                                            <CardTitle gradient className="text-base">{resume.name}</CardTitle>
                                            <CardDescription className="text-xs">{resume.template}</CardDescription>
                                        </div>

                                        <p className="text-sm text-gray-400 line-clamp-2 md:col-span-2">
                                            {resume.summary}
                                        </p>

                                        <div className="flex items-center gap-4 md:col-span-2">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {resume.lastUpdated}
                                            </div>
                                            <Badge variant="outline" className={
                                                resume.is_public
                                                    ? 'border-green-500/30 text-green-400'
                                                    : 'border-yellow-500/30 text-yellow-400'
                                            }>
                                                {resume.is_public ? 'Public' : 'Private'}
                                            </Badge>
                                            <div className="flex gap-1 ml-auto">
                                                <DownloadPDF
                                                    resumeId={resume.id}
                                                    template={resume.template.toLowerCase()}
                                                    label=""
                                                    iconOnly
                                                    variant="ghost"
                                                    size="sm"
                                                />
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
                    <div className="py-16">
                        <FileText className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-semibold text-white mb-2">No resumes found</h3>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            {searchQuery || selectedFilter !== 'all'
                                ? "Try adjusting your search or filter to find what you're looking for."
                                : "Get started by creating your first resume!"}
                        </p>
                        <Button
                            onClick={handleCreateNewResume}
                            size="lg"
                            className="bg-linear-to-r from-purple-600 to-pink-500"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Resume
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
}