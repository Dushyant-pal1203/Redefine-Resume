"use client";

import { useState } from "react";
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
    TrendingUp
} from "lucide-react";
import { px } from "framer-motion";

export default function ResumeListPage() {
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const resumes = [
        {
            id: 1,
            name: 'John Doe',
            template: 'Modern Pro',
            lastUpdated: '2 hours ago',
            views: 234,
            status: 'active',
            summary: 'Experienced software engineer with 5+ years in full-stack development'
        },
        {
            id: 2,
            name: 'Jane Smith',
            template: 'Creative Flow',
            lastUpdated: '1 day ago',
            views: 156,
            status: 'draft',
            summary: 'Creative designer specializing in UI/UX and brand identity'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            template: 'Executive',
            lastUpdated: '3 hours ago',
            views: 89,
            status: 'active',
            summary: 'Senior product manager with expertise in SaaS and B2B products'
        },
    ];

    const filters = [
        { id: 'all', label: 'All Resumes', count: 12 },
        { id: 'active', label: 'Active', count: 8 },
        { id: 'draft', label: 'Drafts', count: 3 },
        { id: 'archived', label: 'Archived', count: 1 },
    ];

    const stats = [
        { title: 'Total Resumes', value: '24', icon: FileText, color: 'purple' },
        { title: 'Total Views', value: '1,234', icon: Eye, color: 'blue' },
        { title: 'Downloads', value: '567', icon: Download, color: 'green' },
        { title: 'Success Rate', value: '89%', icon: TrendingUp, color: 'yellow' },
    ];

    return (
        <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Resumes</h1>
                    <p className="text-gray-400 mt-1">Manage and organize your resume collection</p>
                </div>
                <Button className="flex items-center bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Resume
                </Button>
            </div>

            {/* Stats Cards */}
            <CardGrid columns={{ default: 1, sm: 2, lg: 4 }} gap="md">
                {stats.map((stat, index) => (
                    <Card key={index} variant="elevated" hover>
                        <CardHeader>
                            <CardIcon variant="gradient" size="sm" className={`from-${stat.color}-500/20 to-pink-500/20`}>
                                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
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
                                className={selectedFilter === filter.id ? 'bg-purple-600' : ''}
                            >
                                {filter.label}
                                <CardBadge
                                    color={selectedFilter === filter.id ? 'purple' : 'gray'}
                                    className="ml-2"
                                >
                                    {filter.count}
                                </CardBadge>
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
                                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 w-full sm:w-64"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <SortAsc className="w-5 h-5" />
                        </Button>
                        <div className="flex border border-gray-800 rounded-lg overflow-hidden">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                                className={viewMode === 'grid' ? 'bg-purple-600 px-2' : 'px-2'}
                            >
                                <Grid className="w-5 h-5" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-purple-600 px-2' : 'px-2'}
                            >
                                <List className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Resume Cards */}
            {viewMode === 'grid' ? (
                <CardGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
                    {resumes.map((resume) => (
                        <Card key={resume.id} hover animate className="group">
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

                            <CardFooter>
                                <Button variant="ghost" size="sm" className="w-full">
                                    Edit Resume
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardGrid>
            ) : (
                <CardGroup>
                    {resumes.map((resume) => (
                        <Card key={resume.id} hover padding="md" className="group">
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
                                        <Button variant="ghost" size="sm">
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </CardGroup>
            )}
        </div>
    );
}