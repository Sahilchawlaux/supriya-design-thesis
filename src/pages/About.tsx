
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfileImage from "../assets/supriya-profile.png"

const AboutPage = () => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-cream py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl mb-6">About Us</h1>
            <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-lg text-charcoal-light">
              The story behind The Design Thesis and our passion for creating beautiful digital invitations.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full border-2 border-gold rounded-lg"></div>
              <img 
                src={ProfileImage}
                alt="Supriya Malik" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>

            <div>
              <h2 className="font-serif text-3xl mb-6">Meet Supriya Malik</h2>
              <div className="w-12 h-1 bg-gold mb-6"></div>
              
              <p className="mb-4 text-charcoal-light">
                With over 4 years of experience in graphic design and a passion for creating beautiful stationery, 
                Supriya Malik founded The Design Thesis in 2021 with a vision to make premium wedding invitations 
                more accessible and environmentally friendly.
              </p>
              
              <p className="mb-6 text-charcoal-light">
                Having designed for hundreds of couples, Supriya brings her meticulous eye for detail and contemporary 
                aesthetic to every design. Her work combines traditional elegance with modern digital convenience, 
                ensuring each template can be personalized to tell your unique love story.
              </p>
              
              <p className="italic font-serif text-lg mb-6">
                "My goal is to create designs that capture the essence of a couple's relationship while delivering 
                the convenience of digital sharing. Beautiful design should be accessible to everyone."
              </p>
              
              <p className="font-medium">— Supriya Malik, Founder</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-cream-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl mb-3">Our Mission</h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          
          <p className="max-w-2xl mx-auto mb-12 text-lg">
            We believe beautiful design should be accessible, sustainable, and personal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="h-20 flex items-center justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#D4AF37" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Accessibility</h3>
              <p className="text-charcoal-light">
                We believe beautiful design should be accessible to all couples, regardless of budget. Digital invitations 
                allow us to offer premium designs at accessible price points.
              </p>
            </div>
            
            <div>
              <div className="h-20 flex items-center justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#D4AF37" strokeWidth="2" />
                  <path d="M12 6v6l4 2" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Sustainability</h3>
              <p className="text-charcoal-light">
                Digital invitations reduce paper waste and carbon emissions associated with traditional print stationery, 
                allowing couples to celebrate their love while honoring our planet.
              </p>
            </div>
            
            <div>
              <div className="h-20 flex items-center justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="#D4AF37" strokeWidth="2" />
                  <path d="M22 7l-10 7L2 7" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Personalization</h3>
              <p className="text-charcoal-light">
                We craft every template to be fully customizable, ensuring your invitations reflect your unique style 
                and story while maintaining the elegance of professional design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl mb-3 text-center">Our Design Process</h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gold"></div>
              <span className="absolute -left-6 -top-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">1</span>
              <h3 className="font-serif text-xl mb-3 pl-6">Research & Inspiration</h3>
              <p className="pl-6 text-charcoal-light">
                We begin by researching current wedding trends, color palettes, and typography styles, 
                drawing inspiration from fashion, interior design, and art.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gold"></div>
              <span className="absolute -left-6 -top-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">2</span>
              <h3 className="font-serif text-xl mb-3 pl-6">Concept Development</h3>
              <p className="pl-6 text-charcoal-light">
                Our designers create initial sketches and concepts, experimenting with various layout options, 
                typography pairings, and decorative elements.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gold"></div>
              <span className="absolute -left-6 -top-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">3</span>
              <h3 className="font-serif text-xl mb-3 pl-6">Digital Execution</h3>
              <p className="pl-6 text-charcoal-light">
                Selected concepts are digitally rendered with meticulous attention to detail, 
                ensuring every element is perfectly balanced and refined.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gold"></div>
              <span className="absolute -left-6 -top-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">4</span>
              <h3 className="font-serif text-xl mb-3 pl-6">Testing & Refinement</h3>
              <p className="pl-6 text-charcoal-light">
                We test designs across various devices and screen sizes, making adjustments to ensure 
                optimal display and functionality for all your guests.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gold"></div>
              <span className="absolute -left-6 -top-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">5</span>
              <h3 className="font-serif text-xl mb-3 pl-6">Customization Options</h3>
              <p className="pl-6 text-charcoal-light">
                We build flexibility into each design, creating customization options for colors, 
                typography, and layout to suit different couples' styles.
              </p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-4 top-0 h-full w-1 bg-gold"></div>
              <span className="absolute -left-6 -top-3 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">6</span>
              <h3 className="font-serif text-xl mb-3 pl-6">Final Delivery</h3>
              <p className="pl-6 text-charcoal-light">
                The perfected designs are packaged with clear instructions for customization and use, 
                ensuring a seamless experience for all our couples.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gold text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl mb-6">Ready to Start Your Design Journey?</h2>
          <p className="max-w-xl mx-auto mb-8">
            Explore our collection of premium digital wedding invitation designs and find the perfect match for your special day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-white bg-white text-gold hover:bg-white/10 hover:text-white">
              <Link to="/collections">
                Browse Collections
              </Link>
            </Button>
            <Button asChild className="bg-white text-gold hover:bg-cream">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
