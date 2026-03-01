"use client";

import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, Wallet, User, BookOpen, Calendar, Building2, Send } from 'lucide-react';
import { generateStructuredHash } from '@/lib/hashing';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

declare global {
    interface Window {
        ethereum?: ethers.providers.ExternalProvider;
    }
}

export default function AdminDashboard() {
    const [formData, setFormData] = useState({
        studentName: '',
        courseName: '',
        issueDate: new Date().toISOString().split('T')[0],
        issuerName: ''
    });
    const [status, setStatus] = useState<'idle' | 'hashing' | 'finalizing' | 'completed' | 'error'>('idle');
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
            } catch (err) {
                console.error("Connection error:", err);
            }
        } else {
            alert("Please install MetaMask");
        }
    };

    const handleIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!account) {
            setError("Please connect your wallet first.");
            return;
        }

        setStatus('finalizing');
        setError(null);

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            // Call the specialized structured issuance function
            const tx = await contract.issueCertificate(
                formData.studentName,
                formData.courseName,
                formData.issueDate,
                formData.issuerName
            );

            setTxHash(tx.hash);
            await tx.wait();
            setStatus('completed');
        } catch (e: unknown) {
            const err = e as Error;
            console.error(err);
            setStatus('error');
            setError(err.message.includes('user rejected') ? "Transaction cancelled by user." : "Issuance failed. Ensure you have ISSUER_ROLE.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                            Issuer Dashboard
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">Generate Immutable Structured Certificates</p>
                    </div>
                    <button
                        onClick={connectWallet}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-800 transition-all font-bold shadow-xl shadow-blue-500/5 group"
                    >
                        <Wallet size={20} className={account ? "text-emerald-400" : "text-blue-400 group-hover:scale-110 transition-transform"} />
                        <span className="text-sm">
                            {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Admin Wallet"}
                        </span>
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl">
                            <form onSubmit={handleIssue} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Student Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                                                value={formData.studentName}
                                                onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Course Name</label>
                                        <div className="relative">
                                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="Blockchain Engineering"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                                                value={formData.courseName}
                                                onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Issue Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                                                value={formData.issueDate}
                                                onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-400 ml-1">Issuing Institution</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                            <input
                                                required
                                                type="text"
                                                placeholder="ChainProof Academy"
                                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all font-medium"
                                                value={formData.issuerName}
                                                onChange={e => setFormData({ ...formData, issuerName: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'finalizing' || !account}
                                    className="w-full bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:bg-slate-800 disabled:text-slate-600 group"
                                >
                                    {status === 'finalizing' ? "Broadcasting..." : "Issue On-Chain Certificate"}
                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>

                                {!account && (
                                    <p className="text-center text-amber-500 text-sm font-bold animate-pulse">Connect wallet to enable issuance</p>
                                )}
                            </form>
                        </section>
                    </div>

                    {/* Status & Preview */}
                    <div className="space-y-6">
                        <section className="bg-slate-900 border border-slate-800 rounded-[2rem] p-8">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-blue-400" size={20} />
                                Transaction Status
                            </h2>

                            {status === 'idle' && (
                                <div className="text-center py-12 opacity-30">
                                    <AlertCircle size={40} className="mx-auto mb-4" />
                                    <p className="text-sm font-medium">Awaiting input...</p>
                                </div>
                            )}

                            {error && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl mb-4">
                                    <p className="text-rose-400 text-xs font-bold leading-relaxed">{error}</p>
                                </div>
                            )}

                            {status === 'completed' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
                                        <CheckCircle2 className="text-emerald-400" />
                                        <span className="text-emerald-400 font-bold">Successfully Issued</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Generated Fingerprint</p>
                                            <p className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] break-all border border-slate-800 text-slate-400">
                                                {generateStructuredHash(formData.studentName, formData.courseName, formData.issueDate, formData.issuerName)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Transaction Hash</p>
                                            <p className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] break-all border border-slate-800 text-blue-500/70">
                                                {txHash}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition-colors"
                                    >
                                        Issue Another
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="bg-gradient-to-br from-blue-600/20 to-emerald-600/10 border border-blue-500/20 rounded-[2rem] p-8">
                            <h3 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6 leading-none">Security Note</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                Data is hashed using <span className="text-blue-300">Keccak-256</span> with deterministic encoding. Even a single character change in the name or date will result in a completely different hash, making forgery impossible.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
