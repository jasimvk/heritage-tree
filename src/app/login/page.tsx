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
      document.cookie = "family_token=authorized; path=/; max-age=31536000"; // 1 year
      router.push("/");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeff5] flex items-center justify-center p-6 font-sans">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-slate-200 p-8 text-center">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded flex items-center justify-center mx-auto mb-6 border border-blue-100">
          <TreePine size={28} />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 mb-1">
          Heritage Tree
        </h1>
        <p className="text-sm text-slate-500 font-medium mb-8">
          Sign in to view the family lineage
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Lock size={16} />
            </div>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className={`block w-full pl-10 pr-4 py-2.5 bg-slate-50 border ${error ? 'border-red-500 bg-red-50' : 'border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'} rounded text-sm font-semibold tracking-widest text-center outline-none transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal text-slate-800`}
              placeholder="Enter PIN"
              maxLength={4}
              required
            />
          </div>
          
          {error && (
            <p className="text-red-600 text-xs font-semibold bg-red-50 py-1 px-2 rounded">
              Incorrect PIN. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#1a3a5f] hover:bg-[#132c4a] text-white rounded font-bold text-sm shadow-sm transition-all flex items-center justify-center"
          >
            Access Tree
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            Protected Family Archive • 2026
          </p>
        </div>
      </div>
    </div>
  );
}
