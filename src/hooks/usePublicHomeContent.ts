import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type HomeContent = Database['public']['Tables']['home_content']['Row'];

export const usePublicHomeContent = () => {
  return useQuery({
    queryKey: ['home-content'], // Use same key as admin hook for proper invalidation
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .single();
      
      if (error) {
        console.error('Public: Error fetching home content:', error);
        // If no rows found, return null (will use default content)
        if (error.code === 'PGRST116') {
          console.log('Public: No home content found, using default content');
          return null;
        }
        // Return null for other errors too, will fallback to default
        return null;
      }
      
      return data as HomeContent;
    },
    staleTime: 0, // Always refetch to get latest data
    refetchOnWindowFocus: true, // Refetch when window gains focus
    retry: false, // Don't retry on error
  });
};
