"use client";

import { useState, useEffect } from "react";
import FamilyTree from "@/components/FamilyTree";
import AddMemberModal from "@/components/AddMemberModal";
import { FamilyMember } from "@/types/family";
import { MOCK_MEMBERS } from "@/lib/mock";
import { supabase } from "@/lib/supabase";
import { TreePine, Share2, Info } from "lucide-react";

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
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching members:", error);
        // Fallback to mock data if supabase not configured
        if (members.length === 0) setMembers(MOCK_MEMBERS);
      } else if (data && data.length > 0) {
        setMembers(data);
      } else {
        setMembers(MOCK_MEMBERS);
      }
    } catch (e) {
      setMembers(MOCK_MEMBERS);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = (parentId?: string) => {
    setSelectedParentId(parentId);
    setIsModalOpen(true);
  };

  const handleSaveMember = async (memberData: Partial<FamilyMember>) => {
    const newMember = {
      ...memberData,
      id: Math.random().toString(36).substr(2, 9), // Temp ID
      created_at: new Date().toISOString(),
    } as FamilyMember;

    try {
      const { data, error } = await supabase
        .from('members')
        .insert([memberData])
        .select();

      if (error) throw error;
      if (data) fetchMembers();
    } catch (e) {
      // Offline mode/No DB: just update local state
      setMembers([...members, newMember]);
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
              <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">Our <span className="text-amber-600 font-light italic">Heritage</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Family Legacy Archive</p>
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
        {/* Intro */}
        <section className="max-w-3xl mx-auto text-center px-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6 leading-tight">
                Our Family Tree
            </h2>
            <p className="text-lg text-slate-500 font-medium italic">
                "A people without the knowledge of their past history, origin and culture is like a tree without roots."
            </p>
        </section>

        {/* Tree Container */}
        <div className="relative overflow-auto pb-40">
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <FamilyTree members={members} onAddMember={handleAddMember} />
            )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="fixed bottom-6 left-6 right-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-between items-end">
              <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-2xl pointer-events-auto flex items-center gap-4 max-w-md">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <Info size={20} />
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      <strong>How to use:</strong> Hover over any family member to add their children. Click a member to view details. All changes are saved in real-time.
                  </p>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-50">
                  Powered by Jasim AI • 2026
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
