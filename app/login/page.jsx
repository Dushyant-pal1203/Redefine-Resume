"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [redirectPath, setRedirectPath] = useState('/');

    const { login } = useAuth();
    const router = useRouter();

    const handleGoBack = () => {
        router.push('/');
    };

    // Get the redirect path from sessionStorage when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
            if (savedRedirect) {
                setRedirectPath(savedRedirect);
                sessionStorage.removeItem('redirectAfterLogin');
            }
        }
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const result = await login(email, password);

            if (result.success) {
                router.push(redirectPath);

            } else {
                setErrors({
                    general: result.error || 'Invalid email or password'
                });
            }
        } catch (error) {
            setErrors({
                general: 'An error occurred. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#00000060] flex justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Back Button */}
                <Button
                    onClick={handleGoBack}
                    variant="ghost"
                    size="sm"
                    className="bg-[#00f3ff1c]! hover:bg-[#00f3ff30]!  border border-cyan-500/50 group flex items-center text-gray-300 hover:text-white transition-all duration-300 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                    Back to Home
                </Button>

                {/* Login Card */}
                <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-700">
                        <h1 className="text-2xl font-bold bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent text-center">
                            Welcome Back
                        </h1>
                        {redirectPath !== '/' && (
                            <p className="text-sm text-gray-400 text-center mt-2">
                                Please login to continue to the requested page
                            </p>
                        )}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* General Error Message */}
                        {errors.general && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-sm text-red-400 text-center">
                                    {errors.general}
                                </p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.email
                                        ? 'border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                                        }`}
                                    placeholder="john@example.com"
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:outline-none transition-all ${errors.password
                                        ? 'border-red-500 focus:ring-red-500/20'
                                        : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500/20'
                                        }`}
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-linear-to-r from-purple-600 to-cyan-500 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </>
                            )}
                        </button>

                        {/* Register Link */}
                        <p className="text-center text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>

                        {/* Redirect Info */}
                        {redirectPath !== '/' && (
                            <p className="text-xs text-gray-500 text-center mt-4">
                                You'll be redirected to {redirectPath} after successful login
                            </p>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    );
}