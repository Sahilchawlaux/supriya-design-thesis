
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePortfolioItems = () => {
  return useQuery({
    queryKey: ['portfolio-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
};
