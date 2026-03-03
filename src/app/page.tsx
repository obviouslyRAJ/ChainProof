"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  User,
  BookOpen,
  Calendar,
  Search,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  Wallet,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Hash,
  Ban,
  Upload,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ethers } from 'ethers';
import Scene3D from '@/components/3d/Scene3D';
import FloatingCard from '@/components/Hero/FloatingCard';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider;
  }
}

export default function Home() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 100]);

  const [activeTab, setActiveTab] = useState<'issue' | 'verify' | 'revoke'>('verify');
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    data?: { txHash?: string; issuer?: string; date?: string; isRevoked?: boolean; fileHash?: string };
  } | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    studentName: '',
    courseName: '',
    issueDate: new Date().toISOString().split('T')[0]
  });

  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [revokeHash, setRevokeHash] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTabChange = (tab: 'issue' | 'verify' | 'revoke') => {
    setActiveTab(tab);
    setResult(null);
    setFormData({
      studentName: '',
      courseName: '',
      issueDate: new Date().toISOString().split('T')[0]
    });
    setFile(null);
    setFileHash(null);
    setRevokeHash('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

  const calculateSHA256 = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      try {
        const hash = await calculateSHA256(selectedFile);
        setFileHash(hash);
      } catch (err) {
        console.error("Hash calculation failed", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      let provider;
      if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
      } else {
        provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
      }

      if (activeTab === 'issue') {
        if (!account) throw new Error("Please connect your wallet to issue certificates.");
        if (!fileHash) throw new Error("Please upload a certificate file first.");

        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const tx = await contract.issueCertificate(
          formData.studentName,
          formData.courseName,
          formData.issueDate,
          fileHash
        );
        await tx.wait();

        setResult({
          success: true,
          message: "Hybrid certificate successfully etched onto the blockchain!",
          data: { txHash: tx.hash, fileHash }
        });
      } else if (activeTab === 'verify') {
        if (!fileHash) throw new Error("Please upload the certificate file to verify.");

        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const [isValid, issuer, timestamp, isRevoked] = await contract.verifyCertificate(
          formData.studentName,
          formData.courseName,
          formData.issueDate,
          fileHash
        );

        if (isValid) {
          if (isRevoked) {
            setResult({
              success: false,
              message: "This certificate has been REVOKED by the issuer and is no longer valid.",
              data: { isRevoked: true, issuer, date: new Date(timestamp.toNumber() * 1000).toLocaleDateString(), fileHash }
            });
          } else {
            setResult({
              success: true,
              message: "Authenticity Verified! Metadata and file fingerprint match the blockchain record.",
              data: { issuer, date: new Date(timestamp.toNumber() * 1000).toLocaleDateString(), fileHash }
            });
          }
        } else {
          setResult({
            success: false,
            message: "Verification Failed. The combination of metadata and file hash does not exist on-chain.",
            data: { fileHash }
          });
        }
      } else if (activeTab === 'revoke') {
        if (!account) throw new Error("Please connect your wallet to revoke certificates.");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const tx = await contract.revokeCertificate(revokeHash);
        await tx.wait();

        setResult({
          success: true,
          message: "Certificate successfully revoked from the blockchain.",
          data: { txHash: tx.hash }
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.reason || err.message || "An unexpected error occurred."
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

      {/* Hero Content */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <motion.div
            style={{ y: yHero }}
            className="flex-1 text-center lg:text-left z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8"
            >
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-blue-400 text-xs font-black tracking-widest uppercase">Hybrid Trust Protocol</span>
            </motion.div>

            <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-8">
              VERIFY THE <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                UNALTERABLE.
              </span>
            </h1>

            <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed font-medium">
              Professional hybrid platform combining **structured metadata** and **file fingerprinting** for dual-layer blockchain integrity.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-blue-600/30 transition-all active:scale-95"
              >
                Launch Workspace
              </button>
            </div>
          </motion.div>

          <div className="flex-1 relative w-full aspect-square max-w-xl group">
            <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-600/20 transition-all" />
            <Scene3D />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
              <FloatingCard />
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Section */}
      <section id="workspace" className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 tracking-tight">Blockchain Workspace</h2>
            <p className="text-slate-500 font-medium">Hybrid portal for dual-layer credential issuance and verification.</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-4 shadow-2xl overflow-hidden">
            {/* Tab Switcher */}
            <div className="flex gap-2 mb-8 bg-slate-950 p-2 rounded-[2rem] border border-white/5 relative overflow-hidden">
              <button
                onClick={() => handleTabChange('verify')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all relative z-10 ${activeTab === 'verify' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Search size={18} /> Verify
              </button>
              <button
                onClick={() => handleTabChange('issue')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all relative z-10 ${activeTab === 'issue' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Send size={18} /> Issue
              </button>
              <button
                onClick={() => handleTabChange('revoke')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] font-black text-sm transition-all relative z-10 ${activeTab === 'revoke' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <Ban size={18} /> Revoke
              </button>
              <motion.div
                layoutId="activeTab"
                className="absolute top-2 left-2 bottom-2 w-[calc(33.33%-8px)] bg-blue-600 rounded-[1.5rem] shadow-lg shadow-blue-600/20"
                animate={{ x: activeTab === 'verify' ? 0 : activeTab === 'issue' ? '100%' : '200%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>

            <div className="p-6 md:p-10">
              <form onSubmit={handleAction} className="space-y-8">
                {activeTab !== 'revoke' ? (
                  <>
                    {/* File Upload Zone */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-slate-500 tracking-widest uppercase ml-1">Certificate File (Fingerprint)</label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`group relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-slate-950/50 hover:bg-blue-600/5 ${file ? 'border-emerald-500/50' : 'border-slate-800 hover:border-blue-500/50'}`}
                      >
                        <input
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={onFileChange}
                          accept=".pdf,.png,.jpg,.jpeg"
                        />

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${file ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                          {file ? <FileText size={32} /> : <Upload size={32} />}
                        </div>

                        <div className="text-center">
                          <p className="font-black text-lg mb-1">{file ? file.name : 'Drop Certificate File'}</p>
                          <p className="text-slate-500 text-xs font-medium italic">{(file?.size! / 1024).toFixed(1)} KB • PDF, PNG, JPG (SHA-256 Hashing)</p>
                        </div>

                        {fileHash && (
                          <div className="absolute inset-x-4 bottom-4 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Dual-Layer Fingerprint Computed</span>
                            </div>
                            <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5">
                              <p className="text-[10px] font-mono text-emerald-400/80 break-all leading-tight">{fileHash}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 tracking-widest uppercase ml-1">Student Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                          <input
                            required
                            type="text"
                            placeholder="Full Name"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                            value={formData.studentName}
                            onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 tracking-widest uppercase ml-1">Course Title</label>
                        <div className="relative">
                          <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                          <input
                            required
                            type="text"
                            placeholder="e.g. Solidity Engineering"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                            value={formData.courseName}
                            onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-slate-500 tracking-widest uppercase ml-1">Completion Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                          <input
                            required
                            type="date"
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                            value={formData.issueDate}
                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 tracking-widest uppercase ml-1">Hybrid Registry Hash</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="0x..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-mono text-sm"
                        value={revokeHash}
                        onChange={e => setRevokeHash(e.target.value)}
                      />
                    </div>
                    <p className="text-slate-500 text-[10px] mt-2 italic px-1">* Only the original issuer can revoke a certificate.</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-6 rounded-[2rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 ${activeTab === 'issue' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20' :
                    activeTab === 'revoke' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20' :
                      'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                    }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    activeTab === 'issue' ? (
                      <><Send size={22} /> Issue Hybrid Proof</>
                    ) : activeTab === 'revoke' ? (
                      <><Ban size={22} /> Revoke Certificate</>
                    ) : (
                      <><ShieldCheck size={22} /> Verify Authenticity</>
                    )
                  )}
                </button>
              </form>

              {/* Result Display */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`mt-10 p-8 rounded-[2.5rem] border backdrop-blur-xl ${result.success ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
                      }`}
                  >
                    <div className="flex items-start gap-5">
                      <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${result.success ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                        }`}>
                        {result.success ? <CheckCircle2 size={24} /> : (result.data?.isRevoked ? <Ban size={24} /> : <XCircle size={24} />)}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className={`text-2xl font-black ${result.success ? "text-emerald-400" : "text-rose-400"}`}>
                            {result.success ? "Authenticated" : (result.data?.isRevoked ? "Revoked" : "Invalid")}
                          </h3>
                          <p className="text-slate-300 font-medium leading-relaxed mt-1">{result.message}</p>
                        </div>

                        {result.data && (
                          <div className="space-y-3 pt-4 border-t border-white/5">
                            {result.data.txHash && (
                              <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-3 rounded-xl transition-all">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Transaction</span>
                                <span className="text-[10px] font-mono text-blue-400 flex items-center gap-2">
                                  {result.data.txHash.substring(0, 16)}... <ExternalLink size={12} />
                                </span>
                              </div>
                            )}
                            {result.data.fileHash && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Hybrid Integrity Fingerprint</span>
                                <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 font-mono text-[11px] text-emerald-400 break-all leading-relaxed shadow-inner">
                                  {result.data.fileHash}
                                </div>
                              </div>
                            )}
                            {result.data.issuer && (
                              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Verified Issuer</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-mono text-emerald-400">{result.data.issuer.substring(0, 12)}...{result.data.issuer.substring(38)}</span>
                                  <ShieldCheck size={12} className="text-emerald-500" />
                                </div>
                              </div>
                            )}
                            {result.data.date && (
                              <div className="flex items-center justify-between p-3 rounded-xl">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">On-Chain Timestamp</span>
                                <span className="text-[10px] font-mono text-white">{result.data.date}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Dual-Layer Protocol", desc: "Every credential is bound to both metadata and file fingerprints, ensuring absolute integrity of digital assets.", icon: ShieldCheck },
            { title: "On-Chain Revocation", desc: "Issuers can instantly revoke credentials, with status updates reflected across the network in real-time.", icon: Ban },
            { title: "Instant Verification", desc: "Public verification portal allows trustless validation of certificates without requiring a crypto wallet.", icon: Search }
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] hover:border-blue-500/30 transition-all group">
              <item.icon className="text-blue-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="text-2xl font-black mb-4 tracking-tight">{item.title}</h3>
              <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10 text-slate-500">
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} />
            <span className="text-sm font-black tracking-widest uppercase italic">ChainProof Hybrid Professional</span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Polygon Ecosystem Powered • Decentralized Ledger</p>
        </div>
      </footer>
    </div>
  );
}
