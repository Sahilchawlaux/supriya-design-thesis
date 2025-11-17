
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
            <p className="text-charcoal-light text-sm max-w-md leading-relaxed">
              Premium digital invitations and stationery designs by Supriya Malik. 
              Crafting beautiful memories with our elegant, customizable templates.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.instagram.com/thedesignthesis/" className="text-charcoal hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              {/* <a href="#" className="text-charcoal hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-charcoal hover:text-primary transition-colors">
                <Twitter size={20} />
              </a> */}
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
        
        <div className="border-t border-charcoal-light/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-charcoal-light">
          <p>© {currentYear} The Design Thesis by Supriya Malik. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
