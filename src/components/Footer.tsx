
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cream-dark text-charcoal border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-xl mb-4">The Design Thesis</h3>
            <p className="text-charcoal-dark text-sm max-w-md leading-relaxed">
              Elegant digital invitations & stationery crafting beautiful memories with customisable templates.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://www.instagram.com/thedesignthesis/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-charcoal hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://pin.it/5DMydPM0p" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-charcoal hover:text-primary transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M8 22c.666-3.333 2.333-11.667 3-14.5C10 6 10 4.5 11 3.5c.934-.934 2.5-.5 2.5.5 0 1-1.5 4.5-1.5 6 0 1.5 1 2.5 2.5 2.5 4.5 0 5.5-6.5 4.5-9.5-1-3-4-4.5-7.5-4.5C6 1 2 5.5 2 10.5c0 3.5 1.5 5.5 3 6.5.5.333.667.167.667-.333l-.167-1c-.167-.333-.333-.5-.5-1C4 13.5 3.5 12 3.5 10c0-4 3-7.5 7.5-7.5 4 0 7 2.5 7 6.5 0 4.5-2.5 8-6 8-1.5 0-2.5-1-2.5-2.5 0-1 .5-2 1-3.5C11 10.5 11 9.5 11 9c0-1.5-1-2-2-2-1 0-2 1-2 2.5 0 1 .333 1.667.667 2.167L7 16c-.666 2.667-1.333 5.333-1 6" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-primary transition-colors">Portfolio</Link>
              </li>
              <li>
                <Link to="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-primary transition-colors">Shop</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 uppercase tracking-widest text-sm">Contact</h4>
            <ul className="space-y-2 text-sm">
              {/* <li>Email: info@designthesis.com</li> */}
              <li>Phone: +91 9810029889</li>
              <li className="pt-4">
                <Link to="/contact" className="text-primary hover:underline">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal-dark mt-10 pt-6 text-center text-xs text-charcoal-dark">
          <p>© {currentYear} The Design Thesis by Supriya Malik. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
