"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import { Loader2 } from "lucide-react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

function ProfileContent() {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setIsLoading(false);
        }
    }, [user]);

    const handleUpdateDetails = async () => {
        try {
            setLoading(true);

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
                    body: JSON.stringify({ name, email }),
                }
            );

            const data = await res.json();

            if (data.success) {
                updateUser(data.data);

                toast({
                    title: "✅ Profile Updated",
                    description: "Your details were updated successfully.",
                });
            } else {
                toast({
                    title: "❌ Update Failed",
                    description: data.message || "Could not update profile.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "❌ Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        try {
            setLoading(true);

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
                    body: JSON.stringify({ currentPassword, newPassword }),
                }
            );

            const data = await res.json();

            if (data.success) {
                setCurrentPassword("");
                setNewPassword("");

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
            toast({
                title: "❌ Error",
                description: "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 text-white bg-[#00000060]">
            <div className="">
                <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Profile Settings
                    <div className="bg-linear-to-r from-purple-400 to-cyan-400 mt-2 w-28 h-1"></div>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Forms */}
                    <div className="space-y-6">
                        {/* Update Details */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Update Profile
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-400"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-400"
                                        placeholder="john@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <Button
                                    disabled={loading}
                                    onClick={handleUpdateDetails}
                                    className="w-full mt-2 bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Saving Changes...
                                        </span>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Change Password */}
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-cyan-500 rounded-full"></span>
                                Change Password
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder-gray-400"
                                        placeholder="••••••••"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder-gray-400"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>

                                {newPassword && (
                                    <div className="text-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            <span className="text-gray-400">At least 8 characters</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            <span className="text-gray-400">One uppercase letter</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                                            <span className="text-gray-400">One number</span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    disabled={loading}
                                    onClick={handleUpdatePassword}
                                    className="w-full mt-2 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Updating Password...
                                        </span>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Logo & Info */}
                    <div className="bg-linear-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-xl p-8 flex flex-col items-center justify-center min-h-100">
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full"></div>
                            <img
                                src="/images/RRLogo.png"
                                alt="ResumeAI Logo"
                                className="relative z-10 w-48 h-48 object-contain mb-6 animate-pulse-slow"
                            />
                        </div>

                        <h3 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            ResumeAI
                        </h3>

                        <p className="text-gray-400 text-center max-w-sm">
                            Your professional resume builder with AI-powered suggestions and multiple template options
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8 w-full">
                            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-purple-400">5+</div>
                                <div className="text-xs text-gray-500">Templates</div>
                            </div>
                            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                                <div className="text-2xl font-bold text-cyan-400">AI</div>
                                <div className="text-xs text-gray-500">Powered</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.9; transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}