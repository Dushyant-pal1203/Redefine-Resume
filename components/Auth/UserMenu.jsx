"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, FileText, ChevronDown, Shield, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [avatarKey, setAvatarKey] = useState(Date.now());
    const menuRef = useRef(null);
    const { user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset avatar error when user avatar changes
    useEffect(() => {
        setAvatarError(false);
        setAvatarKey(Date.now());
    }, [user?.avatar]);

    const handleLogout = async () => {
        setIsOpen(false);
        await logout();
    };

    const handleNavigation = (path, tab = null) => {
        setIsOpen(false);
        if (tab) {
            sessionStorage.setItem('activeAccountTab', tab);
        }
        router.push(path);
    };

    // Get initials from name
    const getInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.slice(0, 2).toUpperCase() || 'U';
    };

    // Get avatar URL - similar to your account page
    const getAvatarUrl = () => {
        // If user has avatar and no error
        if (user?.avatar && !avatarError) {
            // Clean the avatar path - remove any slashes or prefixes
            let cleanAvatar = user.avatar;

            // Remove any path prefixes if present
            if (cleanAvatar.includes('/')) {
                cleanAvatar = cleanAvatar.split('/').pop();
            }

            // Remove any query parameters
            if (cleanAvatar.includes('?')) {
                cleanAvatar = cleanAvatar.split('?')[0];
            }

            // Construct the full URL
            const baseUrl = `${API_BASE_URL}/uploads/avatars/${cleanAvatar}`;

            // Add cache busting only for non-default avatars
            if (!cleanAvatar.includes('default')) {
                return `${baseUrl}?t=${avatarKey}`;
            }
            return baseUrl;
        }

        // Return null to show initials
        return null;
    };

    const avatarUrl = getAvatarUrl();
    const showAvatar = avatarUrl && !avatarError;

    return (
        <div className="relative" ref={menuRef}>
            {/* User Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all border border-gray-700 hover:border-purple-500/50 group w-full justify-between"
            >
                {/* Avatar or Initials */}
                <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-semibold overflow-hidden shrink-0">
                    {showAvatar ? (
                        <img
                            key={avatarKey}
                            src={avatarUrl}
                            alt={user?.name || 'User avatar'}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                console.error("Avatar failed to load:", e.target.src);
                                // Try to reload without cache busting
                                if (e.target.src.includes('?t=')) {
                                    const cleanUrl = e.target.src.split('?')[0];
                                    console.log("Retrying with clean URL:", cleanUrl);
                                    e.target.src = cleanUrl;
                                } else {
                                    setAvatarError(true);
                                }
                            }}
                            onLoad={() => {
                                console.log("Avatar loaded successfully");
                                setAvatarError(false);
                            }}
                        />
                    ) : (
                        getInitials()
                    )}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white truncate max-w-37.5">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-37.5">{user?.email}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative md:absolute right-0 mt-2 w-full md:w-75 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-50"
                    >
                        {/* User Info with Avatar */}
                        <div className="p-4 bg-linear-to-r from-purple-600/20 to-cyan-500/20 border-b border-gray-700 flex items-center gap-3">
                            {/* Larger avatar for dropdown */}
                            <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-semibold text-lg overflow-hidden shrink-0">
                                {showAvatar ? (
                                    <img
                                        key={avatarKey}
                                        src={avatarUrl}
                                        alt={user?.name || 'User avatar'}
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            console.error("Dropdown avatar failed to load:", e.target.src);
                                            if (e.target.src.includes('?t=')) {
                                                const cleanUrl = e.target.src.split('?')[0];
                                                e.target.src = cleanUrl;
                                            } else {
                                                setAvatarError(true);
                                            }
                                        }}
                                    />
                                ) : (
                                    getInitials()
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
                                <p className="text-sm text-gray-400 truncate">{user?.email}</p>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                            <button
                                onClick={() => handleNavigation('/dashboard')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">My Dashboard</span>
                            </button>

                            <button
                                onClick={() => handleNavigation('/account_info', 'profile')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <User className="w-4 h-4" />
                                <span className="text-sm">Profile Settings</span>
                            </button>

                            <button
                                onClick={() => handleNavigation('/account_info', 'security')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <Shield className="w-4 h-4" />
                                <span className="text-sm">Security Settings</span>
                            </button>

                            {/* <button
                                onClick={() => handleNavigation('/account_info', 'preferences')}
                                className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                            >
                                <Bell className="w-4 h-4" />
                                <span className="text-sm">Preferences</span>
                            </button> */}

                            <div className="border-t border-gray-700 my-2"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}