
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ComingSoon from "@/components/ui/ComingSoon";

// Mock data - would come from API in production
const collectionsData = [
  {
    id: "1",
    title: "Elegant Florals",
    description: "Romantic floral invitation designs with delicate illustration",
    image: "https://plus.unsplash.com/premium_photo-1676836153320-bb844231a5c7?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZWxlZ2FudCUyMGZsb3JhbHN8ZW58MHx8MHx8fDA%3D",
    price: 39.99,
    category: "Floral"
  },
  {
    id: "2",
    title: "Modern Minimalist",
    description: "Clean, contemporary designs with stylish typography",
    image: "https://plus.unsplash.com/premium_photo-1673548916575-c86ff6a1dbd3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZXJuJTIwbWluaW1hbGlzdHxlbnwwfHwwfHx8MA%3D%3D",
    price: 34.99,
    category: "Minimalist"
  },
  {
    id: "3",
    title: "Rustic Charm",
    description: "Warm, natural designs with a handcrafted feel",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 29.99,
    category: "Rustic"
  },
  {
    id: "4",
    title: "Art Deco Glamour",
    description: "Bold geometric patterns and vintage-inspired elegance",
    image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 44.99,
    category: "Vintage"
  },
  {
    id: "5",
    title: "Bohemian Dreams",
    description: "Free-spirited designs with whimsical elements",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 36.99,
    category: "Bohemian"
  },
  {
    id: "6",
    title: "Classic Romance",
    description: "Timeless designs with elegant calligraphy",
    image: "https://images.unsplash.com/photo-1511184150666-9bb7d41a88f4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    price: 39.99,
    category: "Classic"
  }
];

const categories = ["All", "Floral", "Minimalist", "Rustic", "Vintage", "Bohemian", "Classic"];

const CollectionsPage = () => {
  const [collections, setCollections] = useState(collectionsData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setCollections(collectionsData);
    } else {
      setCollections(collectionsData.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory]);

  // return (
  //   <div>
  //     {/* Hero Section */}
  //     <section className="bg-cream py-16">
  //       <div className="container mx-auto px-4">
  //         <div className="max-w-3xl mx-auto text-center">
  //           <h1 className="font-display text-4xl md:text-5xl mb-6">Digital Collections</h1>
  //           <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
  //           <p className="text-lg text-charcoal-light">
  //             Browse our curated collection of premium digital wedding invitation designs, 
  //             ready to be customized for your special day.
  //           </p>
  //         </div>
  //       </div>
  //     </section>

  //     <section className="py-12 bg-white">
  //       <div className="container mx-auto px-4">
  //         {/* Categories Filter */}
  //         <div className="mb-8 overflow-x-auto">
  //           <div className="flex space-x-2 min-w-max pb-2">
  //             {categories.map(category => (
  //               <Button
  //                 key={category}
  //                 variant={selectedCategory === category ? "default" : "outline"}
  //                 onClick={() => setSelectedCategory(category)}
  //                 className={selectedCategory === category ? "bg-gold hover:bg-gold-dark text-white" : ""}
  //               >
  //                 {category}
  //               </Button>
  //             ))}
  //           </div>
  //         </div>

  //         {loading ? (
  //           <div className="flex justify-center py-20">
  //             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
  //           </div>
  //         ) : (
  //           <>
  //             {collections.length === 0 ? (
  //               <div className="text-center py-20">
  //                 <h3 className="font-serif text-xl mb-2">No Collections Found</h3>
  //                 <p className="text-charcoal-light mb-6">
  //                   No collections found in this category. Try selecting a different category.
  //                 </p>
  //                 <Button onClick={() => setSelectedCategory("All")}>View All Collections</Button>
  //               </div>
  //             ) : (
  //               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
  //                 {collections.map((collection) => (
  //                   <Link 
  //                     key={collection.id}
  //                     to={`/collections/${collection.id}`}
  //                     className="group transition-all duration-300 hover:-translate-y-1"
  //                   >
  //                     <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow h-full">
  //                       <div className="aspect-[4/3] overflow-hidden">
  //                         <img 
  //                           src={collection.image} 
  //                           alt={collection.title}
  //                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  //                         />
  //                       </div>
  //                       <CardContent className="p-6">
  //                         <h3 className="font-serif text-xl mb-2">{collection.title}</h3>
  //                         <p className="text-charcoal-light text-sm mb-3">
  //                           {collection.description}
  //                         </p>
  //                         <p className="text-gold font-medium">${collection.price}</p>
  //                       </CardContent>
  //                     </Card>
  //                   </Link>
  //                 ))}
  //               </div>
  //             )}
  //           </>
  //         )}
  //       </div>
  //     </section>

  //     {/* CTA Section */}
  //     <section className="py-16 bg-cream-light">
  //       <div className="container mx-auto px-4 text-center">
  //         <h2 className="font-serif text-3xl mb-6">Need Something Custom?</h2>
  //         <p className="max-w-xl mx-auto mb-8">
  //           Can't find exactly what you're looking for? We also offer custom designs tailored to your specific needs.
  //         </p>
  //         <Button asChild className="bg-gold hover:bg-gold-dark text-white">
  //           <Link to="/contact">
  //             Contact Us
  //           </Link>
  //         </Button>
  //       </div>
  //     </section>
  //   </div>
  // );
  return <ComingSoon />
};

export default CollectionsPage;
