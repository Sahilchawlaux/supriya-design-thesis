import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import design1 from "@/assets/designs-home/1.jpg";
import design2 from "@/assets/designs-home/2.jpg";
import design3 from "@/assets/designs-home/3.jpg";
import design4 from "@/assets/designs-home/4.jpg";
import design5 from "@/assets/designs-home/5.jpg";

// Mock data - would come from API in production
const featuredCollections = [
  {
    id: "1",
    title: "Elegant Florals",
    description: "Romantic floral invitation designs with delicate illustration",
    image: "https://plus.unsplash.com/premium_photo-1676836153320-bb844231a5c7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlZ2FudCUyMGZsb3JhbHN8ZW58MHx8MHx8fDA%3D",
    price: 39.99,
  },
  {
    id: "2",
    title: "Modern Minimalist",
    description: "Clean, contemporary designs with stylish typography",
    image: "https://plus.unsplash.com/premium_photo-1673548916575-c86ff6a1dbd3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZXJuJTIwbWluaW1hbGlzdHxlbnwwfHwwfHx8MA%3D%3D",
    price: 34.99,
  },
  {
    id: "3",
    title: "Rustic Charm",
    description: "Warm, natural designs with a handcrafted feel",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 29.99,
  },
];

const testimonials = [
  {
    id: "1",
    name: "Emily & James",
    comment: "We received so many compliments on our digital invitations. The design was absolutely perfect for our special day!",
    rating: 5,
  },
  {
    id: "2",
    name: "Sarah T.",
    comment: "Supriya was incredibly helpful in customizing our design. The process was smooth and the results were stunning.",
    rating: 5,
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
  const [isVisible, setIsVisible] = useState(false);
  const scrollRef = useRef(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
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
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const scrollToContent = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Full-screen Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-cream">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://plus.unsplash.com/premium_photo-1726729271150-782c4670e27a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhdXRpZnVsJTIwd2VkZGluZyUyMGludml0YXRpb25zfGVufDB8fDB8fHww" 
            alt="Beautiful wedding flowers" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/50 to-cream/80"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8">
              Exquisite Digital Wedding Invitations
            </h1>
            <p className="text-charcoal-light mb-12 text-lg md:text-xl max-w-2xl mx-auto">
              Discover beautiful, customizable digital invitation designs that perfectly capture the essence of your special day.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild size="lg" className="bg-gold hover:bg-gold-dark text-white px-8 py-6">
                  <Link to="/collections">
                    Browse Collections
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button asChild variant="outline" size="lg" className="border-gold text-gold hover:bg-gold-light/10 text-lg px-8 py-6">
                  <Link to="/about">
                    Learn More
                  </Link>
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
            repeatType: "reverse"
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
      <section className="py-20 bg-white relative overflow-hidden" ref={scrollRef}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl mb-3">Our Designs in Action</h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
          </motion.div>

          <div className="relative" ref={carouselRef}>
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -containerWidth],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {[...designImages, ...designImages].map((img, index) => (
                <motion.div
                  key={`design-image-${index}`}
                  className="w-64 md:w-80 lg:w-80 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-none shadow-lg">
                    <div className="relative h-full overflow-hidden">
                      <img
                        src={img}
                        alt={`Design ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button asChild className="bg-gold hover:bg-gold-dark text-white">
              <Link to="/portfolio">
                View More Designs
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-20 bg-cream-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex justify-between items-end mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div>
              <h2 className="font-serif text-3xl mb-3">Featured Collections</h2>
              <div className="w-24 h-1 bg-gold"></div>
            </div>
            <Link to="/collections" className="flex items-center text-gold hover:text-gold-dark transition-colors">
              View All <ArrowRight size={16} className="ml-2" />
            </Link>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredCollections.map((collection) => (
              <motion.div
                key={collection.id}
                variants={fadeInUp}
              >
                <Link 
                  to={`/collections/${collection.id}`}
                  className="group transition-all duration-300 block"
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow h-full">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={collection.image} 
                        alt={collection.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl mb-2">{collection.title}</h3>
                      <p className="text-charcoal-light text-sm mb-3">
                        {collection.description}
                      </p>
                      {/* <p className="text-gold font-medium">${collection.price}</p> */}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="font-serif text-3xl mb-3">How It Works</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-12"></div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center mb-6 text-xl font-medium">1</div>
              <h3 className="font-serif text-xl mb-3">Choose a Design</h3>
              <p className="text-charcoal-light">
                Browse our beautiful collections and select the perfect design for your special occasion.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center mb-6 text-xl font-medium">2</div>
              <h3 className="font-serif text-xl mb-3">Customize & Purchase</h3>
              <p className="text-charcoal-light">
                Add your personal details and customize colors, then complete your purchase securely.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col items-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 rounded-full bg-gold text-white flex items-center justify-center mb-6 text-xl font-medium">3</div>
              <h3 className="font-serif text-xl mb-3">Download & Share</h3>
              <p className="text-charcoal-light">
                Instantly download your personalized design and share with your guests digitally.
              </p>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <Button asChild className="bg-gold hover:bg-gold-dark text-white">
              <Link to="/collections">
                Get Started
              </Link>
            </Button>
          </motion.div>
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
            src="https://images.unsplash.com/photo-1641317136698-284db1e10c1b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJlYXV0aWZ1bCUyMHdlZGRpbmclMjBpbnZpdGF0aW9uc3xlbnwwfHwwfHx8MA%3D%3D" 
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
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">Create Unforgettable Moments</h2>
            <p className="text-white/90 text-lg mb-8">
              Your special occasion deserves an invitation that sets the perfect tone. Let our designs help you create a memorable experience from the very first moment.
            </p>
            <Button asChild variant="outline" size="lg" className="border-white text-black hover:bg-white/20 hover:text-white">
              <Link to="/contact">
                Contact Us Today
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <section className="py-20 bg-cream-light">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="font-serif text-3xl mb-3">Client Love</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-12"></div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeInUp}>
                <Card className="border-none shadow-md">
                  <CardContent className="p-8">
                    {/* <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} className="fill-gold text-gold" />
                      ))}
                    </div> */}
                    <p className="italic mb-6">"{testimonial.comment}"</p>
                    <p className="font-medium">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/testimonials" className="text-gold hover:text-gold-dark transition-colors">
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
            <h2 className="font-display text-3xl mb-6">Ready to Create Something Beautiful?</h2>
            <p className="max-w-xl mx-auto mb-8">
              Explore our collection of premium digital wedding invitation designs and find the perfect match for your special day.
            </p>
            <Button asChild variant="outline" className="border-white text-black hover:bg-white/10 hover:text-white">
              <Link to="/collections">
                Browse Collections
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
