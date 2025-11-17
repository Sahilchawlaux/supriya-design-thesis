import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
};

export type PublicAboutContent = {
  id: string;
  heading: string;
  tagline: string;
  mainContent: string;
  founderImage: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  teamMembers: TeamMember[];
};

export const usePublicAboutContent = () => {
  return useQuery<PublicAboutContent | null>({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('about_content')
        .select('*')
        .single();

      if (error) {
        console.error('Public: Error fetching about content:', error);
        if ((error as any).code === 'PGRST116') {
          console.log('Public: No about content found, using default content');
          return null;
        }
        return null;
      }

      const mapped: PublicAboutContent = {
        id: (data as any).id,
        heading: (data as any).heading,
        tagline: (data as any).tagline,
        mainContent: (data as any).main_content ?? (data as any).mainContent,
        founderImage: (data as any).founder_image ?? (data as any).founderImage,
        founderName: (data as any).founder_name ?? (data as any).founderName,
        founderTitle: (data as any).founder_title ?? (data as any).founderTitle,
        founderBio: (data as any).founder_bio ?? (data as any).founderBio,
        teamMembers: (data as any).team_members ?? (data as any).teamMembers ?? [],
      };

      return mapped;
    },
    staleTime: 0,
  });
};
