"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Trophy, UsersRound, ChevronRight } from "lucide-react";

// ─── Mock Data (⏳ 나중에 Supabase 쿼리로 교체) ──────────────────────────────

const MOCK_MY_CONTESTS = [
  {
    id: 1,
    name: "브랜드 로고 & 디지털 광고 공모전",
    image: "https://images.unsplash.com/photo-1590102426275-8d1c367070d3?w=400&q=80",
    deadline: "2026-07-20",
    prize: 3000000,
    submissions: 6,
  },
  {
    id: 2,
    name: "소셜미디어 콘텐츠 패키지 공모전",
    image: "https://images.unsplash.com/photo-1722172597269-d911054badb9?w=400&q=80",
    deadline: "2026-08-10",
    prize: 1500000,
    submissions: 3,
  },
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#f3b0f2,#b26efd)",
  "linear-gradient(135deg,#b26efd,#93b5f6)",
  "linear-gradient(135deg,#f9a8d4,#f3b0f2)",
  "linear-gradient(135deg,#93b5f6,#818cf8)",
];

const MOCK_COLLABORATORS = [
  { id: 1, initial: "김", name: "김지영", role: "그래픽 디자이너", specialty: "브랜딩" },
  { id: 2, initial: "이", name: "이서준", role: "UI/UX 디자이너",  specialty: "디지털 광고" },
  { id: 3, initial: "박", name: "박민아", role: "영상 편집자",      specialty: "소셜미디어" },
  { id: 4, initial: "최", name: "최현우", role: "카피라이터",       specialty: "네이밍/슬로건" },
];

// ─── SidebarCard wrapper ──────────────────────────────────────────────────────

function SidebarCard({
  icon,
  title,
  delay,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        className="px-5 py-3.5 flex items-center gap-2"
        style={{ background: "linear-gradient(135deg, #fdf4ff, #ede9fe)", borderBottom: "1px solid #e9d5ff" }}
      >
        {icon}
        <p className="text-xs font-bold" style={{ color: "#7c3aed" }}>{title}</p>
      </div>
      {children}
    </motion.div>
  );
}

// ─── MyContestsSidebar ────────────────────────────────────────────────────────

export function MyContestsSidebar() {
  const router = useRouter();

  return (
    <div className="space-y-5">
      {/* 나의 공모전 */}
      <SidebarCard
        icon={<Trophy size={14} style={{ color: "#b26efd" }} />}
        title="나의 공모전"
        delay={0.1}
      >
        <div className="divide-y divide-gray-50">
          {MOCK_MY_CONTESTS.map((contest) => (
            <div key={contest.id} className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={contest.image}
                  alt={contest.name}
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                />
                <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2">
                  {contest.name}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center">
                <StatCell label="마감일" value={contest.deadline.slice(5).replace("-", "/")} />
                <StatCell
                  label="상금"
                  value={`${(contest.prize / 10000).toFixed(0)}만원`}
                  valueStyle={{ color: "#b26efd" }}
                />
                <StatCell label="제출수" value={`${contest.submissions}건`} />
              </div>

              <button
                onClick={() => router.push("/prevue")}
                className="w-full py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd, #93b5f6)" }}
              >
                제출작 보러가기 <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </SidebarCard>

      {/* My Collaborator */}
      <SidebarCard
        icon={<UsersRound size={14} style={{ color: "#b26efd" }} />}
        title="My Collaborator"
        delay={0.18}
      >
        <div className="py-1.5">
          {MOCK_COLLABORATORS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => router.push(`/expert-booking/${c.id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
              >
                {c.initial}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.role} · {c.specialty}</p>
              </div>
              <ChevronRight size={14} className="text-gray-300 group-hover:text-purple-400 transition-colors flex-shrink-0" />
            </button>
          ))}
        </div>
      </SidebarCard>
    </div>
  );
}

// ─── StatCell ─────────────────────────────────────────────────────────────────

function StatCell({
  label,
  value,
  valueStyle,
}: {
  label: string;
  value: string;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="bg-gray-50 rounded-xl py-1.5 px-1">
      <p className="text-[9px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-[10px] font-bold text-gray-700" style={valueStyle}>{value}</p>
    </div>
  );
}
