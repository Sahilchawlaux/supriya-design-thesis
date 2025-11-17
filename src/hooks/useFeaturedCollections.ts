
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: ['featured-collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};
