import { CheckCircle2 } from "lucide-react";

// light: 연보라 그라디언트 + 보라 텍스트 (서비스 선택 칩)
// solid: 핑크-보라 그라디언트 + 흰 텍스트 (창작 분야 칩)
type ChipVariant = "light" | "solid";

interface ChipButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: ChipVariant;
  /** active 시 우상단 체크 아이콘 표시 여부 */
  showCheckIcon?: boolean;
  /** 패딩·폰트 크기 등 사이즈 오버라이드 */
  className?: string;
}

const ACTIVE_STYLES: Record<ChipVariant, React.CSSProperties> = {
  light: { background: "linear-gradient(135deg, #f9f0ff, #ede9fe)", color: "#7c3aed" },
  solid: { background: "linear-gradient(135deg, #f3b0f2, #b26efd)", color: "#fff" },
};

export function ChipButton({
  active,
  onClick,
  children,
  variant = "solid",
  showCheckIcon = false,
  className,
}: ChipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-xl text-left transition-all ${
        className ?? "px-4 py-2.5 text-sm"
      }`}
      style={{
        border: `1.5px solid ${active ? "#b26efd" : "#e9d5ff"}`,
        ...(active ? ACTIVE_STYLES[variant] : { background: "#fafafa", color: "#6b7280" }),
        fontWeight: active ? 700 : 500,
      }}
    >
      {showCheckIcon && active && (
        <CheckCircle2
          size={12}
          className="absolute top-2 right-2"
          style={{ color: "#b26efd" }}
        />
      )}
      {children}
    </button>
  );
}
