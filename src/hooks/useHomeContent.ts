import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type HomeContent = Database["public"]["Tables"]["home_content"]["Row"];
type HomeContentInsert = Database["public"]["Tables"]["home_content"]["Insert"];
type HomeContentUpdate = Database["public"]["Tables"]["home_content"]["Update"];

export const useHomeContent = () => {
  return useQuery({
    queryKey: ["home-content"],
    queryFn: async () => {
      const { data, error } = await supabaseAdmin
        .from("home_content")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching home content:", error);
        // If no rows found, return null instead of throwing error
        if (error.code === "PGRST116") {
          console.log(
            "No home content found, will need to create initial content"
          );
          return null;
        }
        throw error;
      }

      return data as HomeContent;
    },
    retry: false, // Don't retry on error
  });
};

export const useCreateHomeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: HomeContentInsert) => {
      console.log("Creating home content with data:", content);
      const { data, error } = await supabaseAdmin
        .from("home_content")
        .insert(content)
        .select()
        .single();

      if (error) {
        console.error("Error creating home content:", error);
        throw error;
      }

      console.log("Home content created successfully:", data);
      return data as HomeContent;
    },
    onSuccess: (data) => {
      console.log("Create success, invalidating queries...");
      // Invalidate and refetch to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["home-content"] });
      queryClient.refetchQueries({ queryKey: ["home-content"] });
    },
    onError: (error) => {
      console.error("Error creating home content:", error);
      toast.error("Failed to create initial content");
    },
  });
};

export const useUpdateHomeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: HomeContentUpdate;
    }) => {
      const { data, error } = await supabaseAdmin
        .from("home_content")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating home content:", error);
        throw error;
      }

      return data as HomeContent;
    },
    onSuccess: () => {
      // Invalidate all queries with the home-content key to refresh both admin and public views
      queryClient.invalidateQueries({ queryKey: ["home-content"] });
      // Also refetch immediately to ensure fresh data
      queryClient.refetchQueries({ queryKey: ["home-content"] });
      toast.success("Home content updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating home content:", error);
      toast.error("Failed to update home content");
    },
  });
};
