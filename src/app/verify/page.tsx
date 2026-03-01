"use client";

import React, { useState } from 'react';
import { ShieldCheck, Search, XCircle, CheckCircle, Info, Calendar, User, BookOpen, Building2 } from 'lucide-react';
import { generateStructuredHash } from '@/lib/hashing';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

export default function VerificationPortal() {
    const [formData, setFormData] = useState({
        studentName: '',
        courseName: '',
        issueDate: '',
        issuerName: ''
    });
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<{ isValid: boolean; hash: string; issuerAddress?: string; date?: string } | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        setResult(null);

        try {
            const hash = generateStructuredHash(
                formData.studentName,
                formData.courseName,
                formData.issueDate,
                formData.issuerName
            );

            // Connect to local provider
            const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            // Using the updated verifyCertificate signature
            const [isValid, issuerAddress, timestamp] = await contract.verifyCertificate(
                formData.studentName,
                formData.courseName,
                formData.issueDate,
                formData.issuerName
            );

            setResult({
                isValid,
                hash,
                issuerAddress: isValid ? issuerAddress : undefined,
                date: isValid ? new Date(timestamp.toNumber() * 1000).toLocaleDateString() : undefined
            });
        } catch (e) {
            console.error("Verification error:", e);
            setResult({ isValid: false, hash: "Error during verification" });
        } finally {
            setVerifying(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950">
            <div className="max-w-3xl w-full">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full mb-6">
                        <ShieldCheck size={16} className="text-blue-400" />
                        <span className="text-blue-300 text-sm font-semibold tracking-wide uppercase">Trustless Verification</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                        ChainProof <span className="text-blue-500 text-glow">Verify</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                        Validate certificate authenticity by re-computing the cryptographic fingerprint from record details.
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10">
                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-1">Student Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
                                            value={formData.studentName}
                                            onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-1">Course Title</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
                                            value={formData.courseName}
                                            onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-1">Issue Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
                                            value={formData.issueDate}
                                            onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-1">Issuer Institution</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500 outline-none transition-all"
                                            value={formData.issuerName}
                                            onChange={e => setFormData({ ...formData, issuerName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={verifying}
                                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                            >
                                {verifying ? (
                                    <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <>Verify On-Chain <Search size={22} /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {result && (
                    <div className={`mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        <div className={`rounded-3xl p-6 border flex flex-col md:flex-row gap-6 ${result.isValid ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${result.isValid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                {result.isValid ? <CheckCircle size={32} /> : <XCircle size={32} />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-2xl font-bold mb-1 ${result.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {result.isValid ? 'Certificate Verified' : 'Verification Failed'}
                                </h3>
                                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                                    {result.isValid
                                        ? 'The data matches the immutable record on the blockchain. Cryptographic proof confirms this certificate is authentic.'
                                        : 'No matching record was found on-chain. The details provided do not correspond to an issued certificate.'
                                    }
                                </p>

                                {result.isValid && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <Calendar size={16} className="text-blue-400" />
                                            <span>Registered: {result.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <User size={16} className="text-blue-400" />
                                            <span>Issued By: {result.issuerAddress?.substring(0, 8)}...{result.issuerAddress?.substring(36)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-950/50 p-2 px-3 rounded-lg border border-slate-800 text-slate-500">
                                    <Info size={14} /> Keccak256 HASH: {result.hash}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
