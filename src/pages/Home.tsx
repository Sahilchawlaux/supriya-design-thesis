import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  ChevronDown,
  MessageCircle,
  Palette,
  FolderOpen,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialSection from "@/components/TestimonialSection";
import { motion } from "framer-motion";
import design1 from "@/assets/designs-home/1.jpg";
import design2 from "@/assets/designs-home/2.jpg";
import design3 from "@/assets/designs-home/3.jpg";
import design4 from "@/assets/designs-home/4.jpg";
import design5 from "@/assets/designs-home/5.jpg";
import logoText from "@/assets/design-thesis-logo-text.png";
import heroBackground from "@/assets/hero-background.jpg";
import { usePublicHomeContent } from "@/hooks/usePublicHomeContent";

// Mock data - would come from API in production
const featuredCollections = [
  {
    id: "1",
    title: "Elegant Florals",
    description:
      "Romantic floral invitation designs with delicate illustration",
    image:
      "https://plus.unsplash.com/premium_photo-1676836153320-bb844231a5c7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlZ2FudCUyMGZsb3JhbHN8ZW58MHx8MHx8fDA%3D",
    price: 39.99,
  },
  {
    id: "2",
    title: "Modern Minimalist",
    description: "Clean, contemporary designs with stylish typography",
    image:
      "https://plus.unsplash.com/premium_photo-1673548916575-c86ff6a1dbd3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZXJuJTIwbWluaW1hbGlzdHxlbnwwfHwwfHx8MA%3D%3D",
    price: 34.99,
  },
  {
    id: "3",
    title: "Rustic Charm",
    description: "Warm, natural designs with a handcrafted feel",
    image:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 29.99,
  },
];

const designImages = [design1, design2, design3, design4, design5];

const FOCUS_DURATION = 2.5; // seconds per image
const ANIMATION_DURATION = designImages.length * FOCUS_DURATION;

const IMAGE_WIDTHS = { base: 180, md: 260, lg: 320 };

const getResponsiveImageWidth = () => {
  if (window.innerWidth < 640) return IMAGE_WIDTHS.base;
  if (window.innerWidth < 1024) return IMAGE_WIDTHS.md;
  return IMAGE_WIDTHS.lg;
};

const HomePage = () => {
  const { data: homeContent, isLoading, error } = usePublicHomeContent();
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Debug logging to track content updates
  useEffect(() => {
    console.log("Home page content updated:", {
      hasContent: !!homeContent,
      isLoading,
      error,
      content: homeContent,
    });
  }, [homeContent, isLoading, error]);

  // Default content fallback
  const defaultContent = {
    hero_heading: "Exquisite digital invitations, crafted last",
    hero_subheading:
      "Discover beautiful, customizable digital invitation designs that perfectly capture the essence of your special day.",
    hero_cta_text: "Browse Collections",
    process_heading: "How We Curate Your Invitation Story",
    process_description:
      "From concept to delivery, our thoughtful process ensures your digital wedding invitation perfectly captures the essence of your celebration.",
    unforgettable_heading: "Create Unforgettable Moments",
    unforgettable_description:
      "Your special occasion deserves an invitation that sets the perfect tone. Let our designs help you create a memorable experience from the very first moment.",
    unforgettable_button_text: "Contact Us Today",
    unforgettable_image:
      "https://images.unsplash.com/photo-1641317136698-284db1e10c1b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJlYXV0aWZ1bCUyMHdlZGRpbmclMjBpbnZpdGF0aW9uc3xlbnwwfHwwfHx8MA%3D%3D",
    cta_heading: "Ready to Create Something Beautiful?",
    cta_description:
      "Explore our collection of premium digital wedding invitation designs and find the perfect match for your special day.",
    cta_button_text: "Browse Collections",
  };

  // Use database content if available, otherwise use default
  const content = homeContent || defaultContent;

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % designImages.length);
    }, FOCUS_DURATION * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (carouselRef.current) {
        setContainerWidth(carouselRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const scrollToContent = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  return (
    <div className="overflow-hidden bg-dark-gray">
      {/* Full-screen Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-dark-gray">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
            alt="Elegant floral background with dark botanical design"
            className="w-full h-full object-cover object-center opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-gray/60 via-dark-gray/40 to-dark-gray/70"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-tight mb-4 text-white">
              {content.hero_heading}
            </h1>
            <p className="text-gray-300 mb-8 text-base md:text-lg max-w-2xl mx-auto">
              {content.hero_subheading}
            </p>
            <div className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gold hover:bg-gold-dark text-white px-12 py-9 text-xl rounded-12 font-medium"
                >
                  <Link to="/collections">{content.hero_cta_text}</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToContent}
        >
          <ChevronDown size={36} className="text-gold" />
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gold-light rounded-full opacity-20 -z-10 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold-light rounded-full opacity-20 -z-10 blur-3xl"></div>
      </section>

      {/* Carousel */}
      <section
        className="py-12 bg-dark-gray relative overflow-hidden"
        ref={scrollRef}
      >
        <div className="container mx-auto px-2 md:px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-5xl mb-3 text-white">
              Our Designs in Action
            </h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
          </motion.div>

          <div
            className="relative overflow-hidden w-screen -ml-[calc((100vw-100%)/2)]"
            ref={carouselRef}
          >
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -(designImages.length * (320 + 32))], // 320px width + 32px gap
              }}
              transition={{
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                },
              }}
            >
              {[...designImages, ...designImages, ...designImages].map(
                (img, index) => (
                  <motion.div
                    key={`design-image-${index}`}
                    className="w-64 md:w-80 lg:w-80 flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border-none shadow-lg rounded-[16px]">
                      <div className="relative h-full overflow-hidden rounded-[16px]">
                        <img
                          src={img}
                          alt={`Design ${index + 1}`}
                          className="w-full h-full object-cover rounded-[16px]"
                        />
                      </div>
                    </Card>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button
              asChild
              className="bg-gold hover:bg-gold-dark text-white rounded-12"
            >
              <Link to="/portfolio">View More Designs</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How We Curate Your Invitation Story */}
      <section className="py-20" style={{ backgroundColor: "#0c0c0c" }}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white leading-tight">
              {content.process_heading}
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              {content.process_description}
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto relative">
            {/* Vertical golden line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold -translate-x-1/2 z-0"></div>
            {/* Step 1 - Left aligned */}
            <motion.div
              className="relative mb-20 md:mb-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white mb-3">
                          ⁠Understanding Your Vision
                        </h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          We'll discuss your requirements, budget, and goals to
                          ensure a solid foundation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-centre items-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    1
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2 - Right aligned */}
            <motion.div
              className="relative mb-20 md:mb-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="order-1 flex justify-center md:justify-centre items-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    2
                  </div>
                </div>
                <div className="order-2">
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center flex-shrink-0">
                        <Palette className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white mb-3">
                          Design Options
                        </h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          Choose from existing designs within your budget or
                          request a fully custom creation tailored to your
                          needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3 - Left aligned */}
            <motion.div
              className="relative mb-20 md:mb-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white mb-3">
                          Information Gathering
                        </h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          We'll collect all necessary details to incorporate
                          into your design.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-centre items-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    3
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 4 - Right aligned */}
            <motion.div
              className="relative mb-20 md:mb-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="order-1 flex justify-center md:justify-centre items-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    4
                  </div>
                </div>
                <div className="order-2">
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center flex-shrink-0">
                        <Layers className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white mb-3">
                          Draft Preparation
                        </h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          A preliminary design will be shared for your review
                          based on our discussion.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 5 - Left aligned */}
            <motion.div
              className="relative mb-20 md:mb-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white mb-3">
                          Refinements
                        </h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          We'll incorporate your feedback and refine the design
                          until it meets your expectations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2 flex justify-center md:justify-centre items-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    5
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 6 - Right aligned */}
            <motion.div
              className="relative"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="order-1 flex justify-center md:justify-centre items-center">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-white text-xl font-semibold shadow-lg">
                    6
                  </div>
                </div>
                <div className="order-2">
                  <div className="bg-[#1a1a1a] rounded-2xl shadow-lg border border-gray-800 p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center flex-shrink-0">
                        <Layers className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl text-white mb-3">
                          Final Delivery
                        </h3>
                        <p className="text-gray-400 font-medium leading-relaxed">
                          The completed design will be delivered in the
                          agreed-upon format.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full-width Banner */}
      <motion.section
        className="relative py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={content.unforgettable_image}
            alt="Wedding invitation"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-dark/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              {content.unforgettable_heading}
            </h2>
            <p className="text-white/90 text-lg mb-8">
              {content.unforgettable_description}
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-black hover:bg-white/20 hover:text-white rounded-12"
            >
              <Link to="/contact">{content.unforgettable_button_text}</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-20 bg-dark-gray-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="font-serif text-3xl mb-3 text-white">Client Love</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-12"></div>
          </motion.div>

          <TestimonialSection />

          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link
              to="/testimonials"
              className="text-gold hover:text-gold-light transition-colors"
            >
              Read More Testimonials
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl mb-6">
              {content.cta_heading}
            </h2>
            <p className="max-w-xl mx-auto mb-8">{content.cta_description}</p>
            <Button
              asChild
              variant="outline"
              className="border-white text-black hover:bg-white/10 hover:text-white rounded-12"
            >
              <Link to="/collections">{content.cta_button_text}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
