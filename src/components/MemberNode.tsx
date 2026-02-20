"use client";

import { FamilyMember } from "@/types/family";
import { motion } from "framer-motion";
import { User, Heart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

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
    <Link href={`/profile/${member.id}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
        className={cn(
          "relative flex flex-col items-center p-8 rounded-[3rem] border transition-all cursor-pointer w-56 bg-white/80 backdrop-blur-xl",
          isMale ? "border-amber-100 hover:border-amber-400 shadow-[0_20px_50px_rgba(251,191,36,0.1)]" : 
          isFemale ? "border-emerald-100 hover:border-emerald-400 shadow-[0_20px_50px_rgba(52,211,153,0.1)]" : 
          "border-zinc-100 hover:border-zinc-400 shadow-xl"
        )}
      >
        {/* Avatar or Placeholder */}
        <div className={cn(
          "w-28 h-28 rounded-[2rem] flex items-center justify-center mb-4 shadow-inner overflow-hidden border-4 border-white",
          isMale ? "bg-amber-50 text-amber-500" : 
          isFemale ? "bg-emerald-50 text-emerald-500" : 
          "bg-zinc-50 text-zinc-500"
        )}>
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.first_name} className="w-full h-full object-cover" />
          ) : (
            <User size={48} />
          )}
        </div>

        <div className="text-center">
          <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight">
            {member.first_name}
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
            {member.last_name}
          </p>
          <p className="text-xs text-slate-400 mt-3 font-bold uppercase tracking-widest">
            {member.birth_date ? new Date(member.birth_date).getFullYear() : "Legacy"}
          </p>
        </div>

        {/* Decorative Icons */}
        <div className="absolute top-4 right-4 flex gap-1">
          {member.spouse_id && (
            <div className="bg-rose-500 text-white p-1.5 rounded-full shadow-lg">
              <Heart size={14} fill="currentColor" />
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
