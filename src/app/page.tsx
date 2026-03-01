"use client";

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  User,
  BookOpen,
  Calendar,
  Building2,
  Search,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Wallet,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ethers } from 'ethers';
import Scene3D from '@/components/3d/Scene3D';
import FloatingCard from '@/components/Hero/FloatingCard';
import { generateStructuredHash } from '@/lib/hashing';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export default function Home() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 100]);

  const [activeTab, setActiveTab] = useState<'issue' | 'verify'>('verify');
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: { txHash?: string; issuer?: string; date?: string };
  } | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0],
    issuerName: ''
  });

  useEffect(() => {
    checkWallet();
  }, []);

  const checkWallet = async () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) setAccount(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        console.error("Connection failed", err);
      }
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);

      if (activeTab === 'issue') {
        if (!account) throw new Error("Please connect your wallet to issue certificates.");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const tx = await contract.issueCertificate(
          formData.studentName,
          formData.courseName,
          formData.issueDate,
          formData.issuerName
        );
        await tx.wait();

        setResult({
          success: true,
          message: "Certificate successfully etched onto the blockchain!",
          data: { txHash: tx.hash }
        });
      } else {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const [isValid, issuer, timestamp] = await contract.verifyCertificate(
          formData.studentName,
          formData.courseName,
          formData.issueDate,
          formData.issuerName
        );

        if (isValid) {
          setResult({
            success: true,
            message: "Authenticity Verified! This certificate is genuine.",
            data: { issuer, date: new Date(timestamp.toNumber() * 1000).toLocaleDateString() }
          });
        } else {
          setResult({
            success: false,
            message: "Verification Failed. No matching record found on-chain."
          });
        }
      }
    } catch (err) {
      const error = err as { reason?: string; message?: string };
      setResult({
        success: false,
        message: error.reason || error.message || "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 overflow-x-hidden pt-20">
      {/* Navbar Overlay */}
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">ChainProof</span>
          </div>
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-800 transition-all font-bold text-xs shadow-xl group"
          >
            <Wallet size={16} className={account ? "text-emerald-400" : "text-blue-400 group-hover:rotate-12 transition-transform"} />
            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Wallet"}
          </button>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(37,99,235,0.1),transparent_70%)]" />
        <Scene3D />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
          <motion.div
            style={{ y: yHero }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Next-Gen Credentialing
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.85] text-white italic">
              TRUST <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">BY DESIGN.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg mb-12 leading-relaxed font-medium">
              Erase forgery forever. ChainProof uses deterministic hashing to secure certificates directly on the blockchain.
              Pure math. Zero doubt.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm flex items-center gap-2 group transition-all shadow-xl shadow-blue-600/20"
              >
                Launch Workspace <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:flex justify-end pr-12"
          >
            <FloatingCard />
          </motion.div>
        </div>
      </section>

      {/* Unified Workspace Section */}
      <section id="workspace" className="py-24 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Blockchain Workspace</h2>
            <p className="text-slate-500 font-medium">Select your role to interact with the immutable registry</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-4 shadow-3xl">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-8 bg-slate-950 p-2 rounded-[2rem] border border-white/5 relative overflow-hidden">
              <button
                onClick={() => { setActiveTab('verify'); setResult(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all relative z-10 ${activeTab === 'verify' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Search size={18} /> Verify Credential
              </button>
              <button
                onClick={() => { setActiveTab('issue'); setResult(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all relative z-10 ${activeTab === 'issue' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Send size={18} /> Issue Certificate
              </button>
              <motion.div
                layoutId="activeTab"
                className="absolute top-2 left-2 bottom-2 w-[calc(50%-8px)] bg-blue-600 rounded-[1.5rem] shadow-lg shadow-blue-600/20"
                animate={{ x: activeTab === 'verify' ? 0 : '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Content Area */}
            <div className="p-8 lg:p-12 min-h-[500px] flex flex-col">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 flex-1">
                {/* Left: Input Form */}
                <form onSubmit={handleAction} className="space-y-6">
                  <div className="space-y-4">
                    <div className="group">
                      <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest mb-2 block">Recipient Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          required
                          type="text"
                          placeholder="Full Name as on record"
                          className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-slate-700"
                          value={formData.studentName}
                          onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest mb-2 block">Course / Qualification</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                          required
                          type="text"
                          placeholder="e.g. Master of Business Administration"
                          className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-slate-700"
                          value={formData.courseName}
                          onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="group">
                        <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest mb-2 block">Effective Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input
                            required
                            type="date"
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-all font-bold"
                            value={formData.issueDate}
                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest mb-2 block">Issuer Entity</label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                          <input
                            required
                            type="text"
                            placeholder="University/Company"
                            className="w-full bg-slate-950/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-all font-bold placeholder:text-slate-700"
                            value={formData.issuerName}
                            onChange={e => setFormData({ ...formData, issuerName: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || (activeTab === 'issue' && !account)}
                    className="w-full bg-white text-slate-950 hover:bg-slate-200 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600 shadow-2xl shadow-white/5"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : activeTab === 'issue' ? (
                      <>Issue Blockchain Proof <Send size={20} /></>
                    ) : (
                      <>Verify Authenticity <Search size={20} /></>
                    )}
                  </button>

                  {activeTab === 'issue' && !account && (
                    <p className="text-center text-amber-500 text-xs font-black uppercase tracking-widest">Metamask connection required for issuing</p>
                  )}
                </form>

                {/* Right: Results Display */}
                <div className="flex flex-col">
                  <div className="bg-slate-950/40 rounded-[2rem] border border-white/5 p-8 flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] -rotate-12 translate-x-1/4 -translate-y-1/4">
                      <ShieldCheck size={200} />
                    </div>

                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8">System Report</h3>

                    <AnimatePresence mode="wait">
                      {result ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-8 relative z-10"
                        >
                          <div className={`p-6 rounded-3xl border flex items-start gap-4 ${result.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                            {result.success ? <CheckCircle2 className="text-emerald-400 shrink-0" size={28} /> : <XCircle className="text-rose-400 shrink-0" size={28} />}
                            <div>
                              <h4 className={`text-xl font-black mb-1 ${result.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {result.success ? "Success" : "Error"}
                              </h4>
                              <p className="text-slate-400 font-medium leading-relaxed">{result.message}</p>
                            </div>
                          </div>

                          {result.success && result.data && (
                            <div className="space-y-4">
                              <div className="p-4 bg-slate-900 border border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Fingerprint (Keccak256)</p>
                                <p className="font-mono text-[10px] text-blue-400 break-all leading-relaxed">
                                  {generateStructuredHash(formData.studentName, formData.courseName, formData.issueDate, formData.issuerName)}
                                </p>
                              </div>
                              {result.data.txHash && (
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-white transition-colors cursor-pointer group">
                                  <ExternalLink size={14} className="group-hover:rotate-12 transition-transform" />
                                  View on Block Explorer
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex-1 flex flex-col items-center justify-center text-center opacity-20"
                        >
                          <ShieldCheck size={60} className="mb-4" />
                          <p className="font-black uppercase tracking-widest text-xs">Waiting for Interaction</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-20 border-t border-white/5 mt-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <ShieldCheck size={20} />
            <span className="text-sm font-black tracking-tighter uppercase italic">ChainProof Lite</span>
          </div>
          <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">Decentralized Trust Infrastructure V2.1</p>
          <div className="flex gap-6 text-slate-500">
            <p className="text-xs font-medium">© 2026 ChainProof</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
