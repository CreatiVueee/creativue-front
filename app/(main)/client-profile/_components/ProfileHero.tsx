"use client";

import { useRef } from "react";
import { Camera, User, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";

export function ProfileHero() {
  const { user } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handle = (user?.name ?? "user").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="relative overflow-hidden bg-white">
      {/* 블롭 장식 */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -40, left: -40, width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(252,180,210,0.22) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: -20, right: 80, width: 340, height: 340, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(178,110,253,0.12) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -30, right: -20, width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(147,181,246,0.18) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <p className="text-[11px] font-bold uppercase mb-6" style={{ color: "#b26efd", letterSpacing: "0.14em" }}>
          CreatiVue · 브랜드 프로필
        </p>

        <div className="flex items-center gap-7">
          {/* 아바타 */}
          <div className="relative flex-shrink-0">
            <div
              className="flex items-center justify-center"
              style={{
                width: 96, height: 96, borderRadius: 20,
                background: "linear-gradient(135deg, #f3b0f2, #b26efd)",
                boxShadow: "0 8px 24px rgba(178,110,253,0.25)",
              }}
            >
              <User size={40} className="text-white" />
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex items-center justify-center transition-transform hover:scale-110"
              style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "white", border: "2px solid #b26efd",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
              aria-label="프로필 사진 변경"
            >
              <Camera size={13} style={{ color: "#b26efd" }} />
            </button>
            {/* ⏳ 나중에: Supabase Storage 업로드 */}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={() => {}} />
          </div>

          {/* 이름 + 배지 */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3"
              style={{
                background: "rgba(178,110,253,0.1)",
                color: "#7c3aed",
                border: "1px solid rgba(178,110,253,0.2)",
              }}
            >
              <Sparkles size={10} />
              클라이언트
            </span>
            <h1
              className="text-gray-900 font-black leading-tight mb-1"
              style={{ fontSize: "2rem", letterSpacing: "-0.02em" }}
            >
              {user?.name ?? "사용자"}
            </h1>
            <p className="text-gray-400 text-sm">@{handle}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
