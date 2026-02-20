"use client";

import { FamilyMember } from "@/types/family";
import { motion } from "framer-motion";
import { User, Plus, Calendar } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MemberNodeProps {
  member: FamilyMember;
  onAddChild?: (parentId: string) => void;
}

export default function MemberNode({ member, onAddChild }: MemberNodeProps) {
  const isMale = member.gender === "male";
  // Geni colors: Blue #4a90e2, Pink #e05d9e (approx)
  
  return (
    <div className="relative group z-10">
      <Link href={`/profile/${member.id}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "relative flex flex-col w-[200px] bg-white rounded shadow-sm border transition-all hover:shadow-md hover:ring-2 hover:ring-offset-1",
            isMale ? "border-slate-200 hover:ring-blue-400" : "border-slate-200 hover:ring-pink-400"
          )}
        >
          {/* Top colored bar for gender */}
          <div className={cn("h-1.5 w-full rounded-t", isMale ? "bg-[#3b82f6]" : "bg-[#ec4899]")} />

          <div className="p-3 flex items-start gap-3">
            {/* Avatar */}
            <div className={cn(
              "w-12 h-12 rounded-sm flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner bg-slate-50 text-slate-300"
            )}>
              {member.photo_url ? (
                <img src={member.photo_url} alt={member.first_name} className="w-full h-full object-cover" />
              ) : (
                <User size={28} strokeWidth={1.5} />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-sm truncate leading-tight">
                {member.first_name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 truncate uppercase tracking-tight">
                {member.last_name}
              </p>
              
              {/* Dates */}
              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded w-fit">
                 <Calendar size={10} className="text-slate-300" />
                 <span>
                   {member.birth_date ? new Date(member.birth_date).getFullYear() : "?"}
                   {member.death_date && ` - ${new Date(member.death_date).getFullYear()}`}
                 </span>
              </div>
            </div>
          </div>
          
          {/* Status Deceased Stripe */}
          {member.death_date && (
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-300" title="Deceased" />
          )}
        </motion.div>
      </Link>
      
      {/* Floating Action Button (Only visible on hover/focus) */}
      {onAddChild && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddChild(member.id);
          }}
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-slate-300 text-slate-500 rounded-full flex items-center justify-center shadow-sm hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all opacity-0 group-hover:opacity-100 z-20"
          title="Add Child"
        >
          <Plus size={14} strokeWidth={3} />
        </motion.button>
      )}
    </div>
  );
}
