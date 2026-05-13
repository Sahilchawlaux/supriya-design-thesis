
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

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
                  fill="currentColor"
                >
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.034-1.002 2.331-1.492 3.138C9.407 23.834 10.669 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
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
