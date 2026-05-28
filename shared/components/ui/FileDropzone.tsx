"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

const ALLOWED_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png"]);
const MAX_SIZE_MB = 20;

interface FileDropzoneProps {
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
}

function isValidFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) return false;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return false;
  return true;
}

export function FileDropzone({ file, onFile, onClear }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && isValidFile(dropped)) onFile(dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && isValidFile(selected)) onFile(selected);
    e.target.value = ""; // 동일 파일 재선택 허용
  };

  // ── 파일 업로드 후 상태 ────────────────────────────────────────────────────
  if (file) {
    return (
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ border: "1.5px solid #b26efd", background: "#f9f0ff" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={15} style={{ color: "#b26efd", flexShrink: 0 }} />
          <span className="text-xs text-gray-700 font-semibold truncate">{file.name}</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors"
          aria-label="파일 제거"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  // ── 업로드 전 드롭존 ──────────────────────────────────────────────────────
  return (
    <div
      role="button"
      tabIndex={0}
      className="flex flex-col items-center justify-center gap-2 py-10 rounded-xl cursor-pointer transition-all"
      style={{
        border: `2px dashed ${dragOver ? "#b26efd" : "#e9d5ff"}`,
        background: dragOver ? "#f9f0ff" : "#fafafa",
      }}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
      >
        <Upload size={18} className="text-white" />
      </div>
      <p className="text-xs text-gray-500 text-center">
        <span style={{ color: "#b26efd", fontWeight: 700 }}>파일 선택</span> 또는 여기에 드래그하세요
      </p>
      <p className="text-[10px] text-gray-300">PDF / JPG / PNG (최대 {MAX_SIZE_MB}MB)</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
