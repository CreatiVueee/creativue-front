"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu, X, Zap, LogIn, LogOut, UserPlus, LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useLoginModalStore } from "@/features/auth/store/loginModalStore";

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { path: "/brand-review",    label: "브랜드 리뷰",   requiresAuth: true  },
  { path: "/projects",        label: "공모전 리스트",  requiresAuth: false },
  { path: "/expert-booking",  label: "브랜드 전문가",  requiresAuth: false },
  { path: "/partners",        label: "협력사",         requiresAuth: false },
] as const;

const HEADER_GRADIENT = "linear-gradient(135deg, #b26efd 0%, #9a7ef5 50%, #93b5f6 100%)";

// ─── NavButton ────────────────────────────────────────────────────────────────

function NavButton({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-white/25 text-white font-semibold shadow-md"
          : "text-white/80 hover:bg-white/15 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { open: openModal } = useLoginModalStore();

  const [mobileOpen, setMobileOpen] = useState(false);

  // 인증 필요 nav: 미로그인 시 모달 열기
  const handleNavClick = (path: string, requiresAuth: boolean) => {
    if (requiresAuth && !isLoggedIn) {
      openModal(path);
      return;
    }
    router.push(path);
  };

  const handleMobileNavClick = (path: string, requiresAuth: boolean) => {
    setMobileOpen(false);
    handleNavClick(path, requiresAuth);
  };

  const handleLogout = () => {
    // ⏳ 나중에: supabase.auth.signOut() 추가
    logout();
    router.push("/");
  };

  return (
    <nav
      style={{ background: HEADER_GRADIENT }}
      className="sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">CreatiVue</span>
        </Link>

        {/* 데스크톱 Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map(({ path, label, requiresAuth }) => (
            <NavButton
              key={path}
              active={pathname === path}
              onClick={() => handleNavClick(path, requiresAuth)}
            >
              {label}
            </NavButton>
          ))}

          {isLoggedIn && (
            <NavButton
              active={pathname === "/client-profile"}
              onClick={() => router.push("/client-profile")}
            >
              <span className="flex items-center gap-1.5">
                <LayoutDashboard size={14} />
                브랜드 프로필
              </span>
            </NavButton>
          )}
        </div>

        {/* 데스크톱 인증 버튼 */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="text-white/70 text-sm mr-1">{user?.name} 님</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:bg-white/15 hover:text-white transition-all"
              >
                <LogOut size={14} />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openModal()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:bg-white/15 hover:text-white transition-all"
              >
                <LogIn size={14} />
                로그인
              </button>
              <Link
                href="/client-signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-white text-[#b26efd] hover:bg-white/90 transition-all"
              >
                <UserPlus size={14} />
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 토글 버튼 */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* 모바일 드로어 */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="md:hidden overflow-hidden bg-black/10"
          >
            <div className="px-4 pb-4 flex flex-col gap-1 pt-1">
              {NAV_ITEMS.map(({ path, label, requiresAuth }) => (
                <button
                  key={path}
                  onClick={() => handleMobileNavClick(path, requiresAuth)}
                  className={`px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                    pathname === path
                      ? "bg-white/25 text-white font-semibold"
                      : "text-white/80 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}

              <div className="border-t border-white/20 mt-2 pt-2 flex flex-col gap-1">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { setMobileOpen(false); router.push("/client-profile"); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                        pathname === "/client-profile"
                          ? "bg-white/25 text-white font-semibold"
                          : "text-white/80 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <LayoutDashboard size={14} />
                      브랜드 프로필
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/15 hover:text-white transition-all text-left"
                    >
                      <LogOut size={14} />
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMobileOpen(false); openModal(); }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/15 hover:text-white transition-all text-left"
                    >
                      <LogIn size={14} />
                      로그인
                    </button>
                    <Link
                      href="/client-signup"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-white text-[#b26efd]"
                    >
                      <UserPlus size={14} />
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
