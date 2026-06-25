import { createClient } from "./client";
import type { Database } from "@/data/supabase";
import type { Contest } from "@/shared/types";

// ─── Row Types ────────────────────────────────────────────────────────────────

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type BrandRow   = Database["public"]["Tables"]["brands"]["Row"];

export type BrandsInsert      = Database["public"]["Tables"]["brands"]["Insert"];
export type ProjectsInsert    = Database["public"]["Tables"]["projects"]["Insert"];
export type SubmissionsInsert = Database["public"]["Tables"]["project_submissions"]["Insert"];

/** projects + brands JOIN 결과 타입 (fetchProjects / fetchProjectById 반환값) */
export type ProjectWithBrand = ProjectRow & { brands: BrandRow };

export type SubmissionWithFreelancer =
  Database["public"]["Tables"]["project_submissions"]["Row"] & {
    freelancers: Database["public"]["Tables"]["freelancers"]["Row"];
  };

// ─── Adapter: DB Row → UI Contest type ───────────────────────────────────────

/**
 * DB에서 가져온 ProjectWithBrand를 UI에서 사용하는 Contest 타입으로 변환한다.
 * DB 컬럼(snake_case) ↔ UI 필드(camelCase) 매핑 일람:
 *
 *  DB (brands)                  → UI (Contest)
 *  ─────────────────────────────────────────────
 *  brand_name                   → brand
 *  industries[0]                → industry
 *  brand_image                  → image
 *  logo_file_url[]              → brandImages
 *  brand_core_keywords[]        → brandKeywords
 *  brand_identity               → brandIdentity
 *  brand_story                  → brandStory
 *  target_ages[].join(', ')     → targetConsumer.ageRange
 *  target_gender                → targetConsumer.gender
 *  target_jobs                  → targetConsumer.occupation
 *  target_interests[]           → targetConsumer.interests
 *  target_region[].join(', ')   → targetConsumer.region
 *  extra_notes                  → additionalRequests
 *
 *  DB (projects)                → UI (Contest)
 *  ─────────────────────────────────────────────
 *  id                           → id
 *  content_categories[]         → contentTypes
 *  deadline_date                → deadline  (ISO string "YYYY-MM-DD")
 *  reward_amount                → prize     (number, 원 단위)
 *  is_ai_allowed                → aiAllowed
 *  price_range                  → product.priceRange
 *  differentiation_point        → product.differentiation
 *  additional_info              → product.additionalInfo
 *
 *  DB 없는 필드 기본값:
 *  hot        → false  (DB에 컬럼 없음, 추후 추가 예정)
 *  applicants → 0      (project_applicants COUNT 쿼리로 교체 예정)
 *  brandColors → []    (DB에 컬럼 없음)
 */
export function adaptProjectToContest(p: ProjectWithBrand): Contest {
  const b = p.brands;
  return {
    id:           p.id,
    brand:        b.brand_name,
    industry:     b.industries[0] ?? "",
    contentTypes: p.content_categories,
    deadline:     p.deadline_date,
    prize:        p.reward_amount,
    applicants:   0,        // ⏳ COUNT(project_applicants) 쿼리로 교체
    hot:          false,    // ⏳ DB 컬럼 추가 후 연동
    aiAllowed:    p.is_ai_allowed,
    image:        b.brand_image,
    brandImages:  b.logo_file_url ?? [],
    categoryId:   (p.content_categories[0] ?? "").toLowerCase(),
    brandIdentity:   b.brand_identity,
    brandStory:      b.brand_story,
    brandKeywords:   b.brand_core_keywords,
    brandColors:     [],    // ⏳ DB 컬럼 추가 후 연동
    targetConsumer: {
      ageRange:   b.target_ages?.join(", ")    ?? "",
      gender:     b.target_gender              ?? "",
      occupation: b.target_jobs               ?? "",
      interests:  b.target_interests          ?? [],
      region:     b.target_region?.join(", ") ?? "",
    },
    product: {
      priceRange:     p.price_range,
      differentiation: p.differentiation_point,
      additionalInfo:  p.additional_info ?? "",
    },
    additionalRequests: b.extra_notes ?? "",
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * 공모전 목록 전체 조회 (brands JOIN 포함)
 *
 * Supabase REST:
 *   GET /rest/v1/projects?select=*,brands(*)&order=created_at.desc
 *
 * 헤더:
 *   apikey: NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   Authorization: Bearer NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * 응답 예시:
 *   [
 *     {
 *       "id": 1,
 *       "title": "TechStart Inc. 공모전",
 *       "brand_id": 1,
 *       "content_categories": ["로고", "DA"],
 *       "content_purpose": ["브랜드 인지도 향상"],
 *       "deadline_date": "2026-06-30",
 *       "reward_amount": 3000000,
 *       "is_ai_allowed": true,
 *       "price_range": "월 구독 ₩49,000 ~ ₩299,000",
 *       "differentiation_point": "...",
 *       "paid_amount": 0,
 *       "brands": { "id": 1, "brand_name": "TechStart Inc.", ... }
 *     },
 *     ...
 *   ]
 *
 * RLS 조건: projects/brands 테이블 모두 anon SELECT 정책 필요
 */
export async function fetchProjects(): Promise<ProjectWithBrand[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, brands(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProjectWithBrand[];
}

/**
 * 공모전 단건 조회 (brands JOIN 포함)
 *
 * Supabase REST:
 *   GET /rest/v1/projects?id=eq.{id}&select=*,brands(*)&limit=1
 *
 * 파라미터:
 *   id: number — projects.id (PK)
 *
 * 응답: ProjectWithBrand 단건 또는 null (존재하지 않는 id)
 *
 * RLS 조건: fetchProjects와 동일
 */
export async function fetchProjectById(
  id: number
): Promise<ProjectWithBrand | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, brands(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as ProjectWithBrand;
}

/**
 * 공모전 등록
 *
 * Supabase REST:
 *   POST /rest/v1/projects
 *   Content-Type: application/json
 *   Prefer: return=representation
 *
 * 필수 body 필드:
 *   brand_id             number   — brands.id (FK, insertBrand 반환값)
 *   title                string   — 공모전 제목 (현재 brandName으로 자동 설정)
 *   content_categories   string[] — 제작 콘텐츠 종류 (예: ["로고", "DA"])
 *   content_purpose      string[] — 제작 목적 (예: ["전환 유도", "브랜드 인지도 향상"])
 *   deadline_date        string   — 마감일 ISO string (예: "2026-07-31")
 *   reward_amount        number   — 상금 (원 단위, 예: 3000000)
 *   paid_amount          number   — 지급 완료 금액 (등록 시 0)
 *   price_range          string   — 제품 가격대 (예: "₩30,000 ~ ₩100,000")
 *   differentiation_point string  — 차별화 포인트
 *   required_content     string[] — 제출 필수 콘텐츠 (현재 content_categories와 동일)
 *   is_ai_allowed        boolean  — AI 도구 사용 허용 여부
 *   reference_image_url  string[] — 레퍼런스 이미지 URL 배열 (⏳ Storage 업로드 후 연동)
 *
 * 선택 body 필드:
 *   additional_info      string | null — 추가 요청사항
 *   qc_count             number | null — QC 횟수 (기본 null)
 *
 * 응답: { id: number } — 생성된 projects.id
 *
 * RLS 조건: authenticated INSERT 정책 필요 (현재 anon도 가능)
 * ⚠️  brand_id는 반드시 해당 client_id 소유의 brands여야 함 (추후 RLS로 강제)
 */
export async function insertProject(input: ProjectsInsert): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

// ─── Brands ───────────────────────────────────────────────────────────────────

/**
 * 브랜드 등록 (공모전 등록의 첫 번째 단계)
 *
 * Supabase REST:
 *   POST /rest/v1/brands
 *   Content-Type: application/json
 *   Prefer: return=representation
 *
 * 필수 body 필드:
 *   client_id            number   — clients.id (FK) ⚠️ 현재 1 하드코딩, 실 인증 후 교체
 *   brand_name           string   — 브랜드명
 *   brand_identity       string   — 브랜드 아이덴티티
 *   brand_story          string   — 브랜드 스토리
 *   brand_core_keywords  string[] — 핵심 키워드 (예: ["혁신", "신뢰"])
 *   brand_image          string   — 대표 이미지 URL ⚠️ 현재 "" (Storage 업로드 후 교체)
 *   industries           string[] — 업종 (예: ["IT / 테크"])
 *   input_type           string   — 입력 방식 ("form" 고정)
 *
 * 선택 body 필드:
 *   logo_file_url        string[] | null — 로고 이미지 URL 배열
 *   target_market        string | null   — 타겟 시장 (예: "국내 전국")
 *   target_gender        string | null   — 타겟 성별 (예: "여성 중심")
 *   target_ages          string[] | null — 타겟 연령대 (예: ["20대", "30대"])
 *   target_interests     string[] | null — 타겟 관심사
 *   target_jobs          string | null   — 타겟 직업군
 *   target_region        string[] | null — 타겟 지역
 *   extra_notes          string | null   — 기타 사항 (brandReviewStore.additionalNotes)
 *   extra_notes_etc      string | null   — 원하는 브랜드 인식 (brandReviewStore.desiredPerception)
 *
 * 응답: { id: number } — 생성된 brands.id (insertProject의 brand_id로 사용)
 *
 * RLS 조건: authenticated INSERT 정책 필요
 */
export async function insertBrand(input: BrandsInsert): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("brands")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

// ─── Project Applicants ───────────────────────────────────────────────────────

/**
 * 공모전 지원 등록
 *
 * Supabase REST:
 *   POST /rest/v1/project_applicants
 *   Content-Type: application/json
 *
 * body 필드:
 *   project_id    number — projects.id (FK)
 *   freelancer_id number — freelancers.id (FK) ⚠️ 현재 1 하드코딩, 실 인증 후 교체
 *   applied_at    string — 지원 시각 ISO string (자동 생성)
 *
 * 응답: void (성공 시 204)
 *
 * 에러:
 *   23505 (unique_violation) — 이미 지원한 경우 (project_id + freelancer_id 복합 유니크)
 *
 * RLS 조건: authenticated INSERT 정책 필요
 * ⚠️  freelancer_id는 반드시 로그인한 사용자 본인이어야 함 (추후 RLS로 강제)
 */
export async function insertProjectApplicant(
  projectId: number,
  freelancerId: number
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("project_applicants").insert({
    project_id:   projectId,
    freelancer_id: freelancerId,
    applied_at:   new Date().toISOString(),
  });
  if (error) throw error;
}

// ─── Project Submissions (창작자 제출) ─────────────────────────────────────────

/**
 * 공모전 제출물 목록 조회 (freelancers JOIN 포함)
 *
 * Supabase REST:
 *   GET /rest/v1/project_submissions
 *     ?project_id=eq.{projectId}
 *     &select=*,freelancers(*)
 *
 * 파라미터:
 *   projectId: number — projects.id
 *
 * 응답 예시:
 *   [
 *     {
 *       "id": 1,
 *       "project_id": 1,
 *       "freelancer_id": 1,
 *       "portfolio_file_url": "https://storage.supabase.co/...",
 *       "is_selected": false,
 *       "tone_and_manner": "모던하고 심플한 느낌",
 *       "color_system_rationale": "블루 계열로 신뢰감 표현",
 *       "layout_rationale": "...",
 *       "additional_description": "...",
 *       "freelancers": { "id": 1, "nickname": "홍길동", ... }
 *     }
 *   ]
 *
 * RLS 조건: 해당 프로젝트의 client 또는 지원한 freelancer만 조회 가능하도록 설정 권장
 */
export async function fetchSubmissions(
  projectId: number
): Promise<SubmissionWithFreelancer[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_submissions")
    .select("*, freelancers(*)")
    .eq("project_id", projectId);
  if (error) throw error;
  return (data ?? []) as SubmissionWithFreelancer[];
}

/**
 * 창작자 제출물 등록
 *
 * Supabase REST:
 *   POST /rest/v1/project_submissions
 *   Content-Type: application/json
 *   Prefer: return=representation
 *
 * 필수 body 필드:
 *   project_id          number — projects.id (FK)
 *   freelancer_id       number — freelancers.id (FK) ⚠️ 실 인증 후 로그인 유저 ID로 교체
 *   portfolio_file_url  string — 제출 파일 URL (Supabase Storage 업로드 후 URL)
 *
 * 선택 body 필드:
 *   tone_and_manner         string | null — 톤앤매너 설명
 *   color_system_rationale  string | null — 색채 시스템 근거
 *   layout_rationale        string | null — 레이아웃 설명
 *   additional_description  string | null — 추가 설명
 *   is_selected             boolean       — 당선 여부 (기본 false)
 *
 * 응답: { id: number } — 생성된 project_submissions.id
 *
 * RLS 조건: 해당 project_id에 project_applicants 행이 있는 freelancer만 INSERT 가능하도록 설정 권장
 */
export async function insertSubmission(
  input: SubmissionsInsert
): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("project_submissions")
    .insert(input)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

// ─── Winner Selection (선정) ──────────────────────────────────────────────────

/**
 * 당선자 선정 (기존 선정 초기화 후 1명 선정)
 *
 * 내부적으로 2번의 PATCH 요청을 순서대로 실행한다.
 *
 * 1단계 — 해당 공모전 전체 선정 초기화:
 *   PATCH /rest/v1/project_submissions
 *     ?project_id=eq.{projectId}
 *   body: { "is_selected": false }
 *
 * 2단계 — 특정 제출물 당선 처리:
 *   PATCH /rest/v1/project_submissions
 *     ?id=eq.{submissionId}
 *   body: { "is_selected": true }
 *
 * 파라미터:
 *   submissionId: number — 당선시킬 project_submissions.id
 *   projectId:    number — 해당 공모전 projects.id (1단계 초기화 범위 지정용)
 *
 * 응답: void
 *
 * RLS 조건: 해당 project의 client_id 소유자만 UPDATE 가능하도록 설정 권장
 * ⚠️  트랜잭션이 아니므로 1단계 성공 + 2단계 실패 시 모두 is_selected=false 상태가 될 수 있음
 *     → 추후 Supabase Edge Function 또는 DB Function(RPC)으로 원자성 보장 권장
 */
export async function selectWinner(
  submissionId: number,
  projectId: number
): Promise<void> {
  const supabase = createClient();

  // 1단계: 해당 공모전의 기존 선정 전체 초기화
  const { error: resetError } = await supabase
    .from("project_submissions")
    .update({ is_selected: false })
    .eq("project_id", projectId);
  if (resetError) throw resetError;

  // 2단계: 새 당선작 선정
  const { error } = await supabase
    .from("project_submissions")
    .update({ is_selected: true })
    .eq("id", submissionId);
  if (error) throw error;
}
