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
        "relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer w-48 shadow-lg bg-white",
        isMale ? "border-blue-200 hover:border-blue-400" : 
        isFemale ? "border-rose-200 hover:border-rose-400" : 
        "border-zinc-200 hover:border-zinc-400"
      )}
    >
      {/* Avatar or Placeholder */}
      <div className={cn(
        "w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-inner overflow-hidden",
        isMale ? "bg-blue-50 text-blue-500" : 
        isFemale ? "bg-rose-50 text-rose-500" : 
        "bg-zinc-50 text-zinc-500"
      )}>
        {member.avatar_url ? (
          <img src={member.avatar_url} alt={member.first_name} className="w-full h-full object-cover" />
        ) : (
          <User size={40} />
        )}
      </div>

      <div className="text-center">
        <h3 className="font-bold text-zinc-800 leading-tight">
          {member.first_name} {member.last_name}
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          {member.birth_date ? new Date(member.birth_date).getFullYear() : "???"} 
          {member.death_date ? ` - ${new Date(member.death_date).getFullYear()}` : ""}
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
