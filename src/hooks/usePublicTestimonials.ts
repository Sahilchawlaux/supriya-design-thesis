import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePublicTestimonials = () => {
  return useQuery({
    queryKey: ["public_testimonials"],
    queryFn: async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("testimonials")
          .select("*")
          .eq("is_approved", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching public testimonials:", error);
          return [] as any[];
        }

        return (data || []) as any[];
      } catch (err) {
        console.error("Error in usePublicTestimonials:", err);
        return [] as any[];
      }
    },
    initialData: [] as any[],
  });
};
