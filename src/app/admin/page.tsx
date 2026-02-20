"use client";

import { useState, useEffect } from "react";
import { Check, X, ShieldAlert } from "lucide-react";

export default function AdminPage() {
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPendingMembers(data.filter((m: any) => m.status === 'pending'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        fetchPending();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-zinc-900 text-white rounded-2xl">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Admin <span className="text-amber-600 font-light italic">Panel</span></h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Approve New Family Entries</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid gap-6">
            {pendingMembers.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No pending approvals</p>
              </div>
            ) : (
              pendingMembers.map((member) => (
                <div key={member.id} className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 flex justify-between items-center border border-slate-100">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{member.first_name} {member.last_name}</h3>
                    <p className="text-sm text-slate-400 font-medium">
                      Gender: {member.gender} • Birth: {member.birth_date || 'Unknown'}
                    </p>
                    <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-2">Pending Approval</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAction(member.id, 'reject')}
                      className="p-4 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <X size={24} />
                    </button>
                    <button 
                      onClick={() => handleAction(member.id, 'approve')}
                      className="p-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl shadow-lg shadow-amber-200 transition-all"
                    >
                      <Check size={24} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <a href="/" className="text-xs font-black text-slate-400 hover:text-amber-600 uppercase tracking-widest transition-colors">
            ← Back to Family Tree
          </a>
        </div>
      </div>
    </div>
  );
}
