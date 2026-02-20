"use client";

import { FamilyMember } from "@/types/family";
import { motion } from "framer-motion";
import { User } from "lucide-react";
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "relative flex items-center p-3 rounded-lg border shadow-sm cursor-pointer w-[280px] bg-white transition-all",
          isMale ? "border-blue-200 border-l-4 border-l-blue-500" : 
          "border-pink-200 border-l-4 border-l-pink-500"
        )}
      >
        {/* Simple Avatar */}
        <div className={cn(
          "w-12 h-12 rounded flex-shrink-0 flex items-center justify-center mr-3 overflow-hidden",
          isMale ? "bg-blue-50 text-blue-400" : "bg-pink-50 text-pink-400"
        )}>
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.first_name} className="w-full h-full object-cover" />
          ) : (
            <User size={24} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-900 text-sm truncate leading-tight">
              {member.first_name} {member.last_name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
             <span>{member.birth_date ? new Date(member.birth_date).getFullYear() : "?"}</span>
             {member.death_date && (
                <>
                  <span>-</span>
                  <span>{new Date(member.death_date).getFullYear()}</span>
                </>
             )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
