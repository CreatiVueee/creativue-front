import {
  FileText, BookOpen, Sparkles, Hash, Target, Tag,
} from "lucide-react";
import { useBrandReviewStore } from "@/features/auth/store/brandReviewStore";
import Link from "next/link";

// ─── Local UI atoms ───────────────────────────────────────────────────────────

function SectionHeader({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #f3b0f2, #b26efd)" }}
      >
        {icon}
      </div>
      <h3 className="text-sm font-black text-gray-900">{text}</h3>
    </div>
  );
}

function FieldLabel({ label }: { label: string }) {
  return <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>;
}

function KeywordTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: "linear-gradient(135deg,#f3b0f220,#b26efd20)", color: "#7c3aed", border: "1px solid #d8b4fe" }}
    >
      <Tag size={10} />{label}
    </span>
  );
}

function IndustryTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: "linear-gradient(135deg,#f3b0f220,#b26efd20)", color: "#7c3aed", border: "1px solid #d8b4fe" }}
    >
      {label}
    </span>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">{children}</div>
  );
}

// ─── NoBrandReview fallback ───────────────────────────────────────────────────

function NoBrandReview() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col items-center text-center gap-4">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)" }}
      >
        <FileText size={24} className="text-gray-300" />
      </div>
      <div>
        <p className="font-bold text-gray-700 mb-1">브랜드 리뷰를 먼저 작성해 주세요</p>
        <p className="text-sm text-gray-400 leading-relaxed">
          공모전은 브랜드 리뷰를 기반으로 개최됩니다.<br />
          브랜드 정보를 먼저 입력해 주세요.
        </p>
      </div>
      <Link
        href="/brand-review"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, #b26efd, #93b5f6)" }}
      >
        브랜드 리뷰 작성하기 →
      </Link>
    </div>
  );
}

// ─── BrandReviewPanel ─────────────────────────────────────────────────────────

export function BrandReviewPanel() {
  const { data } = useBrandReviewStore();
  const hasBrand = data.brandName.trim().length > 0;

  if (!hasBrand) return <NoBrandReview />;

  return (
    <div className="space-y-4">
      {/* 브랜드 디테일 */}
      <SectionCard>
        <SectionHeader icon={<FileText size={15} className="text-white" />} text="브랜드 디테일" />
        <div className="space-y-3">
          <div>
            <FieldLabel label="브랜드명" />
            <p className="font-black text-gray-900" style={{ fontSize: "1.1rem" }}>{data.brandName}</p>
          </div>
          {data.industries.length > 0 && (
            <div>
              <FieldLabel label="업종" />
              <div className="flex flex-wrap gap-1.5">
                {data.industries.map((ind) => <IndustryTag key={ind} label={ind} />)}
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 브랜드 스토리 */}
      {data.brandStory && (
        <SectionCard>
          <SectionHeader icon={<BookOpen size={15} className="text-white" />} text="브랜드 스토리" />
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line line-clamp-5">
            {data.brandStory}
          </p>
        </SectionCard>
      )}

      {/* 브랜드 아이덴티티 */}
      {data.brandIdentity && (
        <SectionCard>
          <SectionHeader icon={<Sparkles size={15} className="text-white" />} text="브랜드 아이덴티티" />
          <FieldLabel label="아이덴티티" />
          <p className="text-sm text-gray-700 leading-relaxed">{data.brandIdentity}</p>
        </SectionCard>
      )}

      {/* 브랜드 이미지 */}
      {(data.desiredPerception || data.keywords.length > 0) && (
        <SectionCard>
          <SectionHeader icon={<Hash size={15} className="text-white" />} text="브랜드 이미지" />
          {data.desiredPerception && (
            <div className="mb-3">
              <FieldLabel label="고객 인식 목표" />
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{data.desiredPerception}</p>
            </div>
          )}
          {data.keywords.length > 0 && (
            <div>
              <FieldLabel label="핵심 키워드" />
              <div className="flex flex-wrap gap-1.5">
                {data.keywords.map((kw) => <KeywordTag key={kw} label={kw} />)}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* 타겟 소비자 */}
      {(data.market || data.gender || data.ageGroups.length > 0 || data.interests.length > 0) && (
        <SectionCard>
          <SectionHeader icon={<Target size={15} className="text-white" />} text="타겟 소비자" />
          <div className="space-y-2.5">
            {data.market && (
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-[10px] text-gray-400 mb-0.5">타겟 시장</p>
                <p className="text-xs font-semibold text-gray-800">{data.market}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {data.gender && (
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">성별</p>
                  <p className="text-xs font-semibold text-gray-800">{data.gender}</p>
                </div>
              )}
              {data.occupation && (
                <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-gray-400 mb-0.5">직업군</p>
                  <p className="text-xs font-semibold text-gray-800">{data.occupation}</p>
                </div>
              )}
            </div>
            {data.ageGroups.length > 0 && (
              <div>
                <FieldLabel label="연령대" />
                <div className="flex flex-wrap gap-1.5">
                  {data.ageGroups.map((a) => (
                    <span key={a} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{a}</span>
                  ))}
                </div>
              </div>
            )}
            {data.interests.length > 0 && (
              <div>
                <FieldLabel label="관심사" />
                <div className="flex flex-wrap gap-1.5">
                  {data.interests.map((i) => <IndustryTag key={i} label={i} />)}
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
