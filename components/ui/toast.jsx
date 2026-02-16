"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Sparkles,
    Trophy,
    AlertCircle,
    Shield,
    Brain,
    Rocket,
    Zap,
    Star,
    Code,
    Palette,
    FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/* ---------------- ICON MAPPING ---------------- */

const toastIcons = {
    default: Sparkles,
    success: Trophy,
    error: AlertCircle,
    warning: Shield,
    info: Brain,
    destructive: AlertCircle,
    upload: Rocket,
    create: Zap,
    delete: FileText,
    duplicate: Star,
    quantum: Code,
    artifact: Palette,
};

/* ---------------- VARIANT STYLES ---------------- */

const variantStyles = {
    default: {
        bg: "bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900",
        border: "border-purple-500/40",
        shadow: "shadow-purple-500/20",
        icon: "text-purple-400",
        progress: "from-purple-500 via-pink-500 to-purple-500",
    },
    success: {
        bg: "bg-gradient-to-br from-gray-900 via-emerald-900/30 to-gray-900",
        border: "border-emerald-500/40",
        shadow: "shadow-emerald-500/20",
        icon: "text-emerald-400",
        progress: "from-emerald-500 via-green-500 to-emerald-500",
    },
    error: {
        bg: "bg-gradient-to-br from-gray-900 via-red-900/30 to-gray-900",
        border: "border-red-500/40",
        shadow: "shadow-red-500/20",
        icon: "text-red-400",
        progress: "from-red-500 via-rose-500 to-red-500",
    },
    warning: {
        bg: "bg-gradient-to-br from-gray-900 via-orange-900/30 to-gray-900",
        border: "border-orange-500/40",
        shadow: "shadow-orange-500/20",
        icon: "text-orange-400",
        progress: "from-orange-500 via-amber-500 to-orange-500",
    },
    info: {
        bg: "bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900",
        border: "border-blue-500/40",
        shadow: "shadow-blue-500/20",
        icon: "text-blue-400",
        progress: "from-blue-500 via-cyan-500 to-blue-500",
    },
    destructive: {
        bg: "bg-gradient-to-br from-gray-900 via-rose-900/30 to-gray-900",
        border: "border-rose-500/40",
        shadow: "shadow-rose-500/20",
        icon: "text-rose-400",
        progress: "from-rose-500 via-red-500 to-rose-500",
    },
    upload: {
        bg: "bg-gradient-to-br from-gray-900 via-cyan-900/30 to-gray-900",
        border: "border-cyan-500/40",
        shadow: "shadow-cyan-500/20",
        icon: "text-cyan-400",
        progress: "from-cyan-500 via-blue-500 to-cyan-500",
    },
    create: {
        bg: "bg-gradient-to-br from-gray-900 via-indigo-900/30 to-gray-900",
        border: "border-indigo-500/40",
        shadow: "shadow-indigo-500/20",
        icon: "text-indigo-400",
        progress: "from-indigo-500 via-purple-500 to-indigo-500",
    },
    delete: {
        bg: "bg-gradient-to-br from-gray-900 via-rose-900/30 to-gray-900",
        border: "border-rose-500/40",
        shadow: "shadow-rose-500/20",
        icon: "text-rose-400",
        progress: "from-rose-500 via-red-500 to-rose-500",
    },
    duplicate: {
        bg: "bg-gradient-to-br from-gray-900 via-yellow-900/30 to-gray-900",
        border: "border-yellow-500/40",
        shadow: "shadow-yellow-500/20",
        icon: "text-yellow-400",
        progress: "from-yellow-500 via-amber-500 to-yellow-500",
    },
    quantum: {
        bg: "bg-gradient-to-br from-gray-900 via-violet-900/30 to-gray-900",
        border: "border-violet-500/40",
        shadow: "shadow-violet-500/20",
        icon: "text-violet-400",
        progress: "from-violet-500 via-purple-500 to-violet-500",
    },
    artifact: {
        bg: "bg-gradient-to-br from-gray-900 via-pink-900/30 to-gray-900",
        border: "border-pink-500/40",
        shadow: "shadow-pink-500/20",
        icon: "text-pink-400",
        progress: "from-pink-500 via-purple-500 to-pink-500",
    },
};

/* ---------------- TOAST COMPONENT ---------------- */

function Toast({
    id,
    title,
    description,
    action,
    variant = "default",
    duration = 5000,
    onClose,
}) {
    const Icon = toastIcons[variant] || toastIcons.default;
    const styles = variantStyles[variant] || variantStyles.default;

    const [progress, setProgress] = React.useState(100);
    const [paused, setPaused] = React.useState(false);
    const [shouldClose, setShouldClose] = React.useState(false);

    // Progress animation
    React.useEffect(() => {
        if (paused) return;

        const interval = 16;
        const step = (interval / duration) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setShouldClose(true); // ✅ mark for closing
                    return 0;
                }
                return prev - step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [paused, duration]);

    // Close AFTER render cycle
    React.useEffect(() => {
        if (shouldClose) {
            onClose?.();
        }
    }, [shouldClose, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.85 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className={`relative flex items-start gap-4 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden ${styles.bg} ${styles.border} ${styles.shadow}`}
        >
            <div className="relative z-10 p-2 rounded-xl bg-white/5">
                <Icon className={`w-5 h-5 ${styles.icon}`} />
            </div>

            <div className="relative z-10 flex-1">
                {title && (
                    <h4 className="text-sm font-semibold text-white mb-1">
                        {title}
                    </h4>
                )}
                {description && (
                    <p className="text-sm text-gray-300 leading-relaxed">
                        {description}
                    </p>
                )}
                {action && <div className="mt-3">{action}</div>}
            </div>

            <button
                onClick={() => setShouldClose(true)}
                className="relative z-10 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <div
                    className={`h-full bg-linear-to-r ${styles.progress}`}
                    style={{
                        width: `${progress}%`,
                        transition: "width 0.1s linear",
                    }}
                />
            </div>
        </motion.div>
    );
}


/* ---------------- TOASTER ---------------- */

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-9999 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <Toast {...toast} onClose={() => dismiss(toast.id)} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
