import { createClient } from "./client";
import type { Database } from "@/data/supabase";
import type { Contest } from "@/shared/types";

// ─── Row Types ────────────────────────────────────────────────────────────────

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type BrandRow = Database["public"]["Tables"]["brands"]["Row"];

export type BrandsInsert = Database["public"]["Tables"]["brands"]["Insert"];
export type ProjectsInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type SubmissionsInsert =
  Database["public"]["Tables"]["project_submissions"]["Insert"];

export type ProjectWithBrand = ProjectRow & { brands: BrandRow };
export type SubmissionWithFreelancer =
  Database["public"]["Tables"]["project_submissions"]["Row"] & {
    freelancers: Database["public"]["Tables"]["freelancers"]["Row"];
  };

// ─── Adapter: DB Row → UI Contest type ───────────────────────────────────────

export function adaptProjectToContest(p: ProjectWithBrand): Contest {
  const b = p.brands;
  return {
    id: p.id,
    brand: b.brand_name,
    industry: b.industries[0] ?? "",
    contentTypes: p.content_categories,
    deadline: p.deadline_date,
    prize: p.reward_amount,
    applicants: 0, // ⏳ 나중에: project_applicants COUNT 쿼리로 교체
    hot: false,    // DB에 hot 필드 없음
    aiAllowed: p.is_ai_allowed,
    image: b.brand_image,
    brandImages: b.logo_file_url ?? [],
    categoryId: (p.content_categories[0] ?? "").toLowerCase(),
    brandIdentity: b.brand_identity,
    brandStory: b.brand_story,
    brandKeywords: b.brand_core_keywords,
    brandColors: [], // DB에 없음
    targetConsumer: {
      ageRange: b.target_ages?.join(", ") ?? "",
      gender: b.target_gender ?? "",
      occupation: b.target_jobs ?? "",
      interests: b.target_interests ?? [],
      region: b.target_region?.join(", ") ?? "",
    },
    product: {
      priceRange: p.price_range,
      differentiation: p.differentiation_point,
      additionalInfo: p.additional_info ?? "",
    },
    additionalRequests: b.extra_notes ?? "",
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function fetchProjects(): Promise<ProjectWithBrand[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*, brands(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProjectWithBrand[];
}

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

export async function insertProjectApplicant(
  projectId: number,
  freelancerId: number
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("project_applicants").insert({
    project_id: projectId,
    freelancer_id: freelancerId,
    applied_at: new Date().toISOString(),
  });
  if (error) throw error;
}

// ─── Project Submissions (창작자 제출) ─────────────────────────────────────────

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

export async function selectWinner(
  submissionId: number,
  projectId: number
): Promise<void> {
  const supabase = createClient();
  // 해당 공모전의 기존 선정 초기화
  const { error: resetError } = await supabase
    .from("project_submissions")
    .update({ is_selected: false })
    .eq("project_id", projectId);
  if (resetError) throw resetError;
  // 새 당선작 선정
  const { error } = await supabase
    .from("project_submissions")
    .update({ is_selected: true })
    .eq("id", submissionId);
  if (error) throw error;
}
