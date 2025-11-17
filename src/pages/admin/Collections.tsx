
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Image, Loader2 } from "lucide-react";
import { supabase, supabaseAdmin } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];

// Predefined category structure
const CATEGORY_STRUCTURE = {
  "Wedding": [
    "Invitations",
    "Save the Date",
    "Thank You Cards",
    "Menu Cards",
    "Programs",
    "Place Cards"
  ],
  "Corporate": [
    "Business Cards",
    "Letterheads",
    "Brochures",
    "Presentations",
    "Annual Reports",
    "Event Materials"
  ],
  "Personal": [
    "Birthday Invitations",
    "Anniversary Cards",
    "Holiday Cards",
    "Graduation",
    "Baby Shower",
    "Personal Stationery"
  ],
  "Digital": [
    "Social Media Graphics",
    "Email Templates",
    "Web Banners",
    "Digital Invitations",
    "Instagram Stories",
    "Logo Design"
  ]
};

interface Collection extends PortfolioItem {
  mainCategory?: string;
  subCategory?: string;
}

const AdminCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    mainCategory: "",
    subCategory: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabaseAdmin
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const collectionsWithCategories = data?.map(item => {
        const [mainCategory, subCategory] = item.category.split(' > ');
        return {
          ...item,
          mainCategory: mainCategory || item.category,
          subCategory: subCategory || ''
        };
      }) || [];
      
      setCollections(collectionsWithCategories);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      mainCategory: "",
      subCategory: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCollection = async () => {
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.image || !formData.mainCategory || !formData.subCategory) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const category = `${formData.mainCategory} > ${formData.subCategory}`;
      
      const { data, error } = await supabaseAdmin
        .from('portfolio_items')
        .insert({
          title: formData.title,
          description: formData.description,
          image: formData.image,
          category: category
        })
        .select()
        .single();

      if (error) throw error;

      await fetchCollections();
      resetFormData();
      toast.success("Collection added successfully!");
    } catch (error) {
      console.error('Error adding collection:', error);
      toast.error('Failed to add collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      title: collection.title,
      description: collection.description,
      image: collection.image,
      mainCategory: collection.mainCategory || '',
      subCategory: collection.subCategory || ''
    });
  };

  const handleUpdateCollection = async () => {
    if (!editingCollection) return;
    setIsSubmitting(true);

    // Validate form data
    if (!formData.title || !formData.description || !formData.image || !formData.mainCategory || !formData.subCategory) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const category = `${formData.mainCategory} > ${formData.subCategory}`;
      
      const { error } = await supabaseAdmin
        .from('portfolio_items')
        .update({
          title: formData.title,
          description: formData.description,
          image: formData.image,
          category: category
        })
        .eq('id', editingCollection.id);

      if (error) throw error;

      await fetchCollections();
      setEditingCollection(null);
      resetFormData();
      toast.success("Collection updated successfully!");
    } catch (error) {
      console.error('Error updating collection:', error);
      toast.error('Failed to update collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        const { error } = await supabaseAdmin
          .from('portfolio_items')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchCollections();
        toast.success("Collection deleted successfully!");
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Failed to delete collection');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Manage Collections</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <Plus size={18} className="mr-2" /> Add New Collection
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Collection</DialogTitle>
              <DialogDescription>
                Create a new collection to showcase in your digital store.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Collection title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the collection"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mainCategory">Main Category</Label>
                  <Select
                    value={formData.mainCategory}
                    onValueChange={(value) => setFormData({ ...formData, mainCategory: value, subCategory: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select main category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(CATEGORY_STRUCTURE).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="subCategory">Subcategory</Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
                    disabled={!formData.mainCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.mainCategory && CATEGORY_STRUCTURE[formData.mainCategory as keyof typeof CATEGORY_STRUCTURE]?.map((subCategory) => (
                        <SelectItem key={subCategory} value={subCategory}>
                          {subCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleAddCollection}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Collection
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.length === 0 ? (
            <p className="col-span-full text-center py-12 text-muted-foreground">
              No collections found. Add your first collection to get started.
            </p>
          ) : (
            collections.map((collection) => (
            <Card key={collection.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative">
                  <img 
                    src={collection.image} 
                    alt={collection.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl mb-2">{collection.title}</CardTitle>
                <p className="text-sm text-muted-foreground mb-2">{collection.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {collection.mainCategory}
                  </span>
                  <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                    {collection.subCategory}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditCollection(collection)}
                    >
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Collection</DialogTitle>
                      <DialogDescription>
                        Make changes to the collection details below.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title</Label>
                        <Input
                          id="edit-title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="edit-image">Image URL</Label>
                        <Input
                          id="edit-image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="edit-mainCategory">Main Category</Label>
                          <Select
                            value={formData.mainCategory}
                            onValueChange={(value) => setFormData({ ...formData, mainCategory: value, subCategory: "" })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select main category" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(CATEGORY_STRUCTURE).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-subCategory">Subcategory</Label>
                          <Select
                            value={formData.subCategory}
                            onValueChange={(value) => setFormData({ ...formData, subCategory: value })}
                            disabled={!formData.mainCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                              {formData.mainCategory && CATEGORY_STRUCTURE[formData.mainCategory as keyof typeof CATEGORY_STRUCTURE]?.map((subCategory) => (
                                <SelectItem key={subCategory} value={subCategory}>
                                  {subCategory}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        className="bg-gold hover:bg-gold-dark text-white" 
                        onClick={handleUpdateCollection}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteCollection(collection.id)}
                >
                  <Trash2 size={16} className="mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
