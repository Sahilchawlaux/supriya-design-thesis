
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import heroBackground from "@/assets/hero-background.jpg";

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formState.name || !formState.email || !formState.message) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulated form submission
    try {
      // Replace with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      toast.success("Thank you for your message! We'll respond shortly.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
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
    <div className="bg-dark-gray">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 md:py-28 overflow-hidden border-b border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBackground} 
            alt="Elegant floral background with dark botanical design" 
            className="w-full h-full object-cover object-center opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-gray/60 via-dark-gray/40 to-dark-gray/70"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1 
            className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Contact Us
          </motion.h1>
          <motion.div 
            className="w-24 h-1 bg-gold mx-auto mb-8"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          ></motion.div>
          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We'd love to hear from you. Whether you have a question about our designs, pricing, or anything else, our team is ready to answer all your questions.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"> */}
            {/* Contact Form */}
            {/* <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <h2 className="font-serif text-2xl mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Message Received!</h3>
                  <p className="text-charcoal-light">
                    Thank you for reaching out. We'll get back to you shortly.
                  </p>
                  <Button
                    className="mt-6 bg-gold hover:bg-gold-dark text-white"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={formState.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        value={formState.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formState.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="How can we help you?"
                      rows={6}
                      value={formState.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gold hover:bg-gold-dark text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
             */}
            {/* Contact Info */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center"
            >
              <motion.div  variants={fadeInUp}>
                <h2 className="font-serif text-2xl mb-8">Get in Touch</h2>
              </motion.div>
              
              <div className="grid gap-8 ">
                {/* <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold-light/30 mr-4">
                    <Mail className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Email</h3>
                    <p className="text-charcoal-light">hello@designthesis.com</p>
                    <p className="text-charcoal-light">support@designthesis.com</p>
                  </div>
                </motion.div> */}
                
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold-light/30 mr-4">
                    <Phone className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Phone</h3>
                    {/* <p className="text-charcoal-light">+1 (555) 123-4567</p> */}
                    <p className="text-charcoal-light">+91 9810029889</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold-light/30 mr-4">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Location</h3>
                    {/* <p className="text-charcoal-light">123 Design Street</p> */}
                    <p className="text-charcoal-light">New Delhi, India</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start"
                  variants={fadeInUp}
                >
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gold-light/30 mr-4">
                    <Clock className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-1">Business Hours</h3>
                    <p className="text-charcoal-light">Monday-Friday: 9am - 6pm</p>
                    <p className="text-charcoal-light">Saturday: 10am - 4pm</p>
                    <p className="text-charcoal-light">Sunday: Closed</p>
                  </div>
                </motion.div>
              </div>
              
              {/* <motion.div 
                className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-100"
                variants={fadeInUp}
              >
                <h3 className="font-medium text-lg mb-4">Need Custom Designs?</h3>
                <p className="text-charcoal-light mb-4">
                  We offer personalized design services tailored to your specific needs. Get in touch to discuss your project requirements.
                </p>
                <Button asChild className="bg-gold hover:bg-gold-dark text-white">
                  <a href="mailto:custom@designthesis.com">Request Custom Quote</a>
                </Button>
              </motion.div> */}
            </motion.div>
          {/* </div> */}
        </div>
      </section>
      
      {/* Map Section
      <motion.section 
        className="py-12 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1680123456789!5m2!1sen!2s" 
              className="w-full h-full border-0" 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="The Design Thesis location"
            ></iframe>
          </div>
        </div>
      </motion.section> */}

      {/* FAQ Section */}
      <section className="py-20 bg-dark-gray-light">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="font-serif text-3xl mb-3">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
            <p className="text-charcoal-light max-w-2xl mx-auto">
              Find answers to our most commonly asked questions. If you can't find what you're looking for, please contact us.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="p-6 bg-white rounded-12 shadow-sm">
              <h3 className="font-medium text-charcoal-dark text-xl mb-3">What type of invitations do you provide?</h3>
              <p className="text-charcoal-dark">
                We provide video and PDF invitations with or without customized caricatures and logos.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="p-6 bg-white rounded-12 shadow-sm">
              <h3 className="font-medium text-charcoal-dark text-xl mb-3">What is your customization timeline?</h3>
              <p className="text-charcoal-dark">
                5-6 business days for standard designs, 8-9 business days for complex designs.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="p-6 bg-white rounded-12 shadow-sm">
              <h3 className="font-medium text-charcoal-dark text-xl mb-3">Can I request revisions?</h3>
              <p className="text-charcoal-dark">
                Yes, 2 rounds of revisions only for text are included before the final delivery. Any additional revisions may incur extra charges in text or design.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="p-6 bg-white rounded-12 shadow-sm">
              <h3 className="font-medium text-charcoal-dark text-xl mb-3">Do you offer rush services and other design services?</h3>
              <p className="text-charcoal-dark">
                Yes, we offer rush services for an additional fee. Please contact us directly to discuss your timeline and requirements.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
