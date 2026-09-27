"use client";

import { motion } from "motion/react";
import { Trophy, UsersRound } from "lucide-react";

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
  return (
    <div className="space-y-5">
      {/* 나의 공모전 */}
      <SidebarCard
        icon={<Trophy size={14} style={{ color: "#b26efd" }} />}
        title="나의 공모전"
        delay={0.1}
      >
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-gray-400">아직 등록한 공모전이 없어요</p>
        </div>
      </SidebarCard>

      {/* My Collaborator */}
      <SidebarCard
        icon={<UsersRound size={14} style={{ color: "#b26efd" }} />}
        title="My Collaborator"
        delay={0.18}
      >
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-gray-400">아직 협업한 크리에이터가 없어요</p>
        </div>
      </SidebarCard>
    </div>
  );
}
