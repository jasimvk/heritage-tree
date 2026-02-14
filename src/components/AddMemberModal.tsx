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
    last_name: "Family",
    gender: "male" as Gender,
    birth_date: "",
    father_id: parentId || "",
    mother_id: "",
    spouse_id: "",
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif font-bold text-zinc-800 text-center w-full ml-6">
             New Family Member
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">First Name</label>
              <input
                type="text"
                className="w-full p-4 rounded-2xl border-2 border-zinc-50 bg-zinc-50 focus:bg-white focus:border-amber-200 transition-all outline-none text-lg font-medium"
                placeholder="e.g. John"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">Family Name</label>
              <input
                type="text"
                className="w-full p-4 rounded-2xl border-2 border-zinc-50 bg-zinc-50 focus:bg-white focus:border-amber-200 transition-all outline-none text-lg font-medium"
                placeholder="e.g. Doe"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400">Gender</label>
            <div className="flex gap-3">
              {[
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' }
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setFormData({ ...formData, gender: g.id as Gender })}
                  className={`flex-1 py-4 rounded-2xl border-2 font-bold transition-all ${
                    formData.gender === g.id
                      ? `bg-zinc-900 text-white border-zinc-900 shadow-xl`
                      : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs uppercase tracking-widest font-bold text-zinc-400 block text-center">Birth Date</label>
            <input
              type="date"
              className="w-full p-4 rounded-2xl border-2 border-zinc-50 bg-zinc-50 focus:bg-white focus:border-amber-200 transition-all outline-none text-center text-lg"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>

          <button
            onClick={() => onSave(formData)}
            className="w-full py-5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-lg shadow-2xl shadow-amber-200 flex items-center justify-center gap-3 transition-all transform active:scale-95"
          >
            <Save size={24} /> Save to History
          </button>
        </div>
      </motion.div>
    </div>
  );
}
