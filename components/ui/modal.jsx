'use client';

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";
import { useEffect } from "react";

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = "md",
    showCloseButton = true,
}) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const sizes = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className={`relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                                    {description && (
                                        <p className="text-sm text-gray-400 mt-1">{description}</p>
                                    )}
                                </div>
                                {showCloseButton && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-6">{children}</div>

                            {/* Footer */}
                            {footer && (
                                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
                                    {footer}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}