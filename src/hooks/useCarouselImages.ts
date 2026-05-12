import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type CarouselImage = Database["public"]["Tables"]["home_carousel_images"]["Row"];
type CarouselImageInsert = Database["public"]["Tables"]["home_carousel_images"]["Insert"];

export const useCarouselImages = () => {
  return useQuery({
    queryKey: ["home-carousel-images"],
    queryFn: async () => {
      const { data, error } = await supabaseAdmin
        .from("home_carousel_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching carousel images:", error);
        throw error;
      }

      return data as CarouselImage[];
    },
  });
};

export const useAddCarouselImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (image: CarouselImageInsert) => {
      const { data, error } = await supabaseAdmin
        .from("home_carousel_images")
        .insert(image)
        .select()
        .single();

      if (error) {
        console.error("Error adding carousel image:", error);
        throw error;
      }

      return data as CarouselImage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-carousel-images"] });
      toast.success("Image added to carousel");
    },
    onError: (error) => {
      console.error("Error adding carousel image:", error);
      toast.error("Failed to add image");
    },
  });
};

export const useDeleteCarouselImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseAdmin
        .from("home_carousel_images")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting carousel image:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-carousel-images"] });
      toast.success("Image removed from carousel");
    },
    onError: (error) => {
      console.error("Error deleting carousel image:", error);
      toast.error("Failed to remove image");
    },
  });
};
