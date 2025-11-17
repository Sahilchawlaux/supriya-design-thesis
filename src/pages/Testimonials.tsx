import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import wedmegood from "../assets/wedmegood.png"
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestimonialsPage = () => {
  let { data: testimonials, isLoading } = useTestimonials();
  const { toast } = useToast();
  if (!testimonials || testimonials.length === 0) {
    testimonials = [];
  }
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const pageCount = Math.ceil(testimonials.length / testimonialsPerPage);
  
  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage
  );
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  };
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
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

  const [form, setForm] = useState({
    name: "",
    title: "",
    company: "",
    content: "",
    image_url: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (r: number) => {
    setForm({ ...form, rating: r });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('testimonials').insert([
      {
        name: form.name,
        role: form.title,
        company: form.company || null,
        content: form.content,
        image_url: form.image_url || null,
        rating: form.rating,
        is_featured: false,
        created_at: new Date().toISOString(),
      }
    ]);
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Thank you!", description: "Your review has been submitted." });
      setForm({ name: "", title: "", company: "", content: "", image_url: "", rating: 5 });
      if (typeof window !== 'undefined') window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif mb-4">Client Testimonials</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our clients have to say about their experience with The Design Thesis.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {isLoading ? (
          Array(3).fill(null).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="flex items-center">
                  <Skeleton className="h-12 w-12 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-border bg-card">
              <CardContent className="p-6">
                {/* <div className="flex items-center gap-2 mb-2">
                  {renderStars(testimonial.rating)}
                </div> */}
                
                <blockquote className="text-lg font-serif italic mb-6">
                  "{testimonial.content}"
                </blockquote>
                
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
                    <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center py-12 text-muted-foreground">
            No testimonials found.
          </p>
        )}
      </div>
      
      {pageCount > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={prevPage}>
              <ChevronLeft size={18} />
            </Button>
            
            <span>
              {currentPage + 1} / {pageCount}
            </span>
            
            <Button variant="outline" size="icon" onClick={nextPage}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}
      {/* WedMeGood Live Reviews Section */}
      <div className="mt-20">
        <div className="flex flex-col items-center">
          <a
            href="https://www.wedmegood.com/profile/The-Design-Thesis-3917402"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ff4880] hover:bg-[#e13c6e] text-white font-bold py-3 px-6 rounded-lg shadow transition text-lg flex items-center gap-4"
          >
            <img src={wedmegood} alt="WedMeGood" className="w-8" />
            <p>Read More Verified Reviews on WedMeGood</p>
          </a>
        </div>
      </div>
      <div className="max-w-xl mx-auto mt-16 mb-20">
        <h2 className="text-2xl font-serif mb-4 text-center">Add Your Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-lg border border-border">
          <div>
            <label className="block mb-1 font-medium">Name*</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Title*</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Company (optional)</label>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Review*</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleFormChange}
              required
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Image URL (optional)</label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Rating*</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleRatingChange(r)}
                  className={
                    r <= form.rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                  aria-label={`Rate ${r} star${r > 1 ? 's' : ''}`}
                >
                  <Star size={20} fill={r <= form.rating ? "#FFD700" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded font-semibold disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestimonialsPage;
