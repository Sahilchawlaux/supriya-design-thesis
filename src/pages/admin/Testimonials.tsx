import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  title: string;
  content: string;
  image_url?: string;
  rating: number;
  date: string;
  company?: string;
  is_featured: boolean;
}

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    content: "",
    image_url: "",
    rating: "5",
    is_featured: false,
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    // Fetch testimonials from Supabase
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setTestimonials(data.map((t: any) => ({
          id: t.id,
          name: t.name,
          title: t.role || '',
          content: t.content,
          image_url: t.image_url || '',
          rating: t.rating || 5,
          date: t.created_at ? t.created_at.split('T')[0] : '',
          company: t.company || '',
          is_featured: t.is_featured || false,
        })));
      }
    };
    fetchTestimonials();
  }, []);

  const resetFormData = () => {
    setFormData({
      name: "",
      title: "",
      company: "",
      content: "",
      image_url: "",
      rating: "5",
      is_featured: false,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, rating: value });
  };

  const handleAddTestimonial = async () => {
    setIsSubmitting(true);
    if (!formData.name || !formData.title || !formData.content || !formData.rating || !formData.date) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    const { error } = await supabase.from('testimonials').insert([
      {
        name: formData.name,
        role: formData.title,
        company: formData.company || null,
        content: formData.content,
        image_url: formData.image_url || null,
        rating: parseInt(formData.rating),
        is_featured: formData.is_featured,
        created_at: formData.date,
      }
    ]);
    setIsSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Testimonial added successfully!");
      resetFormData();
      // Refetch testimonials
      const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (data) setTestimonials(data.map((t: any) => ({
        id: t.id,
        name: t.name,
        title: t.role || '',
        content: t.content,
        image_url: t.image_url || '',
        rating: t.rating || 5,
        date: t.created_at ? t.created_at.split('T')[0] : '',
        company: t.company || '',
        is_featured: t.is_featured || false,
      })));
    }
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      title: testimonial.title,
      company: testimonial.company || '',
      content: testimonial.content,
      image_url: testimonial.image_url || "",
      rating: testimonial.rating.toString(),
      is_featured: testimonial.is_featured || false,
      date: testimonial.date,
    });
  };

  const handleUpdateTestimonial = async () => {
    if (!editingTestimonial) return;
    setIsSubmitting(true);
    if (!formData.name || !formData.title || !formData.content || !formData.rating || !formData.date) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    const { error } = await supabase.from('testimonials').update({
      name: formData.name,
      role: formData.title,
      company: formData.company || null,
      content: formData.content,
      image_url: formData.image_url || null,
      rating: parseInt(formData.rating),
      is_featured: formData.is_featured,
    }).eq('id', editingTestimonial.id);
    setIsSubmitting(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Testimonial updated successfully!");
      setEditingTestimonial(null);
      resetFormData();
      // Refetch testimonials
      const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (data) setTestimonials(data.map((t: any) => ({
        id: t.id,
        name: t.name,
        title: t.role || '',
        content: t.content,
        image_url: t.image_url || '',
        rating: t.rating || 5,
        date: t.created_at ? t.created_at.split('T')[0] : '',
        company: t.company || '',
        is_featured: t.is_featured || false,
      })));
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Testimonial deleted successfully!");
        // Refetch testimonials
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        if (data) setTestimonials(data.map((t: any) => ({
          id: t.id,
          name: t.name,
          title: t.role || '',
          content: t.content,
          image_url: t.image_url || '',
          rating: t.rating || 5,
          date: t.created_at ? t.created_at.split('T')[0] : '',
          company: t.company || '',
          is_featured: t.is_featured || false,
        })));
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-gold text-gold" : "text-muted"}
      />
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif">Manage Testimonials</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <Plus size={18} className="mr-2" /> Add New Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>
                Add a new client testimonial to showcase on your site
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="title">Client Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Bride, Event Planner, etc."
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="What did the client say about your services?"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image">Client Image URL (optional)</Label>
                <Input
                  id="image"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">Rating</Label>
                  <Select 
                    value={formData.rating} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="is_featured">Featured</Label>
                <input
                  id="is_featured"
                  name="is_featured"
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="ml-2"
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                className="bg-gold hover:bg-gold-dark text-white" 
                onClick={handleAddTestimonial}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Testimonial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {testimonials.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">
            No testimonials found. Add your first testimonial to get started.
          </p>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {testimonial.image_url ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image_url} 
                          alt={testimonial.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-4">
                        <span className="font-medium text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 mr-4">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-sm text-muted-foreground">{testimonial.date}</p>
                  </div>
                </div>
                
                <blockquote className="text-lg mt-4">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Testimonial</DialogTitle>
                        <DialogDescription>
                          Make changes to the testimonial details
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name">Client Name</Label>
                            <Input
                              id="edit-name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="edit-title">Client Title</Label>
                            <Input
                              id="edit-title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-content">Testimonial Content</Label>
                          <Textarea
                            id="edit-content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={4}
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-image">Client Image URL (optional)</Label>
                          <Input
                            id="edit-image"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-rating">Rating</Label>
                            <Select 
                              value={formData.rating} 
                              onValueChange={handleSelectChange}
                            >
                              <SelectTrigger id="edit-rating">
                                <SelectValue placeholder="Select Rating" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="5">5 Stars</SelectItem>
                                <SelectItem value="4">4 Stars</SelectItem>
                                <SelectItem value="3">3 Stars</SelectItem>
                                <SelectItem value="2">2 Stars</SelectItem>
                                <SelectItem value="1">1 Star</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="edit-date">Date</Label>
                            <Input
                              id="edit-date"
                              name="date"
                              type="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-is_featured">Featured</Label>
                          <input
                            id="edit-is_featured"
                            name="is_featured"
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={handleInputChange}
                            className="ml-2"
                          />
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button 
                          className="bg-gold hover:bg-gold-dark text-white" 
                          onClick={handleUpdateTestimonial}
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
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
