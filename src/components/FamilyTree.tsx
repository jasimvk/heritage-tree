"use client";

import { useState, useMemo } from "react";
import { FamilyMember } from "@/types/family";
import MemberNode from "./MemberNode";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface FamilyTreeProps {
  members: FamilyMember[];
  onAddMember: (parentId?: string) => void;
}

export default function FamilyTree({ members, onAddMember }: FamilyTreeProps) {
  // Organize members into generations
  // For simplicity, we'll calculate generations based on parent-child links
  const generations = useMemo(() => {
    const genMap: Record<number, FamilyMember[]> = {};
    const memberGen: Record<string, number> = {};

    // 1. Find roots (members with no parents in the current list)
    const roots = members.filter(m => !m.father_id && !m.mother_id);
    
    const calculateGen = (memberId: string, gen: number) => {
      if (memberGen[memberId] !== undefined) return;
      memberGen[memberId] = gen;
      if (!genMap[gen]) genMap[gen] = [];
      const member = members.find(m => m.id === memberId);
      if (member) genMap[gen].push(member);

      // Find children
      const children = members.filter(m => m.father_id === memberId || m.mother_id === memberId);
      children.forEach(child => calculateGen(child.id, gen + 1));
    };

    roots.forEach(root => calculateGen(root.id, 0));

    // Handle disconnected members
    members.forEach(m => {
      if (memberGen[m.id] === undefined) {
        calculateGen(m.id, 0);
      }
    });

    return Object.keys(genMap).sort((a, b) => Number(a) - Number(b)).map(key => genMap[Number(key)]);
  }, [members]);

  return (
    <div className="flex flex-col items-center gap-24 p-12 min-h-screen">
      {generations.map((gen, idx) => (
        <div key={idx} className="relative flex flex-wrap justify-center gap-12 items-start">
          {gen.map(member => (
            <div key={member.id} className="relative group">
              <MemberNode member={member} />
              
              {/* Add child button visible on hover */}
              <button
                onClick={() => onAddMember(member.id)}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:scale-105 flex items-center gap-1 text-xs font-bold"
              >
                <Plus size={14} /> Add Child
              </button>
            </div>
          ))}

          {/* SVG Connector layer for the whole generation */}
          {idx < generations.length - 1 && (
            <div className="absolute top-full h-24 w-full flex justify-center pointer-events-none">
                {/* Visual indicator for downward flow */}
                <div className="w-[2px] bg-gradient-to-b from-amber-200 to-transparent h-full"></div>
            </div>
          )}
        </div>
      ))}

      {members.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-zinc-400 mb-4 text-balance">Every story has a beginning.</h3>
          <button
            onClick={() => onAddMember()}
            className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all shadow-xl"
          >
            Start the Cheruvattam Tree
          </button>
        </div>
      )}
    </div>
  );
}
