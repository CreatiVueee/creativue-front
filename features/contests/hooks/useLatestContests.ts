import { useQuery } from "@tanstack/react-query";
import { fetchProjects, adaptProjectToContest } from "@/shared/lib/supabase/queries";
import type { Contest } from "@/shared/types";

export function useLatestContests() {
  return useQuery<Contest[]>({
    queryKey: ["contests", "latest"],
    queryFn: async () => {
      const projects = await fetchProjects();
      return projects.slice(0, 6).map(adaptProjectToContest);
    },
  });
}
