"use client";

import { useState, useEffect } from "react";
import FamilyTree from "@/components/FamilyTree";
import AddMemberModal from "@/components/AddMemberModal";
import { FamilyMember } from "@/types/family";
import { Search, Plus, Filter, Settings, Bell, ChevronDown, Menu } from "lucide-react";

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
    <div className="min-h-screen bg-[#eaeff5] text-slate-900 font-sans selection:bg-blue-100 flex flex-col overflow-hidden">
      {/* Geni Professional Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1a3a5f] text-white shadow-md">
        <div className="max-w-full mx-auto px-4 h-14 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-8">
            <button className="md:hidden text-white/80 hover:text-white">
                <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-lg">
                C
              </div>
              <h1 className="text-lg font-bold tracking-tight text-slate-800 hidden sm:block text-white">Heritage Tree</h1>
            </div>
            
            <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-slate-300">
              <a href="#" className="text-white font-semibold border-b-2 border-blue-400 pb-[17px] mt-[2px]">Tree</a>
              <a href="#" className="hover:text-white transition-colors">Directory</a>
              <a href="#" className="hover:text-white transition-colors">Statistics</a>
              <a href="#" className="hover:text-white transition-colors">Settings</a>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
             <div className="hidden lg:flex items-center bg-[#2d4a6e] rounded-full px-3 py-1.5 gap-2 border border-[#3e5a7e] focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                <Search size={16} className="text-blue-200" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-32 xl:w-48 placeholder:text-blue-200/50 text-white"
                />
             </div>
             
             <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block"></div>

             <div className="flex items-center gap-1 md:gap-3 text-blue-100">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative hidden sm:block">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#1a3a5f]"></span>
                </button>
                <button 
                    onClick={() => handleAddMember()}
                    className="md:hidden p-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-500"
                >
                    <Plus size={20} />
                </button>
                <button className="flex items-center gap-2 ml-1 hover:bg-white/10 py-1 px-2 rounded-lg transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-800 overflow-hidden border border-blue-700">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
                    </div>
                    <ChevronDown size={14} className="text-blue-300 hidden sm:block" />
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Toolbar / Actions Bar */}
      <div className="fixed top-14 left-0 right-0 z-30 bg-white border-b border-slate-200 h-12 flex items-center px-4 justify-between shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
             <button 
                onClick={() => handleAddMember()}
                className="hidden md:flex h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[13px] items-center gap-2 transition-all shadow-sm active:scale-95"
             >
                <Plus size={16} strokeWidth={2.5} /> Add Relative
             </button>
             <div className="hidden md:block h-6 w-px bg-slate-200 mx-2"></div>
             
             {/* Mobile Search Trigger */}
             <button className="lg:hidden flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 hover:bg-slate-100">
                <Search size={14} />
                <span>Search</span>
             </button>

             <div className="flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <Filter size={14} />
                <span>Filters</span>
                <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">{members.length}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3 min-w-max pl-4">
             <span className="text-[12px] font-medium text-slate-400 uppercase tracking-wider hidden sm:block">View Mode:</span>
             <div className="flex bg-slate-100 p-1 rounded border border-slate-200">
                <button className="px-3 py-1 bg-white text-slate-800 text-[12px] font-bold rounded shadow-sm border border-slate-200">Tree</button>
                <button className="px-3 py-1 text-slate-500 hover:text-slate-700 text-[12px] font-medium rounded transition-colors">List</button>
             </div>
          </div>
      </div>

      {/* Main Viewport */}
      <main className="flex-1 pt-[104px] h-screen overflow-hidden flex flex-col">
        <div className="flex-1 w-full h-full relative bg-[#f2f4f7]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ 
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
                backgroundSize: '24px 24px' 
            }}></div>

            {isLoading ? (
                <div className="flex justify-center items-center h-full relative z-10">
                    <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-xl shadow-xl border border-slate-100">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Loading Lineage...</p>
                    </div>
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
