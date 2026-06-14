interface QLabelProps {
  num: string;
  text: string;
  sub?: string;
}

export function QLabel({ num, text, sub }: QLabelProps) {
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5"
        style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
      >
        {num}
      </div>
      <div>
        <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>
          {text}
        </p>
        {sub && (
          <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}
