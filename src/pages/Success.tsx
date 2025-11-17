
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";

const Success = () => {
  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(Math.random() * 9000 + 1000)}`;
  
  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
    
    // This is where you would typically:
    // 1. Verify payment was successful via API call
    // 2. Record the purchase in your database
    // 3. Clear any local cart state
  }, []);
  
  return (
    <div className="bg-cream-light min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-gold" />
        </div>
        
        <h1 className="text-3xl font-serif mb-4">Thank You!</h1>
        <p className="text-lg mb-2">Your purchase was successful.</p>
        <p className="text-charcoal-light mb-6">Order #{orderNumber}</p>
        
        <div className="bg-cream p-6 rounded-md mb-8">
          <h3 className="font-medium mb-2">Next Steps</h3>
          <ol className="text-left text-sm space-y-2">
            <li>1. Download your purchased designs using the button below.</li>
            <li>2. Check your email for confirmation and download links.</li>
            <li>3. Customize your invitations using the included guide.</li>
            <li>4. Contact our support if you need any assistance.</li>
          </ol>
        </div>
        
        <div className="space-y-4">
          <Button className="bg-gold hover:bg-gold-dark text-white w-full">
            <Download size={16} className="mr-2" /> Download Your Designs
          </Button>
          
          <div className="flex space-x-4">
            <Button asChild variant="outline" className="flex-1">
              <Link to="/collections">
                Browse More
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link to="/">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
