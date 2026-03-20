// components/EditorSection/FuturisticATSScore.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    CircuitBoard,
    Brain,
    Zap,
    Target,
    TrendingUp,
    Shield,
    AlertTriangle,
    CheckCircle,
    X,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Loader2,
    BarChart3,
    Globe,
    Clock,
    Radio,
    Activity,
    PieChart,
    Gauge,
    Infinity,
    Atom,
    Bot,
    Radar,
    Network,
    Layers,
    Binary,
    Hexagon,
    Rocket,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Custom hook for media queries
function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);

    return matches;
}

export default function FuturisticATSScore({ resumeData, isOpen, onClose, resumeId }) {
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [jobDescription, setJobDescription] = useState('');
    const [showJobDescription, setShowJobDescription] = useState(false);
    const [expandedSections, setExpandedSections] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [isHovering, setIsHovering] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [source, setSource] = useState(null);
    const [error, setError] = useState(null);

    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const { user, isAuthenticated } = useAuth();

    // Responsive hooks
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');
    const isLandscape = useMediaQuery('(orientation: landscape) and (max-height: 600px)');

    // Futuristic particle animation
    useEffect(() => {
        if (!isOpen || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticles = () => {
            // Reduce particles on mobile for performance
            const particleCount = isMobile ? 20 : 50;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * (isMobile ? 1.5 : 2) + 1,
                    speedX: (Math.random() - 0.5) * (isMobile ? 1 : 2),
                    speedY: (Math.random() - 0.5) * (isMobile ? 1 : 2),
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };

        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw grid lines (reduce on mobile)
            if (!isMobile) {
                ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
                ctx.lineWidth = 1;
                const gridSize = isMobile ? 100 : 50;
                for (let i = 0; i < canvas.width; i += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i, canvas.height);
                    ctx.strokeStyle = 'rgba(147, 51, 234, 0.05)';
                    ctx.stroke();
                }
                for (let i = 0; i < canvas.height; i += gridSize) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(canvas.width, i);
                    ctx.stroke();
                }
            }

            // Draw and update particles
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(147, 51, 234, ${p.opacity})`;
                ctx.fill();

                // Update position
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });

            animationRef.current = requestAnimationFrame(drawParticles);
        };

        resizeCanvas();
        createParticles();
        drawParticles();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isOpen, isMobile]);

    const analyzeResume = useCallback(async () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        setError(null);

        try {
            const token = Cookies.get("token");

            const response = await fetch(`${API_BASE_URL}/api/ats/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                credentials: 'include',
                body: JSON.stringify({
                    resumeData,
                    jobDescription: jobDescription || undefined,
                    resumeId: resumeId || undefined
                }),
            });

            const data = await response.json();

            if (data.success) {
                setAnalysis(data.analysis);
                setSource(data.source);
            } else {
                throw new Error(data.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis failed:', error);
            setError(error.message);
        } finally {
            setIsAnalyzing(false);
        }
    }, [resumeData, jobDescription, resumeId]);

    useEffect(() => {
        if (isOpen && resumeData) {
            analyzeResume();
        }
    }, [isOpen, resumeData, analyzeResume]);

    const toggleSection = (section) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'from-emerald-400 to-green-400';
        if (score >= 60) return 'from-yellow-400 to-orange-400';
        if (score >= 40) return 'from-orange-400 to-red-400';
        return 'from-red-400 to-pink-400';
    };

    const tabs = [
        { id: 'overview', icon: Radar, label: isMobile ? 'OVERVIEW' : 'QUANTUM OVERVIEW', mobileLabel: 'OVERVIEW' },
        { id: 'dimensions', icon: Layers, label: isMobile ? 'DIMENSIONS' : 'NEURAL DIMENSIONS', mobileLabel: 'DIMS' },
        { id: 'optimize', icon: Bot, label: isMobile ? 'OPTIMIZE' : 'OPTIMIZATION PROTOCOLS', mobileLabel: 'OPT' },
        { id: 'market', icon: Network, label: isMobile ? 'MARKET' : 'MARKET POSITION', mobileLabel: 'MKT' }
    ];

    if (!isOpen) return null;

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Animated Background */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                    >
                        <canvas
                            ref={canvasRef}
                            className="absolute inset-0 w-full h-full"
                            style={{ background: 'linear-linear(135deg, #0f0c1f 0%, #1a1035 50%, #0f0c1f 100%)' }}
                        />
                    </motion.div>

                    {/* Main Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`fixed z-50 bg-gray-900/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden
                            ${isLandscape
                                ? 'inset-2'
                                : isMobile
                                    ? 'inset-2'
                                    : 'inset-4 md:inset-10'
                            }`}
                        style={{
                            boxShadow: '0 25px 50px -12px rgba(147, 51, 234, 0.5), inset 0 0 0 1px rgba(255,255,255,0.1)'
                        }}
                    >
                        {/* Holographic Header */}
                        <div className={`relative bg-linear-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 border-b border-white/10
                            ${isLandscape ? 'h-16' : isMobile ? 'h-16' : 'h-20'}`}>
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Cpath%20d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />

                            <div className="relative h-full flex items-center justify-between px-3 md:px-6">
                                <div className="flex items-center gap-2 md:gap-4 min-w-0">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="relative shrink-0"
                                    >
                                        <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50" />
                                        <Atom className={`${isLandscape ? 'w-5 h-5' : isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-purple-400 relative z-10`} />
                                    </motion.div>
                                    <div className="min-w-0">
                                        <h1 className={`font-bold bg-linear-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent truncate
                                            ${isLandscape ? 'text-base' : isMobile ? 'text-lg' : 'text-2xl'}`}>
                                            {isMobile ? 'NEURAL ATS' : 'NEURAL ATS QUANTUM ANALYZER'}
                                        </h1>
                                        <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 md:gap-2">
                                            <Radio className="w-2 h-2 md:w-3 md:h-3 animate-pulse text-green-400" />
                                            {isMobile ? 'v2.0.1' : 'AI-POWERED ANALYSIS v2.0.1'}
                                            <Activity className="w-2 h-2 md:w-3 md:h-3 text-purple-400 hidden xs:inline" />
                                        </p>
                                        {source && (
                                            <p className="text-[8px] md:text-[10px] text-gray-600">
                                                Source: {source}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className='flex gap-1'>
                                    {/* Mobile Menu Toggle */}
                                    {isMobile && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full mr-2 justify-center"
                                        >
                                            <Menu className="w-4 h-4" />
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full shrink-0 justify-center"
                                    >
                                        <X className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs - Desktop */}
                        {!isMobile && (
                            <div className="flex gap-2 px-4 md:px-6 py-3 md:py-4 border-b border-white/10 bg-black/20 overflow-x-auto">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <motion.button
                                            key={tab.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`relative px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap
                                                ${activeTab === tab.id
                                                    ? 'text-purple-400 bg-purple-500/20'
                                                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon className="w-3 h-3 md:w-4 md:h-4 inline mr-1 md:mr-2" />
                                            {tab.label}
                                            {activeTab === tab.id && (
                                                <motion.div
                                                    layoutId="activeTab"
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-purple-500 to-blue-500"
                                                />
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Mobile Navigation Menu */}
                        {isMobile && showMobileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-16 left-0 right-0 z-10 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-2"
                            >
                                <div className="grid grid-cols-4 gap-1">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setActiveTab(tab.id);
                                                    setShowMobileMenu(false);
                                                }}
                                                className={`flex flex-col items-center p-2 rounded-lg text-xs transition-all
                                                    ${activeTab === tab.id
                                                        ? 'text-purple-400 bg-purple-500/20'
                                                        : 'text-gray-400 hover:text-gray-300 hover:bg-white/5'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 mb-1" />
                                                <span className="text-[10px]">{tab.mobileLabel}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* Content Area */}
                        <div className={`
                            overflow-y-auto custom-scrollbar p-3 md:p-6
                            ${isLandscape
                                ? 'h-[calc(100%-8rem)]'
                                : isMobile
                                    ? 'h-[calc(100%-10rem)]'
                                    : 'h-[calc(100%-12rem)]'
                            }
                        `}>
                            {isAnalyzing ? (
                                <div className="flex flex-col items-center justify-center h-full px-4">
                                    <div className="relative">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'}`}
                                        >
                                            <div className="absolute inset-0 border-4 border-purple-500/30 border-t-purple-500 rounded-full" />
                                            <div className="absolute inset-2 border-4 border-blue-500/30 border-b-blue-500 rounded-full" />
                                            <div className="absolute inset-4 border-4 border-cyan-500/30 border-l-cyan-500 rounded-full" />
                                        </motion.div>
                                        <Brain className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-5 h-5' : 'w-8 h-8'} text-purple-400`} />
                                    </div>
                                    <h3 className={`font-bold text-white mt-4 md:mt-6 text-center ${isMobile ? 'text-base' : 'text-xl'}`}>
                                        NEURAL ANALYSIS IN PROGRESS
                                    </h3>
                                    <p className="text-gray-400 text-sm md:text-base text-center">Processing quantum resume patterns...</p>
                                    <div className="flex gap-1 mt-3 md:mt-4">
                                        {[...Array(isMobile ? 3 : 5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ opacity: [0.3, 1, 0.3] }}
                                                transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                                                className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                                    <AlertTriangle className="w-12 h-12 mb-4 text-red-400" />
                                    <p className="text-lg text-white mb-2">Analysis Failed</p>
                                    <p className="text-sm text-center mb-4">{error}</p>
                                    <Button
                                        onClick={analyzeResume}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            ) : analysis ? (
                                <>
                                    {/* Overview Tab */}
                                    {activeTab === 'overview' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4 md:space-y-6"
                                        >
                                            {/* Quantum Score */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-2xl md:rounded-3xl blur-xl" />
                                                <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8">
                                                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-4">
                                                        <div>
                                                            <h2 className="text-gray-400 text-xs md:text-sm mb-1 md:mb-2">QUANTUM ATS SCORE</h2>
                                                            <div className="flex items-end gap-1 md:gap-2">
                                                                <span className={`font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent
                                                                    ${isMobile ? 'text-5xl' : 'text-7xl'}`}>
                                                                    {analysis.quantum_score?.overall || 0}
                                                                </span>
                                                                <span className={`text-gray-500 mb-1 md:mb-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}>/100</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative self-end xs:self-auto">
                                                            <Gauge className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} text-purple-500/30`} />
                                                            <motion.div
                                                                initial={{ rotate: -90 }}
                                                                animate={{ rotate: -90 + (analysis.quantum_score?.overall || 0) * 1.8 }}
                                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-purple-500 rounded-full
                                                                    ${isMobile ? 'w-10 h-10 border-2' : 'w-16 h-16'}`}
                                                                style={{
                                                                    clipPath: 'polygon(50% 0%, 50% 50%, 100% 50%, 100% 0%)',
                                                                    transformOrigin: 'center',
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Neural Metrics */}
                                                    <div className="grid grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6">
                                                        <div className="p-2 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                                                            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gray-400 mb-1 md:mb-2">
                                                                <Cpu className="w-3 h-3 md:w-4 md:h-4" />
                                                                <span className="truncate">{isMobile ? 'Conf' : 'Neural Confidence'}</span>
                                                            </div>
                                                            <span className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
                                                                {analysis.quantum_score?.neural_network_confidence || 0}%
                                                            </span>
                                                        </div>
                                                        <div className="p-2 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                                                            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gray-400 mb-1 md:mb-2">
                                                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                                                <span className="truncate">{isMobile ? 'Temp' : 'Temporal Relevance'}</span>
                                                            </div>
                                                            <span className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
                                                                {analysis.quantum_score?.temporal_relevance || 0}%
                                                            </span>
                                                        </div>
                                                        <div className="p-2 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                                                            <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-sm text-gray-400 mb-1 md:mb-2">
                                                                <Brain className="w-3 h-3 md:w-4 md:h-4" />
                                                                <span className="truncate">{isMobile ? 'AI' : 'AI Prediction'}</span>
                                                            </div>
                                                            <span className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
                                                                {Math.floor((analysis.quantum_score?.overall || 0) * 1.1)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Holographic Insights - Responsive Grid */}
                                            {analysis.holographic_insights && (
                                                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                                    {Object.entries(analysis.holographic_insights).map(([key, value], index) => (
                                                        <motion.div
                                                            key={key}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="relative group"
                                                            onMouseEnter={() => setIsHovering(key)}
                                                            onMouseLeave={() => setIsHovering(null)}
                                                        >
                                                            <div className={`absolute inset-0 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-xl transition-opacity duration-300 ${isHovering === key ? 'opacity-100' : 'opacity-0'
                                                                }`} />
                                                            <div className="relative p-3 md:p-4 bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl">
                                                                <h3 className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 uppercase tracking-wider truncate">
                                                                    {key.replace(/_/g, ' ')}
                                                                </h3>
                                                                <p className="text-xs md:text-sm text-gray-300 line-clamp-2">{value}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Dimensions Tab */}
                                    {activeTab === 'dimensions' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-3 md:space-y-4"
                                        >
                                            {analysis.dimensional_scores && Object.entries(analysis.dimensional_scores).map(([key, data], index) => (
                                                <motion.div
                                                    key={key}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-lg md:rounded-xl overflow-hidden"
                                                >
                                                    <button
                                                        onClick={() => toggleSection(key)}
                                                        className="w-full p-3 md:p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                                            <div className={`p-1.5 md:p-2 rounded-lg bg-linear-to-r ${getScoreColor(data.score * 10)} bg-opacity-20 shrink-0`}>
                                                                <Binary className="w-3 h-3 md:w-4 md:h-4 text-white" />
                                                            </div>
                                                            <div className="text-left min-w-0">
                                                                <span className="text-sm md:text-base text-white font-medium block truncate">
                                                                    {key.replace(/_/g, ' ').toUpperCase()}
                                                                </span>
                                                                <span className="text-[10px] md:text-xs text-gray-400">
                                                                    Score: {data.score}/10
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {expandedSections.includes(key) ? (
                                                            <ChevronUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                                        )}
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedSections.includes(key) && (
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: 'auto' }}
                                                                exit={{ height: 0 }}
                                                                className="border-t border-white/10"
                                                            >
                                                                <div className="p-3 md:p-4 bg-white/5">
                                                                    <p className="text-xs md:text-sm text-gray-300">{data.analysis}</p>

                                                                    {/* Score Progress */}
                                                                    <div className="mt-2 md:mt-3">
                                                                        <div className="flex justify-between text-[10px] md:text-xs text-gray-400 mb-1">
                                                                            <span>Neural Activation</span>
                                                                            <span>{data.score * 10}%</span>
                                                                        </div>
                                                                        <div className="w-full h-1.5 md:h-2 bg-white/10 rounded-full overflow-hidden">
                                                                            <motion.div
                                                                                initial={{ width: 0 }}
                                                                                animate={{ width: `${data.score * 10}%` }}
                                                                                transition={{ duration: 1, delay: 0.2 }}
                                                                                className={`h-full bg-linear-to-r ${getScoreColor(data.score * 10)}`}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* Optimization Protocols Tab */}
                                    {activeTab === 'optimize' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-3 md:space-y-4"
                                        >
                                            {analysis.optimization_protocols?.map((protocol, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="relative group"
                                                >
                                                    <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative p-4 md:p-6 bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl">
                                                        <div className="flex flex-col xs:flex-row items-start gap-3 md:gap-4">
                                                            <div className={`p-2 md:p-3 rounded-lg bg-linear-to-r shrink-0 ${protocol.priority_level === 1 ? 'from-red-500 to-pink-500' :
                                                                protocol.priority_level === 2 ? 'from-orange-500 to-yellow-500' :
                                                                    'from-blue-500 to-purple-500'
                                                                }`}>
                                                                <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                    <h3 className="text-sm md:text-lg font-bold text-white truncate">
                                                                        {protocol.neural_category}
                                                                    </h3>
                                                                    <span className={`px-1.5 py-0.5 md:px-2 md:py-1 text-[10px] md:text-xs rounded-full shrink-0 ${protocol.priority_level === 1 ? 'bg-red-500/20 text-red-300' :
                                                                        protocol.priority_level === 2 ? 'bg-orange-500/20 text-orange-300' :
                                                                            'bg-blue-500/20 text-blue-300'
                                                                        }`}>
                                                                        P{protocol.priority_level}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs md:text-sm text-gray-300 mb-2 md:mb-3">{protocol.diagnostic}</p>
                                                                <div className="p-2 md:p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-2 md:mb-3">
                                                                    <p className="text-purple-300 text-xs md:text-sm">
                                                                        <span className="font-bold">PROTOCOL:</span> {protocol.enhancement_protocol}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-1 md:gap-2">
                                                                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-400 shrink-0" />
                                                                    <span className="text-[10px] md:text-xs text-gray-400">
                                                                        Impact:
                                                                    </span>
                                                                    <span className="text-[10px] md:text-xs font-bold text-green-400">
                                                                        +{protocol.impact_projection}/10
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}

                                    {/* Market Position Tab */}
                                    {activeTab === 'market' && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="space-y-4 md:space-y-6"
                                        >
                                            {/* Market Position Card */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-linear-to-r from-purple-600/20 to-pink-600/20 rounded-2xl md:rounded-3xl blur-xl" />
                                                <div className="relative bg-gray-800/50 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                                                    <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                                                        <Network className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                                                        <span className="truncate">{isMobile ? 'MARKET POSITION' : 'MARKET NEURAL POSITION'}</span>
                                                    </h3>
                                                    <p className="text-lg md:text-2xl font-bold bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3 md:mb-4 wrap-break-word">
                                                        {analysis.market_neural_position || "UNKNOWN"}
                                                    </p>

                                                    {analysis.competitive_neural_network && (
                                                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                                                            <div className="p-2 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                                                                <div className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
                                                                    {analysis.competitive_neural_network.percentile_rank}%
                                                                </div>
                                                                <div className="text-[10px] md:text-xs text-gray-400 truncate">Percentile</div>
                                                            </div>
                                                            <div className="p-2 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                                                                <div className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
                                                                    {analysis.competitive_neural_network.market_demand_index}/100
                                                                </div>
                                                                <div className="text-[10px] md:text-xs text-gray-400 truncate">Demand</div>
                                                            </div>
                                                            <div className="p-2 md:p-4 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                                                                <div className={`font-bold text-white ${isMobile ? 'text-base' : 'text-2xl'}`}>
                                                                    {analysis.competitive_neural_network.compensation_quantum || "N/A"}
                                                                </div>
                                                                <div className="text-[10px] md:text-xs text-gray-400 truncate">Comp.</div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Unique Value Quantum */}
                                            {analysis.unique_value_quantum && analysis.unique_value_quantum.length > 0 && (
                                                <div className="bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 md:p-6">
                                                    <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                                                        <Rocket className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                                                        <span className="truncate">{isMobile ? 'VALUE QUANTUM' : 'UNIQUE VALUE QUANTUM'}</span>
                                                    </h3>
                                                    <div className="space-y-2 md:space-y-3">
                                                        {analysis.unique_value_quantum.map((point, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.1 }}
                                                                className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-white/5 rounded-lg"
                                                            >
                                                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 shrink-0 mt-0.5" />
                                                                <span className="text-xs md:text-sm text-gray-300 wrap-break-word">{point}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </>
                            ) : null}
                        </div>

                        {/* Footer - Job Description Input */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-xl border-t border-white/10 p-2 md:p-4">
                            <button
                                onClick={() => setShowJobDescription(!showJobDescription)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <div className="flex items-center gap-1 md:gap-2 min-w-0">
                                    <Target className="w-3 h-3 md:w-4 md:h-4 text-purple-400 shrink-0" />
                                    <span className="text-xs md:text-sm text-white font-medium truncate">
                                        {isMobile ? 'JD Match' : 'Quantum Job Description Match'}
                                    </span>
                                </div>
                                {showJobDescription ? (
                                    <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                ) : (
                                    <ChevronUp className="w-3 h-3 md:w-4 md:h-4 text-gray-400 shrink-0" />
                                )}
                            </button>

                            <AnimatePresence>
                                {showJobDescription && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <textarea
                                            value={jobDescription}
                                            onChange={(e) => setJobDescription(e.target.value)}
                                            placeholder={isMobile ? "Paste job description..." : "Paste target job description for quantum neural matching..."}
                                            className="w-full mt-2 md:mt-4 p-2 md:p-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs md:text-sm"
                                            rows={isMobile ? 2 : 3}
                                        />
                                        <Button
                                            onClick={analyzeResume}
                                            className="mt-2 w-full bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs md:text-sm py-1.5 md:py-2"
                                            size={isMobile ? 'sm' : 'default'}
                                        >
                                            <Brain className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                                            {isMobile ? 'Analyze' : 'Initiate Quantum Analysis'}
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Add custom scrollbar styles
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }

        @media (min-width: 768px) {
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-linear(180deg, #9333ea, #3b82f6);
            border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-linear(180deg, #a855f7, #60a5fa);
        }

        /* Mobile touch optimizations */
        @media (max-width: 640px) {
            button {
                min-height: 44px;
                min-width: 44px;
            }
            
            input, textarea, select {
                font-size: 16px !important; /* Prevents zoom on iOS */
            }
        }

        /* Landscape mode optimizations */
        @media (orientation: landscape) and (max-height: 600px) {
            .custom-scrollbar {
                max-height: calc(100vh - 120px);
            }
        }

        /* Text wrapping utilities */
        .wrap-break-word {
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
        }
    `;
    document.head.appendChild(styleSheet);
}