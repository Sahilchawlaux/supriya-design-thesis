import { motion } from "framer-motion";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTestimonials } from "@/hooks/useTestimonials";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const TestimonialSection = () => {
  const { data: testimonials = [], isLoading, error } = useTestimonials();

  useEffect(() => {
    if (error) {
      console.log("[Home] Testimonials fetch error:", error);
    } else if (isLoading) {
      console.log("[Home] Testimonials loading...");
    } else {
      console.log("[Home] Testimonials received:", testimonials);
    }
  }, [testimonials, isLoading, error]);

  // Fallback testimonials if database is not available
  const fallbackTestimonials = [
    {
      id: "1",
      name: "Emily & James",
      content:
        "We received so many compliments on our digital invitations. The design was absolutely perfect for our special day!",
      company: "Wedding Couple",
      image_url: null,
    },
    {
      id: "2",
      name: "Sarah T.",
      content:
        "Supriya was incredibly helpful in customizing our design. The process was smooth and the results were stunning.",
      company: "Event Planner",
      image_url: null,
    },
  ];

  // Get testimonials, prefer approved+featured; fallback to first 2 approved
  let displayTestimonials = [];

  if (error || testimonials.length === 0) {
    // Use fallback testimonials if there's an error or no data
    displayTestimonials = fallbackTestimonials;
  } else {
    const featuredTestimonials = testimonials
      .filter((t: any) => t.is_featured && t.is_approved)
      .slice(0, 2);

    // If no featured approved testimonials, show first 2 approved testimonials
    displayTestimonials =
      featuredTestimonials.length > 0
        ? featuredTestimonials
        : (testimonials as any[]).filter((t) => t.is_approved).slice(0, 2);
  }

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {displayTestimonials.map((testimonial) => (
        <motion.div key={testimonial.id} variants={fadeInUp}>
          <Card className="border-none shadow-md rounded-12 transform hover:scale-105 transition-transform duration-300">
            <CardContent className="p-10">
              <blockquote className="text-2xl font-serif italic mb-8 text-dark-gray leading-relaxed">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center">
                {testimonial.image_url ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gold-light flex items-center justify-center mr-4">
                    <span className="font-medium text-2xl text-black">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-xl text-black">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-600">
                    {testimonial.company || testimonial.title}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default TestimonialSection;
