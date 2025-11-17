import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useTestimonials = () => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching testimonials:", error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error("Error in useTestimonials:", err);
        return [];
      }
    },
    initialData: [],
  });
};
