"use client";

import { useState } from "react";
import { FamilyMember, Gender } from "@/types/family";
import { X, Save, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    last_name: "",
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
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="p-6 border-b flex justify-between items-center bg-zinc-50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus size={24} /> Add Family Member
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600">First Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600">Last Name</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Doe"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-600 block">Gender</label>
            <div className="flex gap-4">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  onClick={() => setFormData({ ...formData, gender: g as Gender })}
                  className={`flex-1 py-2 rounded-xl border-2 capitalize transition-all ${
                    formData.gender === g
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-600">Birth Date</label>
            <input
              type="date"
              className="w-full p-3 rounded-xl border border-zinc-200 outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h3 className="font-bold text-zinc-800">Family Relations</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600">Father</label>
              <select
                className="w-full p-3 rounded-xl border border-zinc-200 outline-none"
                value={formData.father_id}
                onChange={(e) => setFormData({ ...formData, father_id: e.target.value })}
              >
                <option value="">Unknown</option>
                {members.filter(m => m.gender === 'male').map(m => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-600">Mother</label>
              <select
                className="w-full p-3 rounded-xl border border-zinc-200 outline-none"
                value={formData.mother_id}
                onChange={(e) => setFormData({ ...formData, mother_id: e.target.value })}
              >
                <option value="">Unknown</option>
                {members.filter(m => m.gender === 'female').map(m => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => onSave(formData)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save size={20} /> Add to Heritage
          </button>
        </div>
      </motion.div>
    </div>
  );
}
