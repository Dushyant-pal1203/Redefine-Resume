// components/Sections/Navbar.jsx
"use client"; // If using Next.js App Router

import { useState, useEffect } from 'react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking on a link
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg'
            : 'bg-gray-900/90 backdrop-blur-sm border-b border-gray-800'
            }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center overflow-hidden">
                            <a href="/" className="inline-block">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity">
                                    <img
                                        src="/images/RRLogo.png"
                                        alt="Resume Logo"
                                        className="w-full h-full object-cover p-1"
                                    />
                                </div>
                            </a>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-cyan-300">
                                REDEFINED DOCUMENT
                            </span>
                            <span className='text-sm text-gray-200'>Elevate Your Career Path</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                        <a
                            href="#templates"
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 font-medium"
                        >
                            Templates
                        </a>
                        <a
                            href="#features"
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 font-medium"
                        >
                            Features
                        </a>
                        <a
                            href="#artifacts"
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 font-medium"
                        >
                            Artifacts
                        </a>
                        <button className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity duration-200 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95">
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-gray-800 transition-colors"
                        aria-label="Toggle menu"
                        aria-expanded={isMenuOpen}
                    >
                        <div className="relative w-6 h-6">
                            <span
                                className={`absolute top-1/2 left-0 w-6 h-0.5 bg-gray-300 transition-all duration-300
                                   ${isMenuOpen ? 'rotate-45' : '-translate-y-2'}
                                `}
                            />
                            <span
                                className={`absolute top-1/2 left-0 w-6 h-0.5 bg-gray-300 transition-all duration-300
                                   ${isMenuOpen ? 'opacity-0' : ''}
                                `}
                            />
                            <span
                                className={`absolute top-1/2 left-0 w-6 h-0.5 bg-gray-300 transition-all duration-300
                                   ${isMenuOpen ? '-rotate-45' : 'translate-y-2'}
                                `}
                            />
                        </div>

                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="flex flex-col space-y-4 py-4 border-t border-gray-800">
                        <a
                            href="#templates"
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-800/50"
                            onClick={handleLinkClick}
                        >
                            Templates
                        </a>
                        <a
                            href="#features"
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-800/50"
                            onClick={handleLinkClick}
                        >
                            Features
                        </a>
                        <a
                            href="#artifacts"
                            className="text-gray-300 hover:text-cyan-300 transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-gray-800/50"
                            onClick={handleLinkClick}
                        >
                            Artifacts
                        </a>
                        <button
                            className="mt-2 px-5 py-3 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg hover:opacity-90 transition-opacity duration-200 font-semibold w-full text-center"
                            onClick={handleLinkClick}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}