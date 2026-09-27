import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "@/shared/lib/supabase/queries";
import type { BannerRow } from "@/shared/lib/supabase/queries";

export function useBanners() {
  return useQuery<BannerRow[]>({
    queryKey: ["banners"],
    queryFn: async () => {
      return await fetchBanners();
    },
  });
}
