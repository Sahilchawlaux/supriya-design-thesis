import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseAdmin } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define types locally to avoid coupling to generated Database types that may not yet include about_content
export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
};

export type AboutContent = {
  id: string;
  heading: string;
  tagline: string;
  mainContent: string;
  founderImage: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  teamMembers: TeamMember[];
  created_at?: string;
};

export type AboutContentInsert = Omit<AboutContent, "id">;
export type AboutContentUpdate = Partial<Omit<AboutContent, "id">>;

export const useAboutContent = () => {
  return useQuery<AboutContent | null>({
    queryKey: ["about-content"],
    queryFn: async () => {
      const { data, error } = await (supabaseAdmin as any)
        .from("about_content")
        .select("*")
        .single();

      if (error) {
        console.error("Error fetching about content:", error);
        if ((error as any).code === "PGRST116") {
          console.log("No about content found, will need to create initial content");
          return null;
        }
        throw error;
      }

      // Map column names if stored as snake_case in DB
      const mapped: AboutContent = {
        id: (data as any).id,
        heading: (data as any).heading,
        tagline: (data as any).tagline,
        mainContent: (data as any).main_content ?? (data as any).mainContent,
        founderImage: (data as any).founder_image ?? (data as any).founderImage,
        founderName: (data as any).founder_name ?? (data as any).founderName,
        founderTitle: (data as any).founder_title ?? (data as any).founderTitle,
        founderBio: (data as any).founder_bio ?? (data as any).founderBio,
        teamMembers: (data as any).team_members ?? (data as any).teamMembers ?? [],
        created_at: (data as any).created_at,
      };

      return mapped;
    },
    retry: false,
  });
};

export const useCreateAboutContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: AboutContentInsert) => {
      // Convert to snake_case payload for DB
      const payload = {
        heading: content.heading,
        tagline: content.tagline,
        main_content: content.mainContent,
        founder_image: content.founderImage,
        founder_name: content.founderName,
        founder_title: content.founderTitle,
        founder_bio: content.founderBio,
        team_members: content.teamMembers,
      } as const;

      const { data, error } = await (supabaseAdmin as any)
        .from("about_content")
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error("Error creating about content:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
      queryClient.refetchQueries({ queryKey: ["about-content"] });
      toast.success("About content created successfully!");
    },
    onError: (error) => {
      console.error("Error creating about content:", error);
      toast.error("Failed to create about content");
    },
  });
};

export const useUpdateAboutContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: AboutContentUpdate;
    }) => {
      const payload: Record<string, any> = {};
      if (updates.heading !== undefined) payload.heading = updates.heading;
      if (updates.tagline !== undefined) payload.tagline = updates.tagline;
      if (updates.mainContent !== undefined) payload.main_content = updates.mainContent;
      if (updates.founderImage !== undefined) payload.founder_image = updates.founderImage;
      if (updates.founderName !== undefined) payload.founder_name = updates.founderName;
      if (updates.founderTitle !== undefined) payload.founder_title = updates.founderTitle;
      if (updates.founderBio !== undefined) payload.founder_bio = updates.founderBio;
      if (updates.teamMembers !== undefined) payload.team_members = updates.teamMembers;

      const { data, error } = await (supabaseAdmin as any)
        .from("about_content")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating about content:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-content"] });
      queryClient.refetchQueries({ queryKey: ["about-content"] });
      toast.success("About content updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating about content:", error);
      toast.error("Failed to update about content");
    },
  });
};
