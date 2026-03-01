"use client";

import React, { useState } from 'react';
import { ShieldCheck, Search, FileText, XCircle, CheckCircle, Info, Calendar, User } from 'lucide-react';
import { generateSHA256, toBytes32 } from '@/lib/hashing';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

export default function VerificationPortal() {
    const [file, setFile] = useState<File | null>(null);
    const [verifying, setVerifying] = useState(false);
    const [result, setResult] = useState<{ isValid: boolean; hash: string; metadata?: { url: string; issuer: string; date: string } | null } | null>(null);

    const handleVerify = async () => {
        if (!file) return;
        setVerifying(true);
        setResult(null);

        try {
            const buffer = Buffer.from(await file.arrayBuffer());
            const hash = generateSHA256(buffer);
            const bytes32Hash = toBytes32(hash);

            // Connect to local provider
            const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            const [isValid, metadataUrl, issuer, timestamp] = await contract.verifyCertificate(bytes32Hash);

            setResult({
                isValid,
                hash,
                metadata: isValid ? {
                    url: metadataUrl,
                    issuer,
                    date: new Date(timestamp.toNumber() * 1000).toLocaleDateString()
                } : null
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
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full mb-6">
                        <ShieldCheck size={16} className="text-blue-400" />
                        <span className="text-blue-300 text-sm font-semibold tracking-wide uppercase">Trustless Verification</span>
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4">
                        ChainProof <span className="text-blue-500 text-glow">Verify</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                        Instantly verify the authenticity of any certificate issued on the Polygon blockchain.
                    </p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-4 shadow-2xl">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-10">
                        <div className="border-4 border-dashed border-slate-800 rounded-[1.5rem] p-12 text-center hover:border-blue-500/40 transition-all group relative overflow-hidden">
                            <input
                                type="file"
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] || null);
                                    setResult(null);
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                            />
                            <div className="relative z-0">
                                <div className="w-24 h-24 bg-blue-500/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <FileText size={40} className="text-blue-500/60" />
                                </div>
                                <p className="text-xl font-bold mb-2 text-slate-200">
                                    {file ? file.name : "Drag & drop certificate"}
                                </p>
                                <p className="text-slate-500">Only PDF files are supported for verification</p>
                            </div>
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={!file || verifying}
                            className="w-full mt-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 py-5 rounded-2xl font-black text-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                        >
                            {verifying ? (
                                <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full" />
                            ) : (
                                <>Verify Authenticity <Search size={22} /></>
                            )}
                        </button>
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
                                        ? 'This document hash matches the immutable record stored on the blockchain. The content is authentic and untampered.'
                                        : 'The uploaded document does not match any certificate on record. It may have been modified or was never issued.'
                                    }
                                </p>

                                {result.isValid && result.metadata && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <Calendar size={16} className="text-blue-400" />
                                            <span>Issued: {result.metadata.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                                            <User size={16} className="text-blue-400" />
                                            <span>Issuer: {result.metadata.issuer.substring(0, 6)}...{result.metadata.issuer.substring(38)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-950/50 p-2 px-3 rounded-lg border border-slate-800 text-slate-500">
                                    <Info size={14} /> Hash: {result.hash}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
