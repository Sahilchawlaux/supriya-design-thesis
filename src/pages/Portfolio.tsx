import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { usePortfolioItems } from "@/hooks/usePortfolioItems";

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];

const Portfolio = () => {
  const { data: portfolioItems, isLoading } = usePortfolioItems();
  const [filter, setFilter] = useState<string>("All");
  
  const filteredItems = filter === "All" 
    ? portfolioItems 
    : portfolioItems?.filter(item => item.category === filter);

  const categories = useMemo(() => {
    if (!portfolioItems) return ['All'];
    const uniqueCategories = [...new Set(portfolioItems.map(item => item.category))];
    return ['All', ...uniqueCategories];
  }, [portfolioItems]);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">Our Portfolio</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of custom digital designs created for special occasions and events.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-12 overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  className={filter === category 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground hover:bg-secondary border-border"}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="portfolio-grid">
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item.id} className="portfolio-item overflow-hidden border border-border bg-card">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <span className="inline-block px-3 py-1 bg-secondary text-xs rounded-full">
                      {item.category}
                    </span>
                  </CardContent>
                  <CardFooter className="px-6 py-4 bg-secondary/50 flex justify-between items-center">
                    <Button variant="link" className="text-primary p-0">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center py-12 text-muted-foreground">
                No portfolio items found for the selected category.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Portfolio;
