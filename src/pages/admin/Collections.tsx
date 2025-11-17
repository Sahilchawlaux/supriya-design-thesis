
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Image, Loader2 } from "lucide-react";

// Mock collection data
const initialCollections = [
  {
    id: "1",
    title: "Elegant Florals",
    description: "Romantic floral invitation designs with delicate illustration",
    image: "https://images.unsplash.com/photo-1600164318544-79e55da1ac8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 39.99,
    category: "Floral"
  },
  {
    id: "2",
    title: "Modern Minimalist",
    description: "Clean, contemporary designs with stylish typography",
    image: "https://images.unsplash.com/photo-1561587327-95cca85ec13b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 34.99,
    category: "Minimalist"
  },
  {
    id: "3",
    title: "Rustic Charm",
    description: "Warm, natural designs with a handcrafted feel",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 29.99,
    category: "Rustic"
  }
];

interface Collection {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

const AdminCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    price: "",
    category: ""
  });

  useEffect(() => {
    // Simulate fetching collections from API
    setTimeout(() => {
      setCollections(initialCollections);
    }, 500);
  }, []);

  const resetFormData = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      price: "",
      category: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCollection = () => {
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.image || !formData.price || !formData.category) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // Create new collection object
    const newCollection: Collection = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      image: formData.image,
      price: parseFloat(formData.price),
      category: formData.category
    };

    // Simulate API call
    setTimeout(() => {
      setCollections([...collections, newCollection]);
      resetFormData();
      setIsSubmitting(false);
      toast.success("Collection added successfully!");
    }, 1000);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      title: collection.title,
      description: collection.description,
      image: collection.image,
      price: collection.price.toString(),
      category: collection.category
    });
  };

  const handleUpdateCollection = () => {
    if (!editingCollection) return;
    setIsSubmitting(true);

    // Validate form data
    if (!formData.title || !formData.description || !formData.image || !formData.price || !formData.category) {
      toast.error("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // Update collection
    const updatedCollection = {
      ...editingCollection,
      title: formData.title,
      description: formData.description,
      image: formData.image,
      price: parseFloat(formData.price),
      category: formData.category
    };

    // Simulate API call
    setTimeout(() => {
      setCollections(
        collections.map(c => (c.id === editingCollection.id ? updatedCollection : c))
      );
      setEditingCollection(null);
      resetFormData();
      setIsSubmitting(false);
      toast.success("Collection updated successfully!");
    }, 1000);
  };

  const handleDeleteCollection = (id: string) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      // Simulate API call
      setTimeout(() => {
        setCollections(collections.filter(c => c.id !== id));
        toast.success("Collection deleted successfully!");
      }, 500);
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
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="29.99"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Floral, Minimalist, etc."
                  />
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
                  <p className="text-gold font-medium">${collection.price.toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 bg-secondary rounded-full">{collection.category}</span>
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
                          <Label htmlFor="edit-price">Price (USD)</Label>
                          <Input
                            id="edit-price"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            type="number"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-category">Category</Label>
                          <Input
                            id="edit-category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                          />
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
    </div>
  );
};

export default AdminCollections;
