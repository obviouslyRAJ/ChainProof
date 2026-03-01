"use client";

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, Lock, Globe, ArrowRight, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Scene3D from '@/components/3d/Scene3D';
import FloatingCard from '@/components/Hero/FloatingCard';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">ChainProof <span className="text-blue-500">Lite</span></span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8"
          >
            <Link href="/verify" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Verify Certificate</Link>
            <Link href="/admin" className="text-sm font-medium px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all shadow-lg">Admin Dashboard</Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-12 pb-24 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full animate-pulse duration-700"></div>
        </div>

        {/* 3D Scene */}
        <Scene3D />

        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">The Future of Credentials</span>
            </div>

            <h1 className="text-6xl md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[0.9] text-white">
              Immutable <br />
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">Verification.</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-xl mb-12 leading-relaxed">
              Verify any document&apos;s authenticity in seconds using cryptographically secured blockchain proofs. Trust, without borders.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/verify" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-600/20">
                Launch Verification <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-3 text-slate-300 font-bold hover:text-white transition-colors group">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Play size={18} fill="currentColor" />
                </div>
                See how it works
              </button>
            </div>
          </motion.div>

          {/* Right Column: Floating Assets */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <FloatingCard />

            {/* Soft glow behind card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 blur-[80px] rounded-full -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Lock, title: "Tamper Proof", desc: "Every certificate hash is permanently etched onto the Polygon blockchain, making edits impossible to hide." },
            { icon: Globe, title: "Global Access", desc: "No central database. Verify any document from anywhere in the world, 24/7, with zero downtime." },
            { icon: FileCheck, title: "Instant Proof", desc: "Verification happens in milliseconds. No more back-and-forth emails or phone calls to verify credentials." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/50 hover:border-blue-500/40 transition-all backdrop-blur-sm"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <feature.icon className="text-blue-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-blue-600/5 blur-[100px] rounded-full -z-10"></div>
        <p className="font-medium text-slate-500 mb-2">Designed for the Next Generation of Trust.</p>
        <p className="text-xs text-slate-600">© 2026 ChainProof Lite. Empowering Decentralized Credentials.</p>
      </footer>
    </div>
  );
}
