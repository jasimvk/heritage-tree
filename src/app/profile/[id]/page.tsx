"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, MapPin, Camera } from "lucide-react";

export default function ProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('/api/members');
        const data = await res.json();
        const found = data.find((m: any) => m.id === id);
        setMember(found);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  if (!member) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Member not found</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Header */}
      <div className="h-64 bg-zinc-900 relative">
        <button 
          onClick={() => router.back()}
          className="absolute top-8 left-8 p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all z-10"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="max-w-4xl mx-auto px-8 -mt-32 relative pb-20">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-white">
          {/* Profile Header */}
          <div className="p-12 text-center border-b border-slate-50">
            <div className="w-48 h-48 bg-slate-100 rounded-[40px] mx-auto mb-8 flex items-center justify-center text-slate-300 relative group overflow-hidden border-4 border-white shadow-xl">
              {member.photo_url ? (
                <img src={member.photo_url} alt={member.first_name} className="w-full h-full object-cover" />
              ) : (
                <User size={80} />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Camera className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-5xl font-serif font-black text-slate-900 mb-2">{member.first_name} {member.last_name}</h1>
            <p className="text-amber-600 font-black uppercase tracking-[0.2em] text-sm">Cheruvattam Lineage</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-12">
            <div className="space-y-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Personal Details</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Birth Date</p>
                    <p className="text-lg font-bold text-slate-800">{member.birth_date || 'Unknown'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Gender</p>
                    <p className="text-lg font-bold text-slate-800 uppercase tracking-wide">{member.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">History & Legacy</h2>
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-slate-600 leading-relaxed font-medium italic">
                  "Part of the grand Cheruvattam family history. This profile is maintained as a digital legacy for future generations."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
