"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { FamilyMember } from "@/types/family";
import MemberNode from "./MemberNode";
import { Users, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import * as d3 from "d3";

interface FamilyTreeProps {
  members: FamilyMember[];
  onAddMember: (parentId?: string) => void;
}

interface TreeNode extends FamilyMember {
  children: TreeNode[];
}

export default function FamilyTree({ members, onAddMember }: FamilyTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 1. Build Hierarchy Data
  const rootNode = useMemo(() => {
    if (members.length === 0) return null;

    // Build map of members
    const memberMap = new Map<string, TreeNode>();
    members.forEach(m => memberMap.set(m.id, { ...m, children: [] }));

    // Connect children
    const roots: TreeNode[] = [];
    memberMap.forEach(node => {
      if (node.father_id && memberMap.has(node.father_id)) {
        memberMap.get(node.father_id)!.children.push(node);
      } else if (node.mother_id && memberMap.has(node.mother_id)) {
        memberMap.get(node.mother_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    // If multiple roots, create a dummy invisible root to hold them
    if (roots.length > 1) {
      return {
        id: "virtual_root",
        first_name: "Root",
        last_name: "",
        gender: "male",
        children: roots
      } as TreeNode;
    }
    return roots[0] || null;
  }, [members]);

  // 2. Calculate Layout with D3
  const layout = useMemo(() => {
    if (!rootNode) return null;

    const hierarchyNode = d3.hierarchy(rootNode);
    
    // Set node size (width, height) including spacing
    const nodeWidth = 260;
    const nodeHeight = 180;
    
    const treeLayout = d3.tree<TreeNode>()
      .nodeSize([nodeWidth, nodeHeight])
      .separation((a, b) => a.parent === b.parent ? 1.1 : 1.2);

    const root = treeLayout(hierarchyNode);

    // Calculate bounds to center the tree initially
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    root.each(node => {
      if (node.x < minX) minX = node.x;
      if (node.x > maxX) maxX = node.x;
      if (node.y < minY) minY = node.y;
      if (node.y > maxY) maxY = node.y;
    });

    return { root, bounds: { minX, maxX, minY, maxY } };
  }, [rootNode]);

  // Center tree on load & Responsive Resize
  useEffect(() => {
    if (layout && containerRef.current) {
      const { bounds } = layout;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const treeWidth = bounds.maxX - bounds.minX;
      
      // Responsive initial scale: fit to width on mobile if tree is wide
      let initialScale = 1;
      if (width < 768) { // Mobile
         if (treeWidth > width) initialScale = Math.max(0.5, width / (treeWidth + 100));
      }

      setTransform({
        x: width / 2 - ((bounds.minX + treeWidth / 2) * initialScale),
        y: 50, // Padding top
        k: initialScale
      });
    }
  }, [layout]);

  // Unified Start Handler (Mouse & Touch)
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - transform.x, y: clientY - transform.y });
  };

  // Unified Move Handler (Mouse & Touch)
  const handleMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: clientX - dragStart.x,
        y: clientY - dragStart.y
      }));
    }
  };

  const handleEnd = () => setIsDragging(false);

  // Mouse Events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
          e.preventDefault(); // Prevent text selection while dragging
          handleMove(e.clientX, e.clientY);
      }
  }
  
  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
          handleStart(e.touches[0].clientX, e.touches[0].clientY);
      }
  }
  const onTouchMove = (e: React.TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
          // Prevent default scrolling only if we are actively dragging the tree horizontally/vertically
          // e.preventDefault(); 
          handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const scaleBy = 1.1;
      const newScale = e.deltaY < 0 ? transform.k * scaleBy : transform.k / scaleBy;
      setTransform(prev => ({ ...prev, k: Math.max(0.1, Math.min(2, newScale)) }));
    }
  };

  if (!layout) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-slate-400">
        <Users size={48} className="mb-4 opacity-50" />
        <p className="text-sm font-medium">Start your family tree by adding a member.</p>
        <button
          onClick={() => onAddMember()}
          className="mt-6 px-6 py-2 bg-[#4caf50] text-white rounded font-bold text-sm hover:bg-[#43a047] transition-all shadow-sm"
        >
          Add First Member
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[85vh] overflow-hidden bg-[#f0f2f5] border-t md:border border-slate-200 md:rounded-lg shadow-inner select-none cursor-grab active:cursor-grabbing touch-none"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleEnd}
      onWheel={handleWheel}
    >
      {/* Mobile-Friendly Controls */}
      <div className="absolute bottom-6 right-6 md:top-4 md:right-4 z-50 flex flex-row md:flex-col gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-full md:rounded-lg shadow-lg border border-slate-200">
        <button 
          onClick={() => setTransform(prev => ({ ...prev, k: Math.min(2, prev.k + 0.2) }))}
          className="p-3 md:p-2 hover:bg-slate-100 rounded-full md:rounded text-slate-700 active:scale-95 transition-transform" title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        <button 
          onClick={() => setTransform(prev => ({ ...prev, k: Math.max(0.1, prev.k - 0.2) }))}
          className="p-3 md:p-2 hover:bg-slate-100 rounded-full md:rounded text-slate-700 active:scale-95 transition-transform" title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        <button 
          onClick={() => setTransform({ x: containerRef.current?.offsetWidth! / 2 || 0, y: 50, k: 1 })}
          className="p-3 md:p-2 hover:bg-slate-100 rounded-full md:rounded text-slate-700 active:scale-95 transition-transform" title="Reset View"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <div 
        className="absolute origin-top-left transition-transform duration-100 ease-out will-change-transform"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})` }}
      >
        {/* SVG Links */}
        <svg className="absolute top-0 left-0 overflow-visible" style={{ width: 1, height: 1 }}>
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 z" fill="#b2c1d4" />
            </marker>
          </defs>
          {layout.root.links().map((link, i) => {
            // Orthogonal path
            const sourceX = link.source.x;
            const sourceY = link.source.y + 40; // Start from bottom of parent card
            const targetX = link.target.x;
            const targetY = link.target.y - 40; // End at top of child card
            
            const midY = (sourceY + targetY) / 2;

            const d = `M ${sourceX} ${sourceY} 
                       L ${sourceX} ${midY} 
                       L ${targetX} ${midY} 
                       L ${targetX} ${targetY}`;

            return (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* HTML Nodes */}
        {layout.root.descendants().map((node) => {
          if (node.data.id === "virtual_root") return null; // Skip virtual root
          return (
            <div
              key={node.data.id}
              className="absolute flex justify-center items-center"
              style={{
                left: node.x,
                top: node.y,
                width: 0, // Centered
                height: 0
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <MemberNode member={node.data} onAddChild={onAddMember} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
