"use client";

import React, { useRef, useEffect, useState } from "react";
import { FamilyMember } from "@/types/family";
import MemberNode from "./MemberNode";
import { Users } from "lucide-react";

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
    // Extra update to catch late renders
    const timer = setTimeout(updateLines, 500);
    return () => {
      window.removeEventListener("resize", updateLines);
      clearTimeout(timer);
    };
  }, [members]);

  const buildTree = (parentId?: string): React.ReactNode[] => {
    const children = members.filter(m => m.father_id === parentId || (parentId === undefined && !m.father_id && !m.mother_id));
    if (children.length === 0) return [];

    return [
      <div key={parentId || 'root'} className="flex flex-col items-center">
        <div className="flex gap-x-12 gap-y-12 items-start justify-center flex-wrap px-4">
          {children.map(child => (
            <div key={child.id} className="flex flex-col items-center">
              <div className="mb-10" data-member-id={child.id}>
                <MemberNode member={child} onAddChild={onAddMember} />
              </div>
              <div className="flex gap-x-12">
                {buildTree(child.id)}
              </div>
            </div>
          ))}
        </div>
      </div>
    ];
  };

  return (
    <div ref={containerRef} className="relative min-h-[600px] w-full flex justify-center pt-8 bg-[#f5f7f9] border border-slate-200 rounded-sm">
      {members.length > 0 ? (
        <>
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            {lines.map((line, i) => (
              <path
                key={i}
                d={`M ${line.x1} ${line.y1} L ${line.x1} ${line.y1 + 20} L ${line.x2} ${line.y1 + 20} L ${line.x2} ${line.y2}`}
                fill="none"
                stroke="#b2c1d4"
                strokeWidth="1"
                strokeLinecap="square"
              />
            ))}
          </svg>
          <div className="relative z-10 p-10">
            {buildTree()}
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-sm border border-slate-200 p-10 max-w-lg mx-auto my-20">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded flex items-center justify-center mx-auto mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Tree is empty</h3>
          <p className="text-slate-400 text-xs mb-6">Start by adding the founding member.</p>
          <button
            onClick={() => onAddMember()}
            className="px-4 py-2 bg-blue-500 text-white rounded text-xs font-bold hover:bg-blue-600 transition-colors"
          >
            Add Founding Member
          </button>
        </div>
      )}
    </div>
  );
}
