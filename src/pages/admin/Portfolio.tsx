
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter 
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
import { Edit, Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";

// Mock portfolio data
const initialPortfolioItems = [
  {
    id: "1",
    title: "Elegant Wedding Suite",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "A luxurious wedding invitation suite with gold foil details and custom calligraphy."
  },
  {
    id: "2",
    title: "Minimalist Birthday Invitation",
    category: "Birthday",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Clean, modern birthday invitation with a minimalist aesthetic and custom typography."
  },
  {
    id: "3",
    title: "Botanical Baby Shower",
    category: "Baby Shower",
    image: "https://images.unsplash.com/photo-1595778125493-51d3479ad651?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Delicate floral-themed baby shower invitation with watercolor illustrations."
  }
];

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

const AdminPortfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: ""
  });

  // Load initial data
  useState(() => {
    setPortfolioItems(initialPortfolioItems);
  });

  const resetFormData = () => {
    setFormData({
      title: "",
      category: "",
      image: "",
      description: ""
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddItem = () => {
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.title || !formData.category || !formData.image) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Create new item
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title: formData.title,
      category: formData.category,
      image: formData.image,
      description: formData.description
    };

    // Simulate API call
    setTimeout(() => {
      setPortfolioItems([...portfolioItems, newItem]);
      resetFormData();
      setIsSubmitting(false);
      toast.success("Portfolio item added successfully!");
    }, 1000);
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    setIsSubmitting(true);

    // Validate form data
    if (!formData.title || !formData.category || !formData.image) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Update item
    const updatedItem = {
      ...editingItem,
      title: formData.title,
      category: formData.category,
      image: formData.image,
      description: formData.description
    };

    // Simulate API call
    setTimeout(() => {
      setPortfolioItems(
        portfolioItems.map(item => (item.id === editingItem.id ? updatedItem : item))
      );
      setEditingItem(null);
      resetFormData();
      setIsSubmitting(false);
      toast.success("Portfolio item updated successfully!");
    }, 1000);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      // Simulate API call
      setTimeout(() => {
        setPortfolioItems(portfolioItems.filter(item => item.id !== id));
        toast.success("Portfolio item deleted successfully!");
      }, 500);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Manage Portfolio</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <Plus size={18} className="mr-2" /> Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Portfolio Item</DialogTitle>
              <DialogDescription>
                Add a new item to your portfolio showcase
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
                  placeholder="Item title"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Wedding, Birthday, etc."
                  required
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
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the portfolio item"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleAddItem}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.length === 0 ? (
          <p className="col-span-full text-center py-12 text-muted-foreground">
            No portfolio items found. Add your first item to get started.
          </p>
        ) : (
          portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">{item.category}</span>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit size={16} className="mr-2" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Edit Portfolio Item</DialogTitle>
                      <DialogDescription>
                        Make changes to the portfolio item details
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
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Input
                          id="edit-category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="edit-image">Image URL</Label>
                        <Input
                          id="edit-image"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          required
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
                    </div>
                    
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        className="bg-gold hover:bg-gold-dark text-white" 
                        onClick={handleUpdateItem}
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
                  onClick={() => handleDeleteItem(item.id)}
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

export default AdminPortfolio;
