"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Calendar,
    Shield,
    Edit2,
    LogOut,
    Key,
    Bell,
    Moon,
    Sun,
    ChevronRight,
    Camera,
    CheckCircle,
    Save,
    X,
    Eye,
    EyeOff,
    ChevronDown,
    Download,
    Trash2,
    AlertTriangle,
    ArrowLeft
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AccountInfoPage() {
    const { user, logout, isAuthenticated, loading, updateUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    // State for account settings
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // Password change state
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});

    // Preferences state
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Session info
    const [lastLogin, setLastLogin] = useState(null);
    const [accountAge, setAccountAge] = useState(null);

    // Load active tab from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTab = sessionStorage.getItem('activeAccountTab');
            if (savedTab) {
                setActiveTab(savedTab);
                // Clear it after reading
                sessionStorage.removeItem('activeAccountTab');
            }
        }
    }, []);

    // Calculate account age and last login
    useEffect(() => {
        if (user?.createdAt) {
            const created = new Date(user.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 30) {
                setAccountAge(`${diffDays} days`);
            } else if (diffDays < 365) {
                const months = Math.floor(diffDays / 30);
                setAccountAge(`${months} month${months > 1 ? 's' : ''}`);
            } else {
                const years = Math.floor(diffDays / 365);
                setAccountAge(`${years} year${years > 1 ? 's' : ''}`);
            }
        }

        // Get last login from localStorage or cookie
        const lastLoginStr = localStorage.getItem('lastLogin');
        if (lastLoginStr) {
            setLastLogin(new Date(lastLoginStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
        }
    }, [user]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Store the current path to redirect back after login
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            }
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleGoBack = () => {
        router.push('/');
    };

    const handleSaveProfile = async () => {
        if (!editedName.trim()) {
            toast({
                title: "❌ Validation Error",
                description: "Name cannot be empty",
                variant: "destructive",
            });
            return;
        }

        setIsSaving(true);

        try {
            const token = Cookies.get("token");

            const res = await fetch(
                `${API_BASE_URL}/api/auth/updatedetails`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: editedName,
                        email: user?.email // Keep the same email
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                // Update the user context
                if (updateUser) {
                    updateUser({ ...user, name: editedName });
                }

                toast({
                    title: "✅ Profile Updated",
                    description: "Your name has been updated successfully.",
                });

                setIsEditing(false);
            } else {
                toast({
                    title: "❌ Update Failed",
                    description: data.message || "Could not update profile.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast({
                title: "❌ Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const validatePassword = () => {
        const errors = {};

        if (!currentPassword) {
            errors.currentPassword = 'Current password is required';
        }

        if (!newPassword) {
            errors.newPassword = 'New password is required';
        } else if (newPassword.length < 6) {
            errors.newPassword = 'Password must be at least 6 characters';
        } else if (!/(?=.*[0-9])/.test(newPassword)) {
            errors.newPassword = 'Password must contain at least one number';
        }

        if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        setIsChangingPassword(true);

        try {
            const token = Cookies.get("token");

            const res = await fetch(
                `${API_BASE_URL}/api/auth/updatepassword`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    }),
                }
            );

            const data = await res.json();

            if (data.success) {
                // Clear password fields
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordErrors({});
                setShowPasswordSection(false);

                toast({
                    title: "🔐 Password Updated",
                    description: "Your password has been changed successfully.",
                });
            } else {
                toast({
                    title: "❌ Password Update Failed",
                    description: data.message || "Incorrect current password.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Password update error:", error);
            toast({
                title: "❌ Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleBackup = async () => {
        try {
            setIsBackingUp(true);
            const token = Cookies.get("token");

            const res = await fetch(`${API_BASE_URL}/api/auth/backup`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                const blob = new Blob(
                    [JSON.stringify(data.data, null, 2)],
                    { type: "application/json" }
                );

                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();

                toast({
                    title: "📦 Backup Downloaded",
                    description: "Your account data has been downloaded successfully.",
                });
            } else {
                toast({
                    title: "❌ Backup Failed",
                    description: data.message || "Could not download backup.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Backup error:", error);
            toast({
                title: "❌ Backup Failed",
                description: "Could not download backup. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirmDelete) {
            toast({
                title: "⚠️ Confirmation Required",
                description: "Please check the confirmation box before deleting your account.",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsDeleting(true);
            const token = Cookies.get("token");

            const res = await fetch(
                `${API_BASE_URL}/api/auth/deleteaccount`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (data.success) {
                toast({
                    title: "🗑 Account Deleted",
                    description: "Your account has been permanently deleted.",
                });

                await logout();
                router.push("/");
            } else {
                toast({
                    title: "❌ Delete Failed",
                    description: data.message || "Could not delete account.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Delete account error:", error);
            toast({
                title: "❌ Delete Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLoginClick = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
        router.push('/login');
    };

    const handleRegisterClick = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        }
        router.push('/register');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Update URL with hash for bookmarking
        window.location.hash = tab;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto p-8"
                >
                    <div className="w-24 h-24 bg-linear-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-12 h-12 text-purple-400" />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4">
                        Account Access Required
                    </h2>

                    <p className="text-gray-400 mb-8">
                        Please log in to view and manage your account information, settings, and preferences.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleLoginClick}
                            className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Go to Login
                        </button>

                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <button
                                onClick={handleRegisterClick}
                                className="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>

                    {/* Benefits List */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl backdrop-blur-xs">
                            <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-300">Secure Access</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl backdrop-blur-xs">
                            <User className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-300">Profile Management</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl backdrop-blur-xs">
                            <Bell className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-300">Preferences</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#00000060] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-between">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Account Information
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Manage your account settings and preferences
                        </p>
                    </motion.div>
                    {/* Back Button */}
                    <div className='justify-items-center sm:justify-items-end content-center'>
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            size="sm"
                            className="bg-[#00f3ff1c]! hover:bg-[#00f3ff30]!  border border-cyan-500/50 group flex items-center text-gray-300 hover:text-white transition-all duration-300 mb-6"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                            Back to Home
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/20 p-6">
                            {/* User Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-600 to-cyan-500 p-1">
                                        <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                                            <User className="w-12 h-12 text-gray-400" />
                                        </div>
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors">
                                        <Camera className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-white mt-4">
                                    {user?.name || 'User Name'}
                                </h2>
                                <p className="text-gray-400 text-sm truncate max-w-50">{user?.email}</p>
                                {accountAge && (
                                    <p className="text-xs text-gray-500 mt-2">
                                        Member for {accountAge}
                                    </p>
                                )}
                            </div>

                            {/* Navigation Tabs */}
                            <nav className="space-y-2">
                                <button
                                    onClick={() => handleTabChange('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                                        ? 'bg-linear-to-r from-purple-600/20 to-cyan-500/20 text-white border-l-4 border-cyan-400'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    <User className="w-5 h-5" />
                                    <span className="flex-1 text-left">Profile</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleTabChange('security')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'security'
                                        ? 'bg-linear-to-r from-purple-600/20 to-cyan-500/20 text-white border-l-4 border-cyan-400'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    <Shield className="w-5 h-5" />
                                    <span className="flex-1 text-left">Security</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleTabChange('preferences')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'preferences'
                                        ? 'bg-linear-to-r from-purple-600/20 to-cyan-500/20 text-white border-l-4 border-cyan-400'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                >
                                    <Bell className="w-5 h-5" />
                                    <span className="flex-1 text-left">Preferences</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </nav>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Main Content Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/20 p-6">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white">Profile Information</h3>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => {
                                                    setEditedName(user?.name || '');
                                                    setIsEditing(true);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSaving}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                                                            <span>Saving...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="w-4 h-4" />
                                                            <span>Save</span>
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setIsEditing(false)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    <span>Cancel</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        {/* Name Field */}
                                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Full Name</p>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                        className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                        placeholder="Enter your name"
                                                    />
                                                ) : (
                                                    <p className="text-white">{user?.name || 'Not set'}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Email Field */}
                                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Email Address</p>
                                                <p className="text-white">{user?.email}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                                                Verified
                                            </span>
                                        </div>

                                        {/* Member Since */}
                                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Member Since</p>
                                                <p className="text-white">
                                                    {user?.createdAt
                                                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })
                                                        : 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Last Login */}
                                        {lastLogin && (
                                            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                                <CheckCircle className="w-5 h-5 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-400">Last Login</p>
                                                    <p className="text-white">{lastLogin}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>

                                    <div className="space-y-6">
                                        {/* Password Change Section - Collapsible */}
                                        <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => setShowPasswordSection(!showPasswordSection)}
                                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Key className="w-5 h-5 text-purple-400" />
                                                    <span className="text-white font-medium">Change Password</span>
                                                </div>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showPasswordSection ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {showPasswordSection && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="border-t border-gray-700"
                                                    >
                                                        <div className="p-6 space-y-4">
                                                            {/* Current Password */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                    Current Password
                                                                </label>
                                                                <div className="relative">
                                                                    <input
                                                                        type={showCurrentPassword ? 'text' : 'password'}
                                                                        value={currentPassword}
                                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-white pr-10 ${passwordErrors.currentPassword
                                                                            ? 'border-red-500 focus:ring-red-500/50'
                                                                            : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/50'
                                                                            }`}
                                                                        placeholder="Enter current password"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                                                    >
                                                                        {showCurrentPassword ? (
                                                                            <EyeOff className="w-4 h-4" />
                                                                        ) : (
                                                                            <Eye className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                {passwordErrors.currentPassword && (
                                                                    <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>
                                                                )}
                                                            </div>

                                                            {/* New Password */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                    New Password
                                                                </label>
                                                                <div className="relative">
                                                                    <input
                                                                        type={showNewPassword ? 'text' : 'password'}
                                                                        value={newPassword}
                                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-white pr-10 ${passwordErrors.newPassword
                                                                            ? 'border-red-500 focus:ring-red-500/50'
                                                                            : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/50'
                                                                            }`}
                                                                        placeholder="Enter new password"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                                                    >
                                                                        {showNewPassword ? (
                                                                            <EyeOff className="w-4 h-4" />
                                                                        ) : (
                                                                            <Eye className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                {passwordErrors.newPassword && (
                                                                    <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>
                                                                )}
                                                            </div>

                                                            {/* Confirm Password */}
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                                    Confirm New Password
                                                                </label>
                                                                <div className="relative">
                                                                    <input
                                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                                        value={confirmPassword}
                                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                                        className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-white pr-10 ${passwordErrors.confirmPassword
                                                                            ? 'border-red-500 focus:ring-red-500/50'
                                                                            : 'border-gray-600 focus:border-purple-500 focus:ring-purple-500/50'
                                                                            }`}
                                                                        placeholder="Confirm new password"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                                                                    >
                                                                        {showConfirmPassword ? (
                                                                            <EyeOff className="w-4 h-4" />
                                                                        ) : (
                                                                            <Eye className="w-4 h-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                {passwordErrors.confirmPassword && (
                                                                    <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>
                                                                )}
                                                            </div>

                                                            {/* Password Requirements */}
                                                            {newPassword && (
                                                                <div className="text-xs text-gray-400 space-y-1 mt-2">
                                                                    <p className="font-medium text-gray-300">Password requirements:</p>
                                                                    <ul className="list-disc list-inside space-y-1">
                                                                        <li className={newPassword.length >= 6 ? 'text-green-400' : ''}>
                                                                            ✓ At least 6 characters
                                                                        </li>
                                                                        <li className={/(?=.*[0-9])/.test(newPassword) ? 'text-green-400' : ''}>
                                                                            ✓ Contains at least one number
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            <button
                                                                onClick={handleChangePassword}
                                                                disabled={isChangingPassword}
                                                                className="w-full px-4 py-3 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                            >
                                                                {isChangingPassword ? (
                                                                    <>
                                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                        <span>Updating Password...</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Key className="w-4 h-4" />
                                                                        <span>Update Password</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Two-Factor Authentication */}
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Shield className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Two-Factor Authentication</p>
                                                        <p className="text-sm text-gray-400">
                                                            {twoFactor ? 'Enabled' : 'Disabled'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setTwoFactor(!twoFactor)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-purple-600' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Add an extra layer of security to your account. Once enabled, you'll need a verification code from your authenticator app.
                                            </p>
                                        </div>

                                        {/* Active Sessions */}
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Active Sessions</p>
                                                        <p className="text-sm text-gray-400">1 active session</p>
                                                    </div>
                                                </div>
                                                <button className="text-sm text-red-400 hover:text-red-300">
                                                    Sign out all
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                This device is currently active. Sign out from other devices if you don't recognize them.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Backup Data Card */}
                                            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                                        <Download className="w-5 h-5 text-green-400" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-green-400">Backup Data</h4>
                                                </div>

                                                <p className="text-gray-400 text-sm mb-4">
                                                    Download a complete backup of all your resumes, templates, and personal data. Keep your information safe and secure.
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                        <span>All resumes and templates</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                        <span>Personal information and settings</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                                        <span>JSON format for easy import</span>
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={handleBackup}
                                                    disabled={isBackingUp}
                                                    className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                                                >
                                                    {isBackingUp ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Downloading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Download className="w-4 h-4" />
                                                            <span>Download Backup</span>
                                                        </>
                                                    )}
                                                </Button>

                                                <p className="text-xs text-gray-500 text-center mt-3">
                                                    Last backup: Not available • File size: ~2.5 MB
                                                </p>
                                            </div>

                                            {/* Danger Zone Card */}
                                            <div className="bg-gray-800/50 p-6 rounded-lg border border-red-500/30 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16"></div>

                                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                                    <div className="p-2 bg-red-500/10 rounded-lg">
                                                        <AlertTriangle className="w-5 h-5 text-red-400" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-red-400">Danger Zone</h4>
                                                </div>

                                                <p className="text-gray-400 text-sm mb-4 relative z-10">
                                                    Permanently delete your account and all associated data. This action cannot be undone.
                                                </p>

                                                <div className="space-y-2 mb-4 relative z-10">
                                                    <div className="flex items-center gap-2 text-sm text-red-300">
                                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                                        <span>All resumes will be permanently deleted</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-red-300">
                                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                                        <span>Account information will be erased</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-red-300">
                                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                                        <span>This action is irreversible</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-4 relative z-10">
                                                    <input
                                                        type="checkbox"
                                                        id="confirmDelete"
                                                        checked={confirmDelete}
                                                        onChange={(e) => setConfirmDelete(e.target.checked)}
                                                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600 focus:ring-red-500 focus:ring-offset-gray-800"
                                                    />
                                                    <label htmlFor="confirmDelete" className="text-xs text-gray-400">
                                                        I understand that this action is permanent and cannot be undone
                                                    </label>
                                                </div>

                                                <Button
                                                    onClick={handleDeleteAccount}
                                                    disabled={isDeleting}
                                                    className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 relative z-10 disabled:opacity-50 disabled:hover:scale-100"
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Deleting Account...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>Delete Account</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>

                                        </div>
                                        {/* Help Section */}
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-1/8 p-1 bg-blue-500/20 rounded-full">
                                                    <span className="text-blue-400 text-sm font-bold">?</span>
                                                </div>
                                                <p className="text-sm text-blue-300 w-7/8">
                                                    Need help? Contact our support team at support@resumeai.com or visit our help center.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6">Preferences</h3>

                                    <div className="space-y-4">
                                        {/* Notifications */}
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Bell className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Email Notifications</p>
                                                        <p className="text-sm text-gray-400">
                                                            Receive updates about your account
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setNotifications(!notifications)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Dark Mode */}
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {darkMode ? (
                                                        <Moon className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <Sun className="w-5 h-5 text-gray-400" />
                                                    )}
                                                    <div>
                                                        <p className="text-white font-medium">Dark Mode</p>
                                                        <p className="text-sm text-gray-400">
                                                            Toggle between light and dark theme
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setDarkMode(!darkMode)}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Language Preference */}
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1">
                                                        <p className="text-white font-medium">Language</p>
                                                        <p className="text-sm text-gray-400">Select your preferred language</p>
                                                    </div>
                                                </div>
                                                <select className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                                    <option value="en">English</option>
                                                    <option value="es">Spanish</option>
                                                    <option value="fr">French</option>
                                                    <option value="de">German</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}