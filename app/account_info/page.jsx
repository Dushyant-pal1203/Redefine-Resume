"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Calendar, Shield, Edit2, LogOut, Key, Bell, Moon, Sun,
    ChevronRight, Camera, CheckCircle, Save, X, Eye, EyeOff, ChevronDown,
    Download, Trash2, AlertTriangle, ArrowLeft, Loader2, Image as ImageIcon
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function AccountInfoPage() {
    const { user, logout, isAuthenticated, loading, updateUser } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // Avatar states
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [avatarKey, setAvatarKey] = useState(Date.now());

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
    const [lastLogin, setLastLogin] = useState(null);
    const [accountAge, setAccountAge] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTab = sessionStorage.getItem('activeAccountTab');
            if (savedTab) setActiveTab(savedTab);
        }
    }, []);

    useEffect(() => {
        if (user?.createdAt) {
            const created = new Date(user.createdAt);
            const diffDays = Math.ceil(Math.abs(new Date() - created) / (1000 * 60 * 60 * 24));
            if (diffDays < 30) setAccountAge(`${diffDays} days`);
            else if (diffDays < 365) setAccountAge(`${Math.floor(diffDays / 30)} months`);
            else setAccountAge(`${Math.floor(diffDays / 365)} years`);
        }

        const lastLoginStr = localStorage.getItem('lastLogin');
        if (lastLoginStr) {
            setLastLogin(new Date(lastLoginStr).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    useEffect(() => {
        setAvatarError(false);
    }, [user?.avatar]);

    useEffect(() => {
        if (user?.avatar) {
            // Small delay to ensure the DOM is ready
            const timer = setTimeout(() => {
                setAvatarKey(Date.now());
                setAvatarError(false);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [user?.avatar]);

    // Add this useEffect after your other useEffects to debug
    useEffect(() => {
        if (user) {
            console.log("Current user avatar:", user.avatar);
            console.log("Avatar URL:", getAvatarUrl());
        }
    }, [user, avatarKey]);

    const getAvatarUrl = () => {
        // If we have a preview from file selection, use it
        if (avatarPreview) {
            return avatarPreview;
        }

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

            // Construct the full URL without cache busting first
            const baseUrl = `${API_BASE_URL}/uploads/avatars/${cleanAvatar}`;

            // Add cache busting only for non-default avatars
            if (!cleanAvatar.includes('default')) {
                return `${baseUrl}?t=${avatarKey}`;
            }
            return baseUrl;
        }

        // Return default avatar
        return `${API_BASE_URL}/uploads/avatars/default-avatar.png`;
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "❌ File Too Large", description: "Max 5MB", variant: "destructive" });
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast({ title: "❌ Invalid File Type", description: "Please upload an image", variant: "destructive" });
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(file);
    };

    // Handle avatar upload
    const handleAvatarUpload = async () => {
        if (!avatarFile) return;

        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_BASE_URL}/api/avatar/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                // IMPORTANT: Update the user object with the new avatar filename
                const updatedUser = {
                    ...user,
                    avatar: data.data.avatar // This is the filename
                };

                // Use the updateUser function from useAuth
                if (updateUser) {
                    updateUser(updatedUser);
                }

                // Also store in localStorage for cross-tab updates
                localStorage.setItem('user', JSON.stringify(updatedUser));

                toast({
                    title: "✅ Avatar Updated",
                    description: "Your profile picture has been updated successfully.",
                });

                // Reset states
                setAvatarFile(null);
                setAvatarPreview(null);
                setAvatarError(false);
                setAvatarKey(Date.now()); // Force re-render

                // Clear file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                toast({
                    title: "❌ Upload Failed",
                    description: data.message || "Could not upload avatar.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Avatar upload error:", error);
            toast({
                title: "❌ Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleAvatarDelete = async () => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_BASE_URL}/api/avatar`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                const updatedUser = { ...user, avatar: null };
                if (updateUser) updateUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast({ title: "✅ Avatar Removed", description: "Profile picture removed" });
                setAvatarKey(Date.now());
            } else {
                toast({ title: "❌ Delete Failed", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "❌ Error", description: "Something went wrong", variant: "destructive" });
        }
    };

    const handleAvatarError = () => {
        console.log("Avatar failed to load");
        setAvatarError(true);
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const handleGoBack = () => router.push('/');

    const handleSaveProfile = async () => {
        if (!editedName.trim()) {
            toast({ title: "❌ Validation Error", description: "Name cannot be empty", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_BASE_URL}/api/auth/updatedetails`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                credentials: "include",
                body: JSON.stringify({ name: editedName, email: user?.email }),
            });

            const data = await res.json();

            if (data.success) {
                if (updateUser) updateUser({ ...user, name: editedName });
                toast({ title: "✅ Profile Updated", description: "Name updated successfully" });
                setIsEditing(false);
            } else {
                toast({ title: "❌ Update Failed", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "❌ Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const validatePassword = () => {
        const errors = {};
        if (!currentPassword) errors.currentPassword = 'Current password required';
        if (!newPassword) errors.newPassword = 'New password required';
        else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
        else if (!/(?=.*[0-9])/.test(newPassword)) errors.newPassword = 'Password must contain a number';
        if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validatePassword()) return;

        setIsChangingPassword(true);
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${API_BASE_URL}/api/auth/updatepassword`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (data.success) {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordErrors({});
                setShowPasswordSection(false);
                toast({ title: "🔐 Password Updated", description: "Password changed successfully" });
            } else {
                toast({ title: "❌ Password Update Failed", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "❌ Error", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleBackup = async () => {
        try {
            setIsBackingUp(true);
            const token = Cookies.get("token");
            const res = await fetch(`${API_BASE_URL}/api/auth/backup`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                toast({ title: "📦 Backup Downloaded", description: "Data downloaded successfully" });
            } else {
                toast({ title: "❌ Backup Failed", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "❌ Backup Failed", description: "Could not download backup", variant: "destructive" });
        } finally {
            setIsBackingUp(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirmDelete) {
            toast({ title: "⚠️ Confirmation Required", description: "Please confirm before deleting", variant: "destructive" });
            return;
        }

        try {
            setIsDeleting(true);
            const token = Cookies.get("token");
            const res = await fetch(`${API_BASE_URL}/api/auth/deleteaccount`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                toast({ title: "🗑 Account Deleted", description: "Account permanently deleted" });
                await logout();
                router.push("/");
            } else {
                toast({ title: "❌ Delete Failed", description: data.message, variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "❌ Delete Failed", description: "Something went wrong", variant: "destructive" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLoginClick = () => {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push('/login');
    };

    const handleRegisterClick = () => {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        router.push('/register');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md mx-auto p-8">
                    <div className="w-24 h-24 bg-linear-to-br from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-12 h-12 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Account Access Required</h2>
                    <p className="text-gray-400 mb-8">Please log in to view and manage your account.</p>
                    <div className="space-y-4">
                        <button onClick={handleLoginClick} className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90">
                            Go to Login
                        </button>
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <button onClick={handleRegisterClick} className="text-purple-400 hover:underline">Sign up here</button>
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black/60 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 justify-between">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                            Account Information
                        </h1>
                        <p className="text-gray-400 mt-2">Manage your account settings and preferences</p>
                    </motion.div>
                    <div className="justify-items-center sm:justify-items-end content-center">
                        <Button onClick={handleGoBack} variant="ghost" size="sm" className="bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/50 group flex items-center text-gray-300 hover:text-white">
                            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
                        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/20 p-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-600 to-cyan-500 p-1">
                                        <div className="w-full h-full rounded-full bg-gray-900 overflow-hidden">
                                            {avatarError ? (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                                    <ImageIcon className="w-8 h-8 text-gray-500" />
                                                </div>
                                            ) : (
                                                <img
                                                    key={avatarKey}
                                                    src={getAvatarUrl()}
                                                    alt={user?.name || 'User'}
                                                    className="w-full h-full object-cover"
                                                    crossOrigin="anonymous"
                                                    referrerPolicy="no-referrer"
                                                    onError={(e) => {
                                                        console.error("Image failed to load:", e.target.src);
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
                                                        console.log("Image loaded successfully");
                                                        setAvatarError(false);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleAvatarSelect}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingAvatar}
                                            className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            <Camera className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Upload controls */}
                                {avatarPreview && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={handleAvatarUpload}
                                            disabled={isUploadingAvatar}
                                            className="flex items-center gap-1 px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            {isUploadingAvatar ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    <span>Uploading...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-3 h-3" />
                                                    <span>Save</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setAvatarPreview(null);
                                                setAvatarFile(null);
                                                setAvatarError(false);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                            className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {/* Delete button */}
                                {user?.avatar && !avatarPreview && (
                                    <button
                                        onClick={handleAvatarDelete}
                                        className="mt-2 text-xs text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Remove avatar
                                    </button>
                                )}

                                <h2 className="text-xl font-bold text-white mt-2">
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
                                {['profile', 'security', 'preferences'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === tab
                                            ? 'bg-linear-to-r from-purple-600/20 to-cyan-500/20 text-white border-l-4 border-cyan-400'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                            }`}
                                    >
                                        {tab === 'profile' && <User className="w-5 h-5" />}
                                        {tab === 'security' && <Shield className="w-5 h-5" />}
                                        {tab === 'preferences' && <Bell className="w-5 h-5" />}
                                        <span className="flex-1 text-left capitalize">{tab}</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ))}
                            </nav>

                            <button onClick={handleLogout} className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30">
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-3">
                        <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl border border-purple-500/20 p-6">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-white">Profile Information</h3>
                                        {!isEditing ? (
                                            <button onClick={() => { setEditedName(user?.name || ''); setIsEditing(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30">
                                                <Edit2 className="w-4 h-4" />
                                                <span>Edit Profile</span>
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button onClick={handleSaveProfile} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 disabled:opacity-50">
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                                                </button>
                                                <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30">
                                                    <X className="w-4 h-4" />
                                                    <span>Cancel</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Full Name</p>
                                                {isEditing ? (
                                                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Enter your name" />
                                                ) : (
                                                    <p className="text-white">{user?.name || 'Not set'}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Email Address</p>
                                                <p className="text-white">{user?.email}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">Verified</span>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Member Since</p>
                                                <p className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</p>
                                            </div>
                                        </div>

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
                                        {/* Password Change */}
                                        <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
                                            <button onClick={() => setShowPasswordSection(!showPasswordSection)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/50">
                                                <div className="flex items-center gap-3">
                                                    <Key className="w-5 h-5 text-purple-400" />
                                                    <span className="text-white font-medium">Change Password</span>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showPasswordSection ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {showPasswordSection && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-gray-700">
                                                        <div className="p-6 space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                                                                <div className="relative">
                                                                    <input type={showCurrentPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'}`} placeholder="Enter current password" />
                                                                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                    </button>
                                                                </div>
                                                                {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.currentPassword}</p>}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                                                <div className="relative">
                                                                    <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white pr-10 ${passwordErrors.newPassword ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'}`} placeholder="Enter new password" />
                                                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                    </button>
                                                                </div>
                                                                {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.newPassword}</p>}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                                                                <div className="relative">
                                                                    <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-600 focus:border-purple-500'}`} placeholder="Confirm new password" />
                                                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                    </button>
                                                                </div>
                                                                {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-400">{passwordErrors.confirmPassword}</p>}
                                                            </div>

                                                            <button onClick={handleChangePassword} disabled={isChangingPassword} className="w-full px-4 py-3 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                                                                {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                                                                <span>{isChangingPassword ? 'Updating...' : 'Update Password'}</span>
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
                                                        <p className="text-sm text-gray-400">{twoFactor ? 'Enabled' : 'Disabled'}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setTwoFactor(!twoFactor)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactor ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Backup & Danger Zone */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-green-500/10 rounded-lg"><Download className="w-5 h-5 text-green-400" /></div>
                                                    <h4 className="text-lg font-semibold text-green-400">Backup Data</h4>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-4">Download a complete backup of all your data.</p>
                                                <Button onClick={handleBackup} disabled={isBackingUp} className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                                    {isBackingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                                    <span>{isBackingUp ? 'Downloading...' : 'Download Backup'}</span>
                                                </Button>
                                            </div>

                                            <div className="bg-gray-800/50 p-6 rounded-lg border border-red-500/30">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-400" /></div>
                                                    <h4 className="text-lg font-semibold text-red-400">Danger Zone</h4>
                                                </div>
                                                <p className="text-gray-400 text-sm mb-4">Permanently delete your account and all associated data.</p>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <input type="checkbox" id="confirmDelete" checked={confirmDelete} onChange={(e) => setConfirmDelete(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-red-600" />
                                                    <label htmlFor="confirmDelete" className="text-xs text-gray-400">I understand this action is permanent</label>
                                                </div>
                                                <Button onClick={handleDeleteAccount} disabled={isDeleting} className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
                                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    <span>{isDeleting ? 'Deleting...' : 'Delete Account'}</span>
                                                </Button>
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
                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Bell className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-white font-medium">Email Notifications</p>
                                                        <p className="text-sm text-gray-400">Receive updates about your account</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setNotifications(!notifications)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {darkMode ? <Moon className="w-5 h-5 text-gray-400" /> : <Sun className="w-5 h-5 text-gray-400" />}
                                                    <div>
                                                        <p className="text-white font-medium">Dark Mode</p>
                                                        <p className="text-sm text-gray-400">Toggle between light and dark theme</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setDarkMode(!darkMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-600'}`}>
                                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-white font-medium">Language</p>
                                                    <p className="text-sm text-gray-400">Select your preferred language</p>
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