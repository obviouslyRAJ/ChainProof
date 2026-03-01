import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, Lock, Globe, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">ChainProof <span className="text-blue-500">Lite</span></span>
          </div>
          <div className="flex items-center gap-8">
            <Link href="/verify" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Verify Certificate</Link>
            <Link href="/admin" className="text-sm font-medium px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all">Admin Dashboard</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full opacity-50 -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Live on Polygon Testnet</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            The Standard for <br />
            <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">On-Chain Trust.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Immutable, cryptographically verifiable certificates powered by blockchain.
            Designed for institutions that value integrity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/verify" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 group">
              Verify a Certificate <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/admin" className="w-full sm:w-auto px-10 py-5 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl font-bold text-lg transition-all">
              Issuer Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold">Tamper Proof</h3>
            <p className="text-slate-400 leading-relaxed">
              We store the SHA-256 hash of every certificate on the Polygon blockchain. If even a single pixel changes, verification fails.
            </p>
          </div>
          <div className="space-y-4 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold">Decentralized Storage</h3>
            <p className="text-slate-400 leading-relaxed">
              Metadata and certificate proofs are stored on IPFS, ensuring your credentials are available forever without central servers.
            </p>
          </div>
          <div className="space-y-4 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
              <FileCheck className="text-blue-400" size={24} />
            </div>
            <h3 className="text-2xl font-bold">Instant Verification</h3>
            <p className="text-slate-400 leading-relaxed">
              No more manual checks. Users can drag and drop a PDF to verify its authenticity against on-chain records in milliseconds.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-900 text-center text-slate-500">
        <p className="font-medium">© 2026 ChainProof Lite. Built for Global Hackathon Impact.</p>
      </footer>
    </div>
  );
}
