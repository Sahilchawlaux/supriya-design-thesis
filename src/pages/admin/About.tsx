import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Upload, Trash2, Loader2 } from "lucide-react";
import {
  useAboutContent,
  useCreateAboutContent,
  useUpdateAboutContent,
} from "@/hooks/useAboutContent";

// Mock initial data
const initialAboutData = {
  heading: "About The Design Thesis",
  tagline: "Creating Elegant Digital Stationery For Your Special Moments",
  mainContent: `The Design Thesis was founded by Supriya Malik in 2019 with a vision to create beautiful, sustainable digital invitations and stationery that don't compromise on elegance or style. 

With over 10 years of experience in graphic design and a passion for creating memorable keepsakes, Supriya's work combines traditional artistic elements with modern digital convenience.

Our designs have been featured in several wedding publications and blogs, and we've helped hundreds of couples and event planners create stunning digital stationery for their special occasions.`,
  founderImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  founderName: "Supriya Malik",
  founderTitle: "Founder & Creative Director",
  founderBio: "Supriya has a background in fine arts and graphic design, with a special interest in typography and traditional illustration techniques. Before founding The Design Thesis, she worked with several high-end stationery brands and event planning companies.",
  teamMembers: [
    {
      id: "1",
      name: "Maya Patel",
      title: "Senior Designer",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      bio: "Maya specializes in watercolor illustrations and hand-lettering, bringing a delicate touch to our most romantic designs.",
    },
    {
      id: "2",
      name: "James Wilson",
      title: "Digital Products Manager",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
      bio: "James ensures that all our digital products are user-friendly and function flawlessly across all devices and platforms.",
    },
  ],
};

interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
}

interface AboutData {
  heading: string;
  tagline: string;
  mainContent: string;
  founderImage: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  teamMembers: TeamMember[];
}

const AdminAbout = () => {
  const { data: aboutContent, isLoading, error } = useAboutContent();
  const createAboutContent = useCreateAboutContent();
  const updateAboutContent = useUpdateAboutContent();

  const [aboutData, setAboutData] = useState<AboutData>(initialAboutData);
  const [loading, setLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Omit<TeamMember, "id">>({
    name: "",
    title: "",
    image: "",
    bio: "",
  });

  useEffect(() => {
    // Initialize from DB or create default content
    if (!aboutContent && !isLoading && !error) {
      createAboutContent
        .mutateAsync({ ...initialAboutData })
        .then(() => {
          // Will refetch via react-query on success
        })
        .catch((e) => {
          console.error("Failed to create initial about content:", e);
          if ((e as any).message?.includes("PGRST205")) {
            toast.error("Database table not found. Please create the about_content table in Supabase.");
          }
        });
      return;
    }

    if (aboutContent) {
      setAboutData({
        heading: aboutContent.heading,
        tagline: aboutContent.tagline,
        mainContent: aboutContent.mainContent,
        founderImage: aboutContent.founderImage,
        founderName: aboutContent.founderName,
        founderTitle: aboutContent.founderTitle,
        founderBio: aboutContent.founderBio,
        teamMembers: aboutContent.teamMembers || [],
      });
    }
  }, [aboutContent, isLoading, error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutData({
      ...aboutData,
      [name]: value,
    });
  };

  const handleNewMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMember({
      ...newMember,
      [name]: value,
    });
  };

  const handleEditMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingMember) return;

    const { name, value } = e.target;
    setEditingMember({
      ...editingMember,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      if (aboutContent && (aboutContent as any).id) {
        await updateAboutContent.mutateAsync({
          id: (aboutContent as any).id,
          updates: {
            heading: aboutData.heading,
            tagline: aboutData.tagline,
            mainContent: aboutData.mainContent,
            founderImage: aboutData.founderImage,
            founderName: aboutData.founderName,
            founderTitle: aboutData.founderTitle,
            founderBio: aboutData.founderBio,
            teamMembers: aboutData.teamMembers,
          },
        });
      } else {
        await createAboutContent.mutateAsync({
          heading: aboutData.heading,
          tagline: aboutData.tagline,
          mainContent: aboutData.mainContent,
          founderImage: aboutData.founderImage,
          founderName: aboutData.founderName,
          founderTitle: aboutData.founderTitle,
          founderBio: aboutData.founderBio,
          teamMembers: aboutData.teamMembers,
        });
      }
      toast.success("About page content updated successfully!");
    } catch (e) {
      console.error("Error saving about content:", e);
      toast.error("Failed to save About content");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = () => {
    if (!newMember.name || !newMember.title || !newMember.image || !newMember.bio) {
      toast.error("Please fill in all fields for the new team member");
      return;
    }

    const newTeamMember: TeamMember = {
      id: Date.now().toString(),
      ...newMember,
    };

    setAboutData({
      ...aboutData,
      teamMembers: [...aboutData.teamMembers, newTeamMember],
    });

    setNewMember({
      name: "",
      title: "",
      image: "",
      bio: "",
    });

    setShowAddMember(false);
    toast.success("Team member added successfully!");
  };

  const handleSaveEditMember = () => {
    if (!editingMember) return;

    setAboutData({
      ...aboutData,
      teamMembers: aboutData.teamMembers.map((member) =>
        member.id === editingMember.id ? editingMember : member
      ),
    });

    setEditingMember(null);
    toast.success("Team member updated successfully!");
  };

  const handleDeleteTeamMember = (id: string) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
      setAboutData({
        ...aboutData,
        teamMembers: aboutData.teamMembers.filter((member) => member.id !== id),
      });

      toast.success("Team member deleted successfully!");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Edit About Page</h1>
        <Button
          className="bg-gold hover:bg-gold-dark text-white"
          onClick={handleSaveChanges}
          disabled={loading || updateAboutContent.isPending || createAboutContent.isPending}
        >
          {loading || updateAboutContent.isPending || createAboutContent.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save size={18} className="mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Main Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heading">Page Heading</Label>
            <Input
              id="heading"
              name="heading"
              value={aboutData.heading}
              onChange={handleInputChange}
              placeholder="Main heading for the page"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              value={aboutData.tagline}
              onChange={handleInputChange}
              placeholder="A brief tagline or subtitle"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mainContent">Main Content</Label>
            <Textarea
              id="mainContent"
              name="mainContent"
              value={aboutData.mainContent}
              onChange={handleInputChange}
              placeholder="About page main content"
              rows={8}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Founder Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="founderName">Founder Name</Label>
              <Input
                id="founderName"
                name="founderName"
                value={aboutData.founderName}
                onChange={handleInputChange}
                placeholder="Founder's name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="founderTitle">Founder Title</Label>
              <Input
                id="founderTitle"
                name="founderTitle"
                value={aboutData.founderTitle}
                onChange={handleInputChange}
                placeholder="Founder's title"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="founderImage">Founder Image URL</Label>
            <Input
              id="founderImage"
              name="founderImage"
              value={aboutData.founderImage}
              onChange={handleInputChange}
              placeholder="URL to founder's image"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="founderBio">Founder Bio</Label>
            <Textarea
              id="founderBio"
              name="founderBio"
              value={aboutData.founderBio}
              onChange={handleInputChange}
              placeholder="Brief biography of the founder"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            Team Members
            <Button 
              variant="outline" 
              onClick={() => setShowAddMember(!showAddMember)}
            >
              {showAddMember ? "Cancel" : "Add Team Member"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddMember && (
            <div className="border rounded-md p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Add New Team Member</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newMember.name}
                      onChange={handleNewMemberChange}
                      placeholder="Team member's name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newMember.title}
                      onChange={handleNewMemberChange}
                      placeholder="Team member's title"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={newMember.image}
                    onChange={handleNewMemberChange}
                    placeholder="URL to team member's image"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={newMember.bio}
                    onChange={handleNewMemberChange}
                    placeholder="Brief biography of the team member"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-gold hover:bg-gold-dark text-white" 
                    onClick={handleAddTeamMember}
                  >
                    Add Team Member
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {editingMember && (
            <div className="border rounded-md p-6 mb-6">
              <h3 className="text-lg font-medium mb-4">Edit Team Member</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={editingMember.name}
                      onChange={handleEditMemberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      name="title"
                      value={editingMember.title}
                      onChange={handleEditMemberChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    name="image"
                    value={editingMember.image}
                    onChange={handleEditMemberChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-bio">Bio</Label>
                  <Textarea
                    id="edit-bio"
                    name="bio"
                    value={editingMember.bio}
                    onChange={handleEditMemberChange}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingMember(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gold hover:bg-gold-dark text-white" 
                    onClick={handleSaveEditMember}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {aboutData.teamMembers.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No team members added yet.</p>
            ) : (
              aboutData.teamMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-start justify-between p-4 border rounded-md"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{member.name}</h3>
                      <p className="text-muted-foreground">{member.title}</p>
                      <p className="text-sm mt-1">{member.bio}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingMember(member)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteTeamMember(member.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAbout;
