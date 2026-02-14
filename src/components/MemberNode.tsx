"use client";

import { FamilyMember } from "@/types/family";
import { motion } from "framer-motion";
import { User, Heart, Baby } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MemberNodeProps {
  member: FamilyMember;
  onClick?: () => void;
}

export default function MemberNode({ member, onClick }: MemberNodeProps) {
  const isMale = member.gender === "male";
  const isFemale = member.gender === "female";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center p-4 rounded-3xl border-2 transition-all cursor-pointer w-44 shadow-md bg-white",
        isMale ? "border-amber-100 hover:border-amber-400" : 
        isFemale ? "border-emerald-100 hover:border-emerald-400" : 
        "border-zinc-100 hover:border-zinc-400"
      )}
    >
      {/* Avatar or Placeholder */}
      <div className={cn(
        "w-24 h-24 rounded-full flex items-center justify-center mb-3 shadow-inner overflow-hidden border-4 border-white",
        isMale ? "bg-amber-50 text-amber-500" : 
        isFemale ? "bg-emerald-50 text-emerald-500" : 
        "bg-zinc-50 text-zinc-500"
      )}>
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.first_name} className="w-full h-full object-cover" />
        ) : (
          <User size={48} />
        )}
      </div>

      <div className="text-center">
        <h3 className="font-bold text-zinc-800 text-lg leading-tight">
          {member.first_name}
        </h3>
        <p className="text-sm font-semibold text-zinc-400 uppercase tracking-tighter">
          {member.last_name}
        </p>
        <p className="text-xs text-zinc-400 mt-2 font-medium">
          {member.birth_date ? new Date(member.birth_date).getFullYear() : ""} 
          {member.death_date ? ` — ${new Date(member.death_date).getFullYear()}` : ""}
        </p>
      </div>

      {/* Decorative Icons */}
      <div className="absolute -top-2 -right-2 flex gap-1">
        {member.spouse_id && (
          <div className="bg-rose-500 text-white p-1 rounded-full shadow-sm">
            <Heart size={12} fill="currentColor" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
