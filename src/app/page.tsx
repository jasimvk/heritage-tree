"use client";

import { useState, useEffect } from "react";
import FamilyTree from "@/components/FamilyTree";
import AddMemberModal from "@/components/AddMemberModal";
import { FamilyMember } from "@/types/family";
import { TreePine, Plus } from "lucide-react";

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Geni-inspired Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-full mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
              <TreePine size={20} />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">Family Tree</h1>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={() => handleAddMember()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold flex items-center gap-2 transition-colors"
             >
                <Plus size={16} /> Add
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20">
        <div className="relative overflow-auto p-8 h-[calc(100vh-80px)]">
            {isLoading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
