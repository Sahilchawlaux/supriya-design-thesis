import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProfileImage from "../assets/supriya-profile.png";
import heroBackground from "@/assets/hero-background.jpg";
import { usePublicAboutContent } from "@/hooks/usePublicAboutContent";

const AboutPage = () => {
  const { data: aboutContent } = usePublicAboutContent();

  const defaultAbout = {
    heading: "About Us",
    tagline:
      "THE DESIGN THESIS, based in Delhi, India, specializes in bespoke and personalized digital invites and stationery for your special occasions. Our designs range from rustic and traditional to modern and luxurious, each crafted with love and a personal touch. Whether you're planning a wedding or another special day, we create unique and elegant invitations that stay ahead of trends. If you're looking for the perfect e-invite, you've come to the right place! We offer customized, trendy designs in an eco-friendly and budget-friendly manner, delivered in no time.",
    mainContent:
      "THE DESIGN THESIS, based in Delhi, India, specializes in bespoke and personalized digital invites and stationery for your special occasions. Our designs range from rustic and traditional to modern and luxurious, each crafted with love and a personal touch. Whether you're planning a wedding or another special day, we create unique and elegant invitations that stay ahead of trends.",
    founderImage: ProfileImage,
    founderName: "Supriya Malik",
    founderTitle: "Founder",
    founderBio:
      "With over 8 years of experience in graphic design and a passion for creating bespoke, personalised digital invitations and stationery, Supriya Malik founded The Design Thesis in 2021 with a vision to make premium invitations both accessible and environmentally conscious.",
  };

  const content = aboutContent || defaultAbout;

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

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
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl mb-6 text-white">{content.heading}</h1>
            <div className="w-48 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-lg text-gray-300">{content.mainContent || content.tagline}</p>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-[95%] h-[100%] border-4 border-gold rounded-12"></div>
              <img 
                src={content.founderImage || ProfileImage}
                alt={content.founderName} 
                className="rounded-12 shadow-lg w-[95%] h-[95%] object-cover"
              />
            </div>

            <div>
              <h2 className="font-serif text-3xl mb-6">Meet {content.founderName}</h2>
              <div className="w-12 h-1 bg-gold mb-6"></div>
              
              <p className="mb-4 text-charcoal-light">{content.founderBio}</p>
              
              <p className="mb-6 text-charcoal-light">
              Having collaborated with more than 300 clients, we bring a meticulous eye for detail and a modern aesthetic to every project. Our work harmoniously blends traditional elegance with the convenience of digital sharing, ensuring each piece can be tailored to reflect your unique style.
              
              </p>
              
              <p className="italic font-serif text-lg mb-6">
              "Our goal is to create designs that capture the essence of each client’s vision while delivering the ease of digital sharing. We believe unique design should be accessible to everyone."
              
              </p>
              
              <p className="font-medium">— {content.founderName}, {content.founderTitle || "Founder"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-dark-gray-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl mb-3 text-white">Our Mission</h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          
          <p className="max-w-2xl mx-auto mb-12 text-lg">
            We believe beautiful design should be accessible, sustainable, and personal.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="h-20 flex items-center justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#B8860B" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Accessibility</h3>
              <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
              <p className="text-charcoal-light">
                We believe beautiful design should be accessible to all couples, regardless of budget. Digital invitations 
                allow us to offer premium designs at accessible price points.
              </p>
            </div>
            
            <div>
              <div className="h-20 flex items-center justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#B8860B" strokeWidth="2" />
                  <path d="M12 6v6l4 2" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Sustainability</h3>
              <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
              <p className="text-charcoal-light">
                Digital invitations reduce paper waste and carbon emissions associated with traditional print stationery, 
                allowing couples to celebrate their love while honoring our planet.
              </p>
            </div>
            
            <div>
              <div className="h-20 flex items-center justify-center mb-6">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" stroke="#B8860B" strokeWidth="2" />
                  <path d="M22 7l-10 7L2 7" stroke="#B8860B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif text-xl mb-3">Personalization</h3>
              <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
                    <p className="text-charcoal-light">
                We craft every template to be fully customizable, ensuring your invitations reflect your unique style 
                and story while maintaining the elegance of professional design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms and Conditions */}
      <section className="py-20 bg-dark-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl mb-3 text-white">Terms and Conditions</h2>
            <div className="w-24 h-1 bg-gold mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment Terms and Important Notes Card */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-lg border border-gray-800 h-full">
              <h3 className="font-serif text-2xl mb-6 text-white text-center">Payment Terms</h3>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">70% advance payment required to confirm order</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">30% payment before final delivery</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">Payment modes: Cash Deposit, UPI, Bank Transfer or PayPal(CAD)</p>
                </div>
              </div>

              <h3 className="font-serif text-2xl mb-6 text-white text-center italic">Important Notes</h3>
              <div className="flex flex-col gap-4">
                <p className="text-gray-400 font-medium text-left">Please note that no refunds, returns, or cancellations are allowed once the order is confirmed. This policy ensures our commitment to delivering high-quality, personalized designs while maintaining efficient workflow and resource allocation. We appreciate your understanding and cooperation in this matter.</p>
              </div>
            </div>

            {/* Additional Terms Card */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-lg border border-gray-800 h-full">
              <h3 className="font-serif text-2xl mb-6 text-white text-center">Additional Terms</h3>
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">Photo Quality: Please provide clear, filter-free photos for customized caricatures.</p>
                </div>
                <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">Changes: Additional charges apply for changes to caricature faces or extensive rework.</p>
                </div>
                <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">Text Changes: Up to 2 minor text changes are allowed; further changes incur extra charges.</p>
                </div>
                <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">Video Animation: Designs will be provided in PDF format for proofreading before animation.</p>
                </div>
                <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0"></div>
                  <p className="text-gray-400 font-medium text-left">References: Please provide references for e-invite designs to ensure we meet your requirements and tastes.</p>
                </div>
              </div>
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
            <Button asChild variant="outline" className="border-white bg-white text-gold hover:bg-white/10 hover:text-white rounded-12">
              <Link to="/collections">
                Browse Collections
              </Link>
            </Button>
            <Button asChild className="bg-white text-gold hover:bg-cream rounded-12">
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
