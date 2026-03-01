"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function FloatingCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{
                opacity: 1,
                y: [0, -20, 0],
                rotateX: [15, 5, 15],
                rotateY: [5, -5, 5]
            }}
            transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className="relative z-10 w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden group"
        >
            {/* Glowing Border Background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

            {/* Card Content */}
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl h-full flex flex-col p-8 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="text-blue-400" size={28} />
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Secured</span>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    <div className="h-4 w-2/3 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500/30 w-1/2 animate-shimmer"></div>
                    </div>
                    <div className="h-4 w-full bg-slate-800 rounded-full"></div>
                    <div className="h-4 w-3/4 bg-slate-800 rounded-full"></div>

                    <div className="pt-8 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-center mb-4">
                            <FileText className="text-blue-500/20" size={48} />
                        </div>
                        <p className="text-slate-500 font-mono text-[10px]">0x72a...9b2c</p>
                    </div>
                </div>

                <div className="mt-auto border-t border-slate-800 pt-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-emerald-400"></div>
                        <div>
                            <p className="text-xs font-bold text-slate-300">Blockchain Certified</p>
                            <p className="text-[10px] text-slate-500">Global Verification System</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
