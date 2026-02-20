"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import { FamilyMember } from "@/types/family";
import MemberNode from "./MemberNode";
import { Plus, Users } from "lucide-react";

interface FamilyTreeProps {
  members: FamilyMember[];
  onAddMember: (parentId?: string) => void;
}

export default function FamilyTree({ members, onAddMember }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Function to calculate line positions
  const updateLines = () => {
    if (!containerRef.current) return;
    const newLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const nodes = containerRef.current.querySelectorAll("[data-member-id]");
    const containerRect = containerRef.current.getBoundingClientRect();

    nodes.forEach((node) => {
      const childId = node.getAttribute("data-member-id");
      const member = members.find(m => m.id === childId);
      if (member && member.father_id) {
        const parentNode = containerRef.current?.querySelector(`[data-member-id="${member.father_id}"]`);
        if (parentNode) {
          const childRect = node.getBoundingClientRect();
          const parentRect = parentNode.getBoundingClientRect();

          newLines.push({
            x1: parentRect.left + parentRect.width / 2 - containerRect.left,
            y1: parentRect.bottom - containerRect.top,
            x2: childRect.left + childRect.width / 2 - containerRect.left,
            y2: childRect.top - containerRect.top,
          });
        }
      }
    });
    setLines(newLines);
  };

  useEffect(() => {
    updateLines();
    window.addEventListener("resize", updateLines);
    return () => window.removeEventListener("resize", updateLines);
  }, [members]);

  const buildTree = (parentId?: string): React.ReactNode[] => {
    const children = members.filter(m => m.father_id === parentId || (parentId === undefined && !m.father_id && !m.mother_id));
    if (children.length === 0) return [];

    return [
      <div key={parentId || 'root'} className="flex flex-col items-center gap-24">
        <div className="flex gap-16 items-start justify-center flex-wrap px-12">
          {children.map(child => (
            <div key={child.id} className="flex flex-col items-center gap-24">
              <div className="relative group" data-member-id={child.id}>
                <MemberNode member={child} />
                <button
                  onClick={() => onAddMember(child.id)}
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-amber-600 text-white px-4 py-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-xl z-10 hover:scale-110 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                >
                  <Plus size={14} /> Add Child
                </button>
              </div>
              <div className="flex gap-16">
                {buildTree(child.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ];
  };

  return (
    <div ref={containerRef} className="relative min-h-[600px] w-full flex justify-center pt-10">
      {members.length > 0 ? (
        <>
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {lines.map((line, i) => (
              <path
                key={i}
                d={`M ${line.x1} ${line.y1} C ${line.x1} ${(line.y1 + line.y2) / 2}, ${line.x2} ${(line.y1 + line.y2) / 2}, ${line.x2} ${line.y2}`}
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3"
                strokeLinecap="round"
                className="opacity-20"
              />
            ))}
          </svg>
          <div className="relative z-10">
            {buildTree()}
          </div>
        </>
      ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 p-20 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Users size={40} />
          </div>
          <h3 className="text-3xl font-serif font-black text-slate-800 mb-4">The story begins with you.</h3>
          <p className="text-slate-500 font-medium mb-10 leading-relaxed">No family members have been approved yet. Start building the Cheruvattam legacy by adding the first member.</p>
          <button
            onClick={() => onAddMember()}
            className="px-10 py-5 bg-amber-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-2xl shadow-amber-200 hover:scale-105 active:scale-95"
          >
            Create Founding Member
          </button>
        </div>
      )}
    </div>
  );
}
