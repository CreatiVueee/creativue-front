import { useQuery } from "@tanstack/react-query";
import { contests } from "@/data/contests";
import type { Contest } from "@/shared/types";

// ⏳ 나중에: Supabase `contests` 테이블 쿼리로 교체
async function fetchLatestContests(): Promise<Contest[]> {
  return contests.slice(0, 6);
}

export function useLatestContests() {
  return useQuery({
    queryKey: ["contests", "latest"],
    queryFn: fetchLatestContests,
  });
}
