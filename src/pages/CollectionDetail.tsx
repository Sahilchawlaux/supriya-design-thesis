
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Check } from "lucide-react";

// Mock data - would come from API in production
const collections = [
  {
    id: "1",
    title: "Elegant Florals",
    description: "A beautiful floral wedding invitation suite featuring delicate watercolor blooms and elegant typography. Perfect for garden weddings or couples who appreciate a romantic, timeless aesthetic.",
    longDescription: "Our Elegant Florals collection brings the beauty of nature to your wedding stationery. Each design features hand-painted watercolor flowers in soft pastel hues, paired with refined typography and delicate borders. The suite includes customizable templates for invitations, RSVP cards, information cards, and thank you notes. The digital files are easy to personalize with your own details, making this collection both beautiful and practical for modern couples.",
    image: "https://images.unsplash.com/photo-1600164318544-79e55da1ac8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600164318544-79e55da1ac8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1561587327-95cca85ec13b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1447958374760-1ce70cf11ee3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    ],
    price: 39.99,
    features: [
      "5 customizable templates (invitation, RSVP, details, thank you, program)",
      "PDF and JPG formats for easy sharing",
      "Detailed customization guide",
      "Mobile-friendly design",
      "30 days of email support"
    ],
    customizationOptions: [
      "Change text and details",
      "Adjust colors to match your wedding palette",
      "Resize elements as needed",
      "Add or remove design elements",
      "Choose different font combinations"
    ],
    relatedCollections: ["2", "3"]
  },
  {
    id: "2",
    title: "Modern Minimalist",
    description: "Clean, contemporary designs with stylish typography",
    longDescription: "The Modern Minimalist collection embraces simplicity and elegance with clean lines, contemporary typography, and thoughtful negative space. Ideal for the couple who appreciates understated sophistication and modern design principles.",
    image: "https://images.unsplash.com/photo-1561587327-95cca85ec13b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1561587327-95cca85ec13b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1600164318544-79e55da1ac8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    ],
    price: 34.99,
    features: [
      "5 customizable templates (invitation, RSVP, details, thank you, program)",
      "PDF and JPG formats for easy sharing",
      "Detailed customization guide",
      "Mobile-friendly design",
      "30 days of email support"
    ],
    customizationOptions: [
      "Change text and details",
      "Adjust colors to match your wedding palette",
      "Resize elements as needed",
      "Add or remove design elements",
      "Choose different font combinations"
    ],
    relatedCollections: ["1", "3"]
  },
  {
    id: "3",
    title: "Rustic Charm",
    description: "Warm, natural designs with a handcrafted feel",
    longDescription: "Our Rustic Charm collection captures the warmth and intimacy of countryside celebrations with textured backgrounds, organic elements, and handwritten-style typography. Perfect for barn weddings, outdoor ceremonies, or couples who love a natural, handcrafted aesthetic.",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1600164318544-79e55da1ac8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
      "https://images.unsplash.com/photo-1551893134-70bbfe8db519?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
    ],
    price: 29.99,
    features: [
      "5 customizable templates (invitation, RSVP, details, thank you, program)",
      "PDF and JPG formats for easy sharing",
      "Detailed customization guide",
      "Mobile-friendly design",
      "30 days of email support"
    ],
    customizationOptions: [
      "Change text and details",
      "Adjust colors to match your wedding palette",
      "Resize elements as needed",
      "Add or remove design elements",
      "Choose different font combinations"
    ],
    relatedCollections: ["1", "2"]
  }
];

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [collection, setCollection] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // In a real app, this would be an API call
    // For now we'll simulate a network request using setTimeout
    setLoading(true);
    setTimeout(() => {
      const foundCollection = collections.find(c => c.id === id);
      setCollection(foundCollection || null);
      
      if (foundCollection) {
        setSelectedImage(foundCollection.image);
      }
      
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (!collection) return;
    
    addItem({
      id: collection.id,
      title: collection.title,
      price: collection.price,
      image: collection.image
    });
    
    toast("Added to cart", {
      description: `${collection.title} has been added to your cart.`,
      action: {
        label: "View Cart",
        onClick: () => window.location.href = "/checkout"
      }
    });
  };

  const getRelatedCollections = () => {
    if (!collection) return [];
    return collections.filter(c => collection.relatedCollections.includes(c.id));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-12 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-2xl mb-4">Collection Not Found</h2>
        <p className="mb-6">The collection you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/collections">Browse All Collections</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="bg-dark-gray-light py-3">
        <div className="container mx-auto px-4">
          <Link to="/collections" className="text-sm flex items-center text-charcoal-light hover:text-gold transition-colors">
            <ArrowLeft size={14} className="mr-2" /> Back to Collections
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg border border-border">
              <img 
                src={selectedImage} 
                alt={collection.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {collection.gallery.map((img: string, index: number) => (
                <button 
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-[4/3] rounded-md overflow-hidden border ${selectedImage === img ? 'border-gold' : 'border-border'}`}
                >
                  <img 
                    src={img} 
                    alt={`${collection.title} preview ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="font-serif text-3xl mb-3">{collection.title}</h1>
            <p className="text-gold text-xl font-medium mb-4">${collection.price}</p>
            <p className="text-charcoal-light mb-6">{collection.description}</p>
            
            <div className="flex flex-col gap-3 mb-8">
              <Button 
                onClick={handleAddToCart} 
                className="bg-gold hover:bg-gold-dark text-white w-full md:w-auto"
              >
                Add to Cart
              </Button>
            </div>
            
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="features">What's Included</TabsTrigger>
                <TabsTrigger value="customize">Customization</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="py-6">
                <p className="text-charcoal-light">{collection.longDescription}</p>
              </TabsContent>
              
              <TabsContent value="features" className="py-6">
                <ul className="space-y-2">
                  {collection.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="text-gold mt-1 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              
              <TabsContent value="customize" className="py-6">
                <p className="mb-4">All our digital templates are easy to customize:</p>
                <ul className="space-y-2">
                  {collection.customizationOptions.map((option: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check size={16} className="text-gold mt-1 mr-2" />
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Related Collections */}
        <div className="mt-16">
          <h2 className="font-serif text-2xl mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getRelatedCollections().map((relatedItem: any) => (
              <Link 
                key={relatedItem.id}
                to={`/collections/${relatedItem.id}`}
                className="group"
              >
                <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={relatedItem.image} 
                      alt={relatedItem.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-serif text-lg mb-1">{relatedItem.title}</h3>
                    <p className="text-gold font-medium">${relatedItem.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
