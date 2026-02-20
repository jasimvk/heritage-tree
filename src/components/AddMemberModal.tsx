"use client";

import { useState } from "react";
import { FamilyMember, Gender } from "@/types/family";
import { X, Save } from "lucide-react";
import { motion } from "framer-motion";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Partial<FamilyMember>) => void;
  parentId?: string;
  members: FamilyMember[];
}

export default function AddMemberModal({ isOpen, onClose, onSave, parentId, members }: AddMemberModalProps) {
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    first_name: "",
    last_name: "Cheruvattam",
    gender: "male" as Gender,
    birth_date: "",
    father_id: parentId || "",
    mother_id: "",
    spouse_id: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
      >
        <div className="px-6 py-4 border-b bg-[#f8fafc] flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">
             Add Family Member
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">First Name</label>
              <input
                type="text"
                autoFocus
                className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                placeholder="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Last Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all"
                placeholder="Family Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Gender</label>
            <div className="flex gap-2">
              {[
                { id: 'male', label: 'Male', color: 'blue' },
                { id: 'female', label: 'Female', color: 'pink' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setFormData({ ...formData, gender: g.id as Gender })}
                  className={`flex-1 py-2 rounded border text-sm font-medium transition-all ${
                    formData.gender === g.id
                      ? g.id === 'male' 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                        : 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm'
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Birth Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm transition-all text-slate-700"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 rounded font-bold text-sm hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={() => onSave(formData)}
                className="flex-[2] py-2.5 bg-[#4caf50] hover:bg-[#43a047] text-white rounded font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
                <Save size={16} /> Save Member
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
