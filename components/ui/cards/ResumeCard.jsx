"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, MoreVertical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeQuickActions } from "@/components/FunctionComponent/ResumeOperations";

export function ResumeCard({ resume, onActionComplete }) {
    const router = useRouter();
    const [showActions, setShowActions] = useState(false);
    const resumeId = resume.resume_id || resume.id;
    const firstName = resume.resume_title || resume.full_name?.split(' ')[0] || 'Untitled';

    const handleOpenEditor = (e) => {
        e.stopPropagation();
        router.push(`/editor?resumeId=${resumeId}&data=${encodeURIComponent(JSON.stringify(resume))}&template=${resume.template || 'modern'}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative cursor-pointer"
            onMouseEnter={() => setShowActions(false)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="absolute -inset-0.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

            <div className="relative bg-linear-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 hover:border-purple-500">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                            <FileText className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                                {firstName}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {resume.template || 'Modern'} Template
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions Dropdown */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(!showActions);
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>

                        {showActions && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ResumeQuickActions
                                    resume={resume}
                                    onActionComplete={onActionComplete}
                                    showLabels={true}
                                />
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Rest of the card content */}
                <div className="space-y-3 mb-6 h-32">
                    {resume.professional_summary && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                            {resume.professional_summary}
                        </p>
                    )}
                </div>

                {/* Footer with main action */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                        ID: #{resumeId?.toString().slice(-4)}
                    </span>
                    <Button
                        variant="ghost"
                        className="flex items-center group/btn text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        onClick={handleOpenEditor}
                    >
                        Open Artifact
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}