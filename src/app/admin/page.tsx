"use client";

import React, { useState } from 'react';
import { Upload, ShieldCheck, AlertCircle, FileText, CheckCircle2, Wallet } from 'lucide-react';
import { toBytes32 } from '@/lib/hashing';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/constants';

declare global {
    interface Window {
        ethereum?: ethers.providers.ExternalProvider;
    }
}

export default function AdminDashboard() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'hashing' | 'issuing' | 'success' | 'finalizing' | 'completed' | 'error'>('idle');
    const [result, setResult] = useState<{ hash: string; ipfsHash: string } | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/issue', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setResult({ hash: data.hash, ipfsHash: data.ipfsHash });
                setStatus('success');
            } else {
                setStatus('error');
                setError(data.error || "Upload failed");
            }
        } catch (e) {
            console.error(e);
            setStatus('error');
            setError("Network error");
        }
    };

    const handleFinalize = async () => {
        if (!result || !account) return;
        setStatus('finalizing');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum as ethers.providers.ExternalProvider);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const tx = await contract.issueCertificate(
                toBytes32(result.hash),
                `ipfs://${result.ipfsHash}`
            );

            await tx.wait();
            setStatus('completed');
        } catch (e: unknown) {
            const err = e as Error;
            console.error(err);
            setStatus('error');
            setError(err.message || "Transaction failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                            ChainProof Lite Admin
                        </h1>
                        <p className="text-slate-400 mt-2">Issue and Manage Secure Certificates</p>
                    </div>
                    <button
                        onClick={connectWallet}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-full border border-slate-700 transition-all font-medium"
                    >
                        <Wallet size={18} className={account ? "text-emerald-400" : ""} />
                        {account ? `${account.substring(0, 6)}...${account.substring(38)}` : "Connect Admin Wallet"}
                    </button>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-blue-500/50 transition-all group">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Upload className="text-blue-400" size={20} />
                            Issue New Certificate
                        </h2>

                        <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center bg-slate-950/50 group-hover:border-blue-500/30 transition-colors">
                            <input
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={(e) => {
                                    setFile(e.target.files?.[0] || null);
                                    setStatus('idle');
                                    setResult(null);
                                }}
                                accept=".pdf"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <FileText className="text-blue-400" />
                                </div>
                                <p className="text-slate-300 font-medium">{file ? file.name : "Choose PDF Certificate"}</p>
                                <p className="text-slate-500 text-sm mt-1">PDF only, max 10MB</p>
                            </label>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={!file || status !== 'idle'}
                            className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {status === 'idle' ? 'Upload and Hash' : status === 'uploading' ? 'Publishing to IPFS...' : 'Processing...'}
                            <ShieldCheck size={20} />
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                        <h2 className="text-xl font-semibold mb-6">Process Status</h2>
                        {status === 'idle' && !result && (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                                <AlertCircle size={48} className="mb-4 opacity-20" />
                                <p>Awaiting upload...</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl mb-6">
                                <p className="text-rose-400 text-sm font-medium">{error || "An unexpected error occurred."}</p>
                            </div>
                        )}

                        {(status === 'success' || status === 'finalizing' || status === 'completed') && result && (
                            <div className="space-y-6">
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border ${status === 'completed' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20'}`}>
                                    <CheckCircle2 />
                                    <span className="font-semibold">{status === 'completed' ? "On-Chain Verified" : "Successfully Hashed"}</span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Document Hash (SHA-256)</label>
                                        <div className="bg-slate-950 p-3 rounded-xl mt-1 font-mono text-xs break-all border border-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {result.hash}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">IPFS CID</label>
                                        <div className="bg-slate-950 p-3 rounded-xl mt-1 font-mono text-xs break-all border border-slate-800 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {result.ipfsHash}
                                        </div>
                                    </div>

                                    {status !== 'completed' && (
                                        <button
                                            onClick={handleFinalize}
                                            disabled={!account || status === 'finalizing'}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20"
                                        >
                                            {status === 'finalizing' ? "Broadcasting..." : "Finalize on Blockchain"}
                                        </button>
                                    )}

                                    {status === 'completed' && (
                                        <button className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl font-bold border border-slate-700 cursor-default">
                                            Certificate Issued
                                        </button>
                                    )}

                                    {!account && status !== 'completed' && (
                                        <p className="text-amber-400 text-xs text-center font-medium">Connect wallet to finalize</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
