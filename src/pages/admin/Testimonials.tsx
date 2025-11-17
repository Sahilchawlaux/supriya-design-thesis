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
import { Edit, Trash2, Plus, Star, Loader2, X } from "lucide-react";
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
  is_approved?: boolean;
  is_selected?: boolean;
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
          is_approved: t.is_approved || false,
          is_selected: t.is_selected || false,
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
        is_approved: t.is_approved || false,
        is_selected: t.is_selected || false,
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
        <div>
          <h1 className="text-3xl font-serif mb-2">Manage Testimonials</h1>
          <p className="text-muted-foreground">Review and manage testimonials. Featured testimonials appear on the home page.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold-dark text-white">
              <Plus size={18} className="mr-2" /> Add New Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogClose className="absolute right-4 top-4 text-black hover:text-black/80">
              <X size={18} />
            </DialogClose>
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>
                Add a new client testimonial to showcase on your site
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-black">Client Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="text-black bg-white placeholder:text-gray-500"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-black">Client Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Bride, Event Planner, etc."
                    className="text-black bg-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-black">Testimonial Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="What did the client say about your services?"
                  rows={4}
                  className="text-black bg-white placeholder:text-gray-500"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="image" className="text-black">Client Image URL (optional)</Label>
                <Input
                  id="image"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="text-black bg-white placeholder:text-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating" className="text-black">Rating</Label>
                  <Select 
                    value={formData.rating} 
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="text-black">
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
                  <Label htmlFor="date" className="text-black">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="text-black bg-white placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="is_featured" className="text-black">Featured</Label>
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
      
      {/* Featured Testimonials Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-serif mb-4">Featured Testimonials</h2>
        <p className="text-muted-foreground mb-4">These testimonials will appear on the home page. Maximum 2 can be featured.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.filter(t => t.is_featured).map((testimonial) => (
            <Card key={testimonial.id} className="overflow-hidden border-gold">
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      const { error } = await supabase
                        .from('testimonials')
                        .update({ is_featured: false })
                        .eq('id', testimonial.id);
                      if (error) {
                        toast.error(error.message);
                      } else {
                        toast.success("Removed from featured");
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
                          is_approved: t.is_approved || false,
                          is_selected: t.is_selected || false,
                        })));
                      }
                    }}
                  >
                    Remove from Featured
                  </Button>
                </div>
                <blockquote className="text-lg mt-4">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-serif mb-4">All Testimonials</h2>
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
                      <DialogClose className="absolute right-4 top-4 text-black hover:text-black/80">
                        <X size={18} />
                      </DialogClose>
                      <DialogHeader>
                        <DialogTitle>Edit Testimonial</DialogTitle>
                        <DialogDescription>
                          Make changes to the testimonial details
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-name" className="text-black">Client Name</Label>
                            <Input
                              id="edit-name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="text-black bg-white placeholder:text-gray-500"
                              required
                            />
                          </div>
                          
                          <div className="grid gap-2">
                            <Label htmlFor="edit-title" className="text-black">Client Title</Label>
                            <Input
                              id="edit-title"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              className="text-black bg-white placeholder:text-gray-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-content" className="text-black">Testimonial Content</Label>
                          <Textarea
                            id="edit-content"
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            rows={4}
                            className="text-black bg-white placeholder:text-gray-500"
                            required
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="edit-image" className="text-black">Client Image URL (optional)</Label>
                          <Input
                            id="edit-image"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleInputChange}
                            className="text-black bg-white placeholder:text-gray-500"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="edit-rating" className="text-black">Rating</Label>
                            <Select 
                              value={formData.rating} 
                              onValueChange={handleSelectChange}
                            >
                              <SelectTrigger id="edit-rating" className="text-black">
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
                            <Label htmlFor="edit-date" className="text-black">Date</Label>
                            <Input
                              id="edit-date"
                              name="date"
                              type="date"
                              value={formData.date}
                              onChange={handleInputChange}
                              className="text-black bg-white placeholder:text-gray-500"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="edit-is_featured" className="text-black">Featured</Label>
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
                  
                  {!testimonial.is_featured && testimonials.filter(t => t.is_featured).length < 2 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        if (!testimonial.is_approved) {
                          toast.error("Approve the testimonial before featuring");
                          return;
                        }
                        const { error } = await supabase
                          .from('testimonials')
                          .update({ is_featured: true })
                          .eq('id', testimonial.id);
                        if (error) {
                          toast.error(error.message);
                        } else {
                          toast.success("Added to featured");
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
                            is_approved: t.is_approved || false,
                            is_selected: t.is_selected || false,
                          })));
                        }
                      }}
                      className="mr-2"
                    >
                      Feature on Home
                    </Button>
                  )}
                  {!testimonial.is_approved && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        const { error } = await supabase
                          .from('testimonials')
                          .update({ is_approved: true })
                          .eq('id', testimonial.id);
                        if (error) {
                          toast.error(error.message);
                        } else {
                          toast.success("Testimonial approved");
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
                            is_approved: t.is_approved || false,
                            is_selected: t.is_selected || false,
                          })));
                        }
                      }}
                      className="mr-2"
                    >
                      Approve
                    </Button>
                  )}
                  {testimonial.is_approved && !testimonial.is_featured && testimonials.filter(t => t.is_featured).length < 2 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        const { error } = await supabase
                          .from('testimonials')
                          .update({ is_featured: true })
                          .eq('id', testimonial.id);
                        if (error) {
                          toast.error(error.message);
                        } else {
                          toast.success("Added to featured");
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
                            is_approved: t.is_approved || false,
                            is_selected: t.is_selected || false,
                          })));
                        }
                      }}
                      className="mr-2"
                    >
                      Feature on Home
                    </Button>
                  )}
                  {!testimonial.is_selected && testimonials.filter(t => t.is_selected).length < 8 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!testimonial.is_approved) {
                          toast.error("Approve the testimonial before selecting for the page");
                          return;
                        }
                        const { error } = await supabase
                          .from('testimonials')
                          .update({ is_selected: true })
                          .eq('id', testimonial.id);
                        if (error) {
                          toast.error(error.message);
                        } else {
                          toast.success("Selected for testimonials page");
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
                            is_approved: t.is_approved || false,
                            is_selected: t.is_selected || false,
                          })));
                        }
                      }}
                      className="mr-2"
                    >
                      Show on Testimonials Page
                    </Button>
                  )}
                  {testimonial.is_selected && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        const { error } = await supabase
                          .from('testimonials')
                          .update({ is_selected: false })
                          .eq('id', testimonial.id);
                        if (error) {
                          toast.error(error.message);
                        } else {
                          toast.success("Removed from testimonials page");
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
                            is_approved: t.is_approved || false,
                            is_selected: t.is_selected || false,
                          })));
                        }
                      }}
                      className="mr-2"
                    >
                      Remove from Testimonials Page
                    </Button>
                  )}
                  {testimonial.is_featured && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={async () => {
                        const { error } = await supabase
                          .from('testimonials')
                          .update({ is_featured: false })
                          .eq('id', testimonial.id);
                        if (error) {
                          toast.error(error.message);
                        } else {
                          toast.success("Removed from featured");
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
                            is_approved: t.is_approved || false,
                            is_selected: t.is_selected || false,
                          })));
                        }
                      }}
                      className="mr-2"
                    >
                      Remove from Featured
                    </Button>
                  )}
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
