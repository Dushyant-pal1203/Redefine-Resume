"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import UserMenu from '@/components/Auth/UserMenu';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when window resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isMenuOpen && !e.target.closest('.mobile-menu') && !e.target.closest('.menu-button')) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/templates', label: 'Templates', icon: Sparkles },
        { href: '#features', label: 'Features' },
        { href: '#artifacts', label: 'Artifacts' },
    ];

    const handleLoginClick = () => {
        // Store the current path to redirect back after login
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
        router.push('/login');
    };

    const handleRegisterClick = () => {
        // Store the current path to redirect back after registration
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
        router.push('/register');
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled
                ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg'
                : 'bg-[#000000a0]'
                }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Logo Section */}
                        <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src="/images/RRLogo.png"
                                    alt="Resume Redefined"
                                    className="w-full h-full object-cover p-1"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg md:text-xl font-bold bg-linear-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
                                    REDEFINED RESUME
                                </span>
                                <span className="text-xs md:text-sm text-gray-400">
                                    Elevate Your Career Path
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 font-medium relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-purple-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            ))}

                            {isLoading ? (
                                <div className="w-24 h-10 bg-gray-800 animate-pulse rounded-lg"></div>
                            ) : isAuthenticated ? (
                                <UserMenu />
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Button
                                        onClick={handleLoginClick}
                                        size="sm"
                                        variant="ghost"
                                        className="px-5 py-2.5 text-gray-300 hover:text-white transition-colors duration-200 font-medium flex items-center gap-2 hover:shadow-xl hover:scale-105 active:scale-95"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Login
                                    </Button>
                                    <Button
                                        onClick={handleRegisterClick}
                                        size="sm"
                                        className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Sign Up
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden menu-button relative w-10 h-10 rounded-lg hover:bg-gray-800/50 transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <AnimatePresence mode="wait">
                                {isMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <X className="w-6 h-6 text-gray-300" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <Menu className="w-6 h-6 text-gray-300" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden mobile-menu overflow-hidden"
                            >
                                <div className="py-4 space-y-2 border-t border-gray-800">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block px-4 py-3 text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                                        >
                                            {link.label}
                                        </Link>
                                    ))}

                                    {isLoading ? (
                                        <div className="px-4 py-3">
                                            <div className="h-10 bg-gray-800 animate-pulse rounded-lg"></div>
                                        </div>
                                    ) : isAuthenticated ? (
                                        <div className="px-4 py-3">
                                            <UserMenu />
                                        </div>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    handleLoginClick();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-gray-300 hover:text-cyan-300 hover:bg-gray-800/50 rounded-lg transition-all duration-200 flex items-center gap-2"
                                            >
                                                <LogIn className="w-4 h-4" />
                                                Login
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handleRegisterClick();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-white bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-all duration-200 flex items-center gap-2"
                                            >
                                                <UserPlus className="w-4 h-4" />
                                                Sign Up
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding under fixed navbar */}
            <div className="h-16 md:h-20"></div>
        </>
    );
}