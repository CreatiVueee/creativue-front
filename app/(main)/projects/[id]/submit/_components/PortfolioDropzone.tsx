"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

const ALLOWED_EXTENSIONS = new Set(["png", "jpg", "jpeg", "pdf"]);
const MAX_SIZE_MB = 50;

interface PortfolioDropzoneProps {
  files: File[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

function isValidFile(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) return false;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) return false;
  return true;
}

export function PortfolioDropzone({ files, onAdd, onRemove }: PortfolioDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const valid = Array.from(fileList).filter(isValidFile);
    if (valid.length > 0) onAdd(valid);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = ""; // 동일 파일 재선택 허용
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        className="flex flex-col items-center justify-center gap-2.5 py-9 rounded-2xl cursor-pointer transition-all"
        style={{
          border: `2px dashed ${dragOver ? "var(--brand-purple)" : "#e9d5ff"}`,
          background: dragOver ? "#f9f0ff" : "#faf8ff",
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center bg-white"
          style={{ boxShadow: "0 2px 10px color-mix(in srgb, var(--brand-purple) 25%, transparent)" }}
        >
          <Upload size={19} className="text-brand-purple" />
        </div>
        <p className="text-sm font-bold text-gray-800">파일을 끌어오거나 클릭</p>
        <p className="text-[11px] text-gray-400">PNG · JPG · PDF · 최대 {MAX_SIZE_MB}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border-[1.5px] border-brand-purple"
              style={{ background: "#f9f0ff" }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="text-brand-purple shrink-0" />
                <span className="text-xs text-gray-700 font-semibold truncate">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="파일 제거"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
