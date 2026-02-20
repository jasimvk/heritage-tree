"use client";

import { useState, useEffect } from "react";
import FamilyTree from "@/components/FamilyTree";
import AddMemberModal from "@/components/AddMemberModal";
import { FamilyMember } from "@/types/family";
import { TreePine, Info } from "lucide-react";

export default function Home() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      
      if (data && Array.isArray(data)) {
        // Only show approved members for the public tree
        setMembers(data.filter((m: any) => m.status === 'approved' || !m.status));
      } else {
        setMembers([]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = (parentId?: string) => {
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (memberData: Partial<FamilyMember>) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });

      if (res.ok) {
        alert("Member submitted for admin approval!");
      }
    } catch (e) {
      console.error("Save error:", e);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <TreePine size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">Cheruvattam <span className="text-amber-600 font-light italic">Family</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">The Cheruvattam Legacy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => handleAddMember()}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-sm font-bold shadow-xl shadow-amber-100 transition-all transform active:scale-95"
             >
                Add Family Member
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-32 pb-20">
        {/* Tree Container */}
        <div className="relative overflow-auto pb-40 px-4">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
            ) : (
                <FamilyTree members={members} onAddMember={handleAddMember} />
            )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-6 left-6 right-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-end items-end">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-50">
                  Cheruvattam Family Tree • 2026
              </p>
          </div>
      </footer>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
        parentId={selectedParentId}
        members={members}
      />
    </div>
  );
}
