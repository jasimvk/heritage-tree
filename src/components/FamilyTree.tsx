"use client";

import React, { useRef, useEffect, useState } from "react";
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
      <div key={parentId || 'root'} className="flex flex-col items-center gap-12">
        <div className="flex gap-8 items-start justify-center flex-wrap px-4">
          {children.map(child => (
            <div key={child.id} className="flex flex-col items-center gap-12">
              <div className="relative group" data-member-id={child.id}>
                <MemberNode member={child} />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAddMember(child.id);
                  }}
                  className="absolute -right-3 -top-3 bg-blue-600 text-white w-7 h-7 rounded-full shadow-lg z-10 flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors"
                  title="Add relative"
                >
                  <Plus size={14} strokeWidth={3} />
                </button>
              </div>
              <div className="flex gap-8">
                {buildTree(child.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ];
  };

  return (
    <div ref={containerRef} className="relative min-h-[600px] w-full flex justify-center pt-20">
      {members.length > 0 ? (
        <>
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {lines.map((line, i) => (
              <path
                key={i}
                d={`M ${line.x1} ${line.y1} L ${line.x1} ${line.y1 + 24} L ${line.x2} ${line.y1 + 24} L ${line.x2} ${line.y2}`}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
          <div className="relative z-10">
            {buildTree()}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-200 p-10 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No members found</h3>
          <p className="text-slate-500 text-sm mb-8">Start your family tree by adding the first member.</p>
          <button
            onClick={() => onAddMember()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:scale-95"
          >
            Add Founding Member
          </button>
        </div>
      )}
    </div>
  );
}
