"use client";

import { useState, useEffect } from "react";
import FamilyTree from "@/components/FamilyTree";
import AddMemberModal from "@/components/AddMemberModal";
import { FamilyMember } from "@/types/family";
import { Search, Plus, Filter } from "lucide-react";

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
        fetchMembers();
      }
    } catch (e) {
      console.error("Save error:", e);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#eaeff5] text-slate-900 font-sans selection:bg-blue-100">
      {/* Geni Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a3a5f] text-white shadow-md">
        <div className="max-w-full mx-auto px-4 h-12 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-500 rounded-sm flex items-center justify-center font-black text-sm italic">
                C
              </div>
              <h1 className="text-sm font-bold tracking-tight">Cheruvattam Family</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-blue-200/70">
              <a href="#" className="text-white border-b-2 border-blue-400 pb-0.5">Family Tree</a>
              <a href="#" className="hover:text-white transition-colors">Directory</a>
              <a href="#" className="hover:text-white transition-colors">Photos</a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
             <div className="hidden sm:flex items-center bg-[#2d4a6e] rounded px-2 py-1 gap-2 border border-[#3e5a7e]">
                <Search size={14} className="text-blue-200/50" />
                <input 
                  type="text" 
                  placeholder="Search family..." 
                  className="bg-transparent border-none outline-none text-[11px] w-32 placeholder:text-blue-200/30"
                />
             </div>
             <button 
                onClick={() => handleAddMember()}
                className="h-8 px-3 bg-[#4caf50] hover:bg-[#43a047] text-white rounded text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm"
             >
                <Plus size={14} strokeWidth={3} /> Add Person
             </button>
          </div>
        </div>
      </header>

      {/* Sub-toolbar */}
      <div className="fixed top-12 left-0 right-0 z-30 bg-white border-b border-slate-300 h-10 flex items-center px-4 justify-between">
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-500">
             <div className="flex items-center gap-1.5 cursor-pointer hover:text-blue-600">
                <Filter size={12} />
                <span>View Options</span>
             </div>
             <span className="text-slate-200">|</span>
             <span>Total Members: {members.length}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-medium italic">
             Showing primary lineage for Cheruvattam Family
          </div>
      </div>

      {/* Main Viewport */}
      <main className="pt-24 min-h-screen overflow-auto">
        <div className="p-4 md:p-8">
            {isLoading ? (
                <div className="flex justify-center items-center h-[60vh]">
                    <div className="animate-spin rounded-sm h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                </div>
            ) : (
                <FamilyTree members={members} onAddMember={handleAddMember} />
            )}
        </div>
      </main>

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
