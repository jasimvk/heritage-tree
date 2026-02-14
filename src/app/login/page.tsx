"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TreePine, Lock } from "lucide-react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "786") {
      document.cookie = "family_token=authorized; path=/; max-age=864000"; // 100 days
      router.push("/");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 p-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200 mx-auto mb-8">
          <TreePine size={32} />
        </div>
        
        <h1 className="text-3xl font-black tracking-tight text-slate-800 mb-2 uppercase">
          Cheruvattam <span className="text-amber-600 font-light italic">Family</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-10">
          Enter Family PIN to access
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={`block w-full pl-11 pr-4 py-4 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-2xl text-lg font-bold tracking-[1em] text-center focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`}
              placeholder="••••"
              maxLength={4}
              required
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-xs font-bold uppercase tracking-wider">Invalid PIN. Try again.</p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-[0.98]"
          >
            Access Tree
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Cheruvattam Family • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
