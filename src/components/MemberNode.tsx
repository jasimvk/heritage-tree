"use client";

import { FamilyMember } from "@/types/family";
import { motion } from "framer-motion";
import { User, Plus } from "lucide-react";
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
  const isFemale = member.gender === "female";

  return (
    <div className="relative group">
      <Link href={`/profile/${member.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative flex items-center p-2 rounded border shadow-sm cursor-pointer w-[240px] bg-white transition-all hover:shadow-md",
            isMale ? "border-blue-200 border-l-4 border-l-blue-400" : 
            "border-pink-200 border-l-4 border-l-pink-400"
          )}
        >
          {/* Geni style Avatar - Square with slight round */}
          <div className={cn(
            "w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden",
            isMale ? "bg-blue-50 text-blue-300" : "bg-pink-50 text-pink-300"
          )}>
            {member.photo_url ? (
              <img src={member.photo_url} alt={member.first_name} className="w-full h-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-800 text-xs truncate leading-tight">
              {member.first_name} {member.last_name}
            </h3>
            <div className="text-[10px] text-slate-400 font-normal mt-0.5">
               {member.birth_date ? new Date(member.birth_date).getFullYear() : ""}
               {member.death_date ? ` - ${new Date(member.death_date).getFullYear()}` : ""}
            </div>
          </div>
        </motion.div>
      </Link>
      
      {/* Geni-style floating plus button for adding family */}
      {onAddChild && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddChild(member.id);
          }}
          className="absolute -right-2 -bottom-2 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:shadow-sm transition-all z-20"
        >
          <Plus size={12} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
