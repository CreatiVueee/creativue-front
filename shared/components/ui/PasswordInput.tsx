"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** true → 빨간 테두리 + 분홍 배경 (비밀번호 불일치 등) */
  hasError?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = "비밀번호를 입력해 주세요",
  disabled = false,
  hasError = false,
}: PasswordInputProps) {
  const [showPw, setShowPw]     = useState(false);
  const [isFocused, setFocused] = useState(false);

  const borderColor = hasError
    ? "#fca5a5"
    : isFocused
    ? "#b26efd"
    : "#e9d5ff";

  return (
    <div className="relative">
      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
      <input
        type={showPw ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
        style={{
          border: `1.5px solid ${borderColor}`,
          background: hasError ? "#fff8f8" : "#fff",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPw((v) => !v)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
      >
        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}
