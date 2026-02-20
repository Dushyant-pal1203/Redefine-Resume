"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { Loader2 } from "lucide-react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

function SettingsContent() {
    const router = useRouter();
    const { logout } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleBackup = async () => {
        try {
            setIsLoading(true);
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
                a.download = "account-backup.json";
                a.click();

                toast({
                    title: "📦 Backup Downloaded",
                    description: "Your account data has been downloaded.",
                });
            }
        } catch (error) {
            toast({
                title: "❌ Backup Failed",
                description: "Could not download backup.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
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
            setIsLoading(true);
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
            }
        } catch (error) {
            toast({
                title: "❌ Delete Failed",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#00000060] p-6 text-white">
            <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Account Settings
                <div className="bg-linear-to-r from-purple-400 to-cyan-400 mt-2 w-28 h-1"></div>
            </h1>

            <div className="grid grid-cols-1 gap-8 items-start">
                {/* Logo & Branding - Left Column */}
                <div className="bg-linear-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl p-8 flex flex-col items-center justify-center min-h-100 order-2 lg:order-1">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-purple-500/30 to-cyan-500/30 blur-3xl rounded-full animate-pulse"></div>
                        <div className="relative z-10 transform transition-transform duration-500 hover:scale-110">
                            <img
                                src="/images/RRLogo.png"
                                alt="ResumeAI Logo"
                                className="w-48 h-48 object-contain mb-6 animate-float"
                            />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                        ResumeAI
                    </h3>

                    <p className="text-gray-400 text-center max-w-sm mb-6">
                        Secure your data and manage your account settings
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
                            <div className="text-2xl font-bold text-purple-400">100%</div>
                            <div className="text-xs text-gray-500">Data Encrypted</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700/50">
                            <div className="text-2xl font-bold text-cyan-400">24/7</div>
                            <div className="text-xs text-gray-500">Backup Available</div>
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 order-1 lg:order-2">
                    {/* Backup Data Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-green-400">Backup Data</h2>
                        </div>

                        <p className="text-gray-400 text-sm mb-6">
                            Download a complete backup of all your resumes, templates, and personal data. Keep your information safe and secure.
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>All resumes and templates</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Personal information and settings</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>JSON format for easy import</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleBackup}
                            disabled={isLoading}
                            className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            )}
                            {isLoading ? "Downloading..." : "Download Backup"}
                        </Button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Last backup: Not available • File size: ~2.5 MB
                        </p>
                    </div>

                    {/* Danger Zone Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-red-500/30 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-500/10 rounded-xl">
                                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
                        </div>

                        <p className="text-gray-400 text-sm mb-6">
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </p>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-red-300">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>All resumes will be permanently deleted</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-red-300">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Account information will be erased</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-red-300">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>This action is irreversible</span>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 mb-4">
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
                            disabled={isLoading}
                            className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 group/danger relative overflow-hidden disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover/danger:translate-x-full transition-transform duration-700"></span>
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                            {isLoading ? "Deleting..." : "Delete Account"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mt-8">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-300">
                        Need help? Contact our support team at support@resumeai.com or visit our help center.
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }
                .animate-pulse {
                    animation: pulse 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}