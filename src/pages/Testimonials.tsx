import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";
import { usePublicTestimonials } from "@/hooks/usePublicTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import wedmegood from "../assets/wedmegood.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-background.jpg";

const TestimonialsPage = () => {
  const { data: selectedTestimonials = [], isLoading: loadingSelected } =
    usePublicTestimonials();
  let { data: allTestimonials, isLoading: loadingAll } = useTestimonials();
  const { toast } = useToast();
  if (!allTestimonials || allTestimonials.length === 0) {
    allTestimonials = [] as any[];
  }
  // Prefer selected (already approved) from public hook; fallback to approved from all; else first 8 from all
  const approvedOnly = (allTestimonials as any[]).filter(
    (t) => (t as any).is_approved
  );
  const displayedTestimonials = (
    selectedTestimonials.length > 0
      ? (selectedTestimonials as any[])
      : approvedOnly.length > 0
      ? approvedOnly
      : (allTestimonials as any[])
  ).slice(0, 8);

  // Logs: data receipt and display composition
  useEffect(() => {
    if (loadingSelected || loadingAll) {
      console.log("[Testimonials Page] Loading testimonials...");
    } else {
      console.log(
        "[Testimonials Page] Selected testimonials (public):",
        selectedTestimonials
      );
      console.log("[Testimonials Page] All testimonials:", allTestimonials);
    }
  }, [selectedTestimonials, allTestimonials, loadingSelected, loadingAll]);

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

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (r: number) => {
    setForm({ ...form, rating: r });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!form.name.trim() || !form.title.trim() || !form.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Prepare testimonial data
      const testData = {
        name: form.name.trim(),
        role: form.title.trim(),
        content: form.content.trim(),
        rating: form.rating,
      };

      // Add optional fields if they exist
      if (form.company.trim()) {
        testData["company"] = form.company.trim();
      }
      if (form.image_url.trim()) {
        testData["image_url"] = form.image_url.trim();
      }

      console.log("Submitting testimonial:", testData);

      const { data, error } = await supabase
        .from("testimonials")
        .insert([testData])
        .select();

      console.log("Insert response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Thank you!",
        description: "Your review has been submitted successfully!",
      });

      setForm({
        name: "",
        title: "",
        company: "",
        content: "",
        image_url: "",
        rating: 5,
      });
    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
            alt="Elegant floral background with dark botanical design"
            className="w-full h-full object-cover object-center opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-gray/60 via-dark-gray/40 to-dark-gray/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-4 text-white">
              Client Testimonials
            </h1>
            <div className="w-48 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our clients have to
              say about their experience with The Design Thesis.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-6 md:gap-8 snap-x snap-mandatory">
            {loadingSelected || loadingAll ? (
              Array(3)
                .fill(null)
                .map((_, i) => (
                  <Card key={i} className="min-w-[280px] md:min-w-[340px]">
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
            ) : displayedTestimonials && displayedTestimonials.length > 0 ? (
              displayedTestimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="border border-border bg-card rounded-12 min-w-[280px] md:min-w-[340px] snap-start"
                >
                  <CardContent className="p-6">
                    {/* <div className="flex items-center gap-2 mb-2">
                  {renderStars(testimonial.rating)}
                </div> */}

                    <blockquote className="text-lg font-serif italic mb-6">
                      "{testimonial.content}"
                    </blockquote>

                    <div className="flex items-center">
                      {(testimonial as any).image_url ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                          <img
                            src={(testimonial as any).image_url}
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
                        <p className="text-sm text-muted-foreground">
                          {(testimonial as any).company ||
                            (testimonial as any).title}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="w-full text-center py-12 text-muted-foreground">
                No testimonials found.
              </p>
            )}
          </div>
        </div>

        {/* WedMeGood Live Reviews Section */}
        <div className="mt-20">
          <div className="flex flex-col items-center">
            <a
              href="https://www.wedmegood.com/profile/The-Design-Thesis-3917402"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#ff4880] hover:bg-[#e13c6e] text-white font-bold py-3 px-6 rounded-12 shadow transition text-lg flex items-center gap-4"
            >
              <img src={wedmegood} alt="WedMeGood" className="w-8" />
              <p>Read More Verified Reviews on WedMeGood</p>
            </a>
          </div>
        </div>
        <div className="max-w-xl mx-auto mt-16 mb-20">
          <h2 className="text-2xl font-serif mb-4 text-center">
            Add Your Review
          </h2>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-card p-8 rounded-12 border border-border shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block font-medium text-white">
                  Full Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  required
                  placeholder="John Smith"
                  className="w-full border border-gray-300 rounded-12 px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="block font-medium text-white">
                  Title/Role*
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleFormChange}
                  required
                  placeholder="Bride, Event Planner, etc."
                  className="w-full border border-gray-300 rounded-12 px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-white">
                Company/Organization{" "}
                <span className="text-gray-400 text-sm">(optional)</span>
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleFormChange}
                placeholder="Your company name"
                className="w-full border border-gray-300 rounded-12 px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-white">
                Your Review*
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleFormChange}
                required
                rows={4}
                placeholder="Share your experience with The Design Thesis..."
                className="w-full border border-gray-300 rounded-12 px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-white">
                Profile Picture URL{" "}
                <span className="text-gray-400 text-sm">(optional)</span>
              </label>
              <input
                type="text"
                name="image_url"
                value={form.image_url}
                onChange={handleFormChange}
                placeholder="https://example.com/your-image.jpg"
                className="w-full border border-gray-300 rounded-12 px-4 py-3 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Rating*</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => handleRatingChange(r)}
                    className={
                      r <= form.rating ? "text-yellow-500" : "text-gray-300"
                    }
                    aria-label={`Rate ${r} star${r > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={20}
                      fill={r <= form.rating ? "#FFD700" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gold hover:bg-gold-dark text-white py-6 rounded-12 font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02]"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Share Your Experience"
                )}
              </Button>
              <p className="text-sm text-gray-400 text-center mt-4">
                Your review will be visible after approval by our team.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
