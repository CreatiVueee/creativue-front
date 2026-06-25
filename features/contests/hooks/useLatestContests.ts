import { useQuery } from "@tanstack/react-query";
// import { fetchProjects } from "@/shared/lib/supabase/queries";
import { adaptProjectToContest } from "@/shared/lib/supabase/queries";
import { projectsDB } from "@/data/contestsDB";
import type { Contest } from "@/shared/types";

export function useLatestContests() {
  return useQuery<Contest[]>({
    queryKey: ["contests", "latest"],
    queryFn: async () => {
      // ⏳ DB 연동 시 아래 주석 해제 후 더미 데이터 제거
      // const projects = await fetchProjects();
      // return projects.slice(0, 6).map(adaptProjectToContest);
      return projectsDB.slice(0, 6).map(adaptProjectToContest);
    },
  });
}
