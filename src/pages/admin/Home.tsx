
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Save, Trash2, Plus } from "lucide-react";

// Mock initial data
const initialHomeData = {
  heroHeading: "Welcome to The Design Thesis",
  heroSubheading: "Bespoke Digital Invitations & Stationery for Life's Special Moments",
  heroCta: "Explore Collections",
  heroImage: "https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  
  // Featured section
  featuredHeading: "Featured Collections",
  featuredSubheading: "Discover our most popular digital designs",
  featuredItems: [
    {
      id: "1",
      title: "Elegant Botanicals",
      image: "https://images.unsplash.com/photo-1601158935942-52255782d322?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/collections/elegant-botanicals"
    },
    {
      id: "2",
      title: "Modern Minimalist",
      image: "https://images.unsplash.com/photo-1544070078-a212eda27b49?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/collections/modern-minimalist"
    },
    {
      id: "3",
      title: "Rustic Charm",
      image: "https://images.unsplash.com/photo-1541250848049-f6233dcca4a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      link: "/collections/rustic-charm"
    }
  ],
  
  // About section
  aboutHeading: "About The Design Thesis",
  aboutContent: "Founded by Supriya Malik, The Design Thesis creates beautiful, customizable digital invitations and stationery for weddings, parties, and special events. Our sustainable digital approach means you can have elegant designs without the environmental impact of traditional paper stationery.",
  aboutImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  aboutCta: "Learn More",
};

interface FeaturedItem {
  id: string;
  title: string;
  image: string;
  link: string;
}

interface HomeData {
  heroHeading: string;
  heroSubheading: string;
  heroCta: string;
  heroImage: string;
  featuredHeading: string;
  featuredSubheading: string;
  featuredItems: FeaturedItem[];
  aboutHeading: string;
  aboutContent: string;
  aboutImage: string;
  aboutCta: string;
}

const AdminHome = () => {
  const [homeData, setHomeData] = useState<HomeData>(initialHomeData);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<FeaturedItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<FeaturedItem, 'id'>>({
    title: "",
    image: "",
    link: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHomeData({
      ...homeData,
      [name]: value
    });
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: value
    });
  };

  const handleEditItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingItem) return;
    
    const { name, value } = e.target;
    setEditingItem({
      ...editingItem,
      [name]: value
    });
  };

  const handleSaveChanges = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Home page content updated successfully!");
    }, 1000);
  };

  const handleAddFeaturedItem = () => {
    if (!newItem.title || !newItem.image || !newItem.link) {
      toast.error("Please fill in all fields for the new featured item");
      return;
    }

    const newFeaturedItem: FeaturedItem = {
      id: Date.now().toString(),
      ...newItem
    };

    setHomeData({
      ...homeData,
      featuredItems: [...homeData.featuredItems, newFeaturedItem]
    });

    setNewItem({
      title: "",
      image: "",
      link: ""
    });

    toast.success("Featured item added successfully!");
  };

  const handleSaveEditItem = () => {
    if (!editingItem) return;
    
    setHomeData({
      ...homeData,
      featuredItems: homeData.featuredItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      )
    });
    
    setEditingItem(null);
    toast.success("Featured item updated successfully!");
  };

  const handleDeleteFeaturedItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this featured item?")) {
      setHomeData({
        ...homeData,
        featuredItems: homeData.featuredItems.filter(item => item.id !== id)
      });
      
      toast.success("Featured item deleted successfully!");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif">Edit Home Page</h1>
        <Button 
          className="bg-gold hover:bg-gold-dark text-white"
          onClick={handleSaveChanges}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={18} className="mr-2" />}
          Save Changes
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="heroHeading">Hero Heading</Label>
            <Input
              id="heroHeading"
              name="heroHeading"
              value={homeData.heroHeading}
              onChange={handleInputChange}
              placeholder="Main heading for the hero section"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heroSubheading">Hero Subheading</Label>
            <Input
              id="heroSubheading"
              name="heroSubheading"
              value={homeData.heroSubheading}
              onChange={handleInputChange}
              placeholder="Subtitle for the hero section"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heroCta">Call to Action Text</Label>
            <Input
              id="heroCta"
              name="heroCta"
              value={homeData.heroCta}
              onChange={handleInputChange}
              placeholder="Button text for call to action"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="heroImage">Hero Image URL</Label>
            <Input
              id="heroImage"
              name="heroImage"
              value={homeData.heroImage}
              onChange={handleInputChange}
              placeholder="URL to hero section background image"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Featured Collections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="featuredHeading">Section Heading</Label>
              <Input
                id="featuredHeading"
                name="featuredHeading"
                value={homeData.featuredHeading}
                onChange={handleInputChange}
                placeholder="Heading for featured collections"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="featuredSubheading">Section Subheading</Label>
              <Input
                id="featuredSubheading"
                name="featuredSubheading"
                value={homeData.featuredSubheading}
                onChange={handleInputChange}
                placeholder="Subheading for featured collections"
              />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Featured Items</h3>
            
            <div className="space-y-6">
              {homeData.featuredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex flex-col md:flex-row items-start justify-between p-4 border rounded-md gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-xs text-muted-foreground break-all">{item.link}</p>
                    </div>
                  </div>
                  
                  {editingItem && editingItem.id === item.id ? (
                    <div className="w-full md:w-auto">
                      <div className="space-y-3 mb-3">
                        <div className="space-y-1">
                          <Label htmlFor={`edit-title-${item.id}`}>Title</Label>
                          <Input
                            id={`edit-title-${item.id}`}
                            name="title"
                            value={editingItem.title}
                            onChange={handleEditItemChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`edit-image-${item.id}`}>Image URL</Label>
                          <Input
                            id={`edit-image-${item.id}`}
                            name="image"
                            value={editingItem.image}
                            onChange={handleEditItemChange}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`edit-link-${item.id}`}>Link</Label>
                          <Input
                            id={`edit-link-${item.id}`}
                            name="link"
                            value={editingItem.link}
                            onChange={handleEditItemChange}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingItem(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gold hover:bg-gold-dark text-white"
                          onClick={handleSaveEditItem}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteFeaturedItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 border rounded-md">
              <h4 className="font-medium mb-4">Add New Featured Item</h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-title">Title</Label>
                    <Input
                      id="new-title"
                      name="title"
                      value={newItem.title}
                      onChange={handleNewItemChange}
                      placeholder="Item title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-image">Image URL</Label>
                    <Input
                      id="new-image"
                      name="image"
                      value={newItem.image}
                      onChange={handleNewItemChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-link">Link</Label>
                    <Input
                      id="new-link"
                      name="link"
                      value={newItem.link}
                      onChange={handleNewItemChange}
                      placeholder="/collections/item-slug"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAddFeaturedItem}
                    className="bg-gold hover:bg-gold-dark text-white"
                  >
                    <Plus size={16} className="mr-2" /> Add Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>About Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aboutHeading">About Heading</Label>
            <Input
              id="aboutHeading"
              name="aboutHeading"
              value={homeData.aboutHeading}
              onChange={handleInputChange}
              placeholder="Heading for about section"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aboutContent">About Content</Label>
            <Textarea
              id="aboutContent"
              name="aboutContent"
              value={homeData.aboutContent}
              onChange={handleInputChange}
              placeholder="Brief content for homepage about section"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="aboutImage">About Image URL</Label>
              <Input
                id="aboutImage"
                name="aboutImage"
                value={homeData.aboutImage}
                onChange={handleInputChange}
                placeholder="URL to image for about section"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="aboutCta">About CTA Text</Label>
              <Input
                id="aboutCta"
                name="aboutCta"
                value={homeData.aboutCta}
                onChange={handleInputChange}
                placeholder="Button text for about section"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
