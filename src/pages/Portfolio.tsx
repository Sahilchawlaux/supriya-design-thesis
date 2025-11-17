import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { usePortfolioItems } from "@/hooks/usePortfolioItems";
import heroBackground from "@/assets/hero-background.jpg";

type PortfolioItem = Database["public"]["Tables"]["portfolio_items"]["Row"];

const Portfolio = () => {
  const { data: portfolioItems, isLoading } = usePortfolioItems();
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(() => {
    if (!portfolioItems) return ["All"];

    // Extract main categories from hierarchical category strings
    const mainCategories = portfolioItems.map((item) => {
      const [mainCategory] = item.category.split(" > ");
      return mainCategory;
    });

    const uniqueMainCategories = [...new Set(mainCategories)];
    return ["All", ...uniqueMainCategories];
  }, [portfolioItems]);

  const filteredItems = useMemo(() => {
    if (!portfolioItems) return [];
    if (filter === "All") return portfolioItems;

    return portfolioItems.filter((item) => {
      const [mainCategory] = item.category.split(" > ");
      return mainCategory === filter;
    });
  }, [portfolioItems, filter]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBackground}
            alt="Elegant floral background with dark botanical design"
            className="w-full h-full object-cover object-center opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-gray/60 via-dark-gray/40 to-dark-gray/70"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight text-white">
              Our Portfolio
            </h1>
            <div className="w-48 h-1 bg-gold mx-auto mb-8"></div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Explore our collection of custom digital designs created for
              special occasions and events.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-20">
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
                    className={`rounded-12 ${
                      filter === category
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary border-border"
                    }`}
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
                  <Card
                    key={item.id}
                    className="portfolio-item overflow-hidden border border-border bg-card rounded-12"
                  >
                    <div className="aspect-square overflow-hidden rounded-t-12">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-serif text-xl mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {(() => {
                          const [mainCategory, subCategory] =
                            item.category.split(" > ");
                          return (
                            <>
                              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs rounded-12">
                                {mainCategory}
                              </span>
                              {subCategory && (
                                <span className="inline-block px-3 py-1 bg-secondary text-xs rounded-12">
                                  {subCategory}
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
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
    </div>
  );
};

export default Portfolio;
