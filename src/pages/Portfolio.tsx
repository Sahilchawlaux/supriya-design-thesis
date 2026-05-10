import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

      <div className="bg-[#0C0C0C] py-20">
        <div className="container mx-auto px-4">
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
                          : "bg-transparent text-white border border-white/40 hover:bg-white/15 hover:border-white/60 hover:!text-white"
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
                    <Dialog key={item.id}>
                      <DialogTrigger asChild>
                        <Card
                          className="portfolio-item overflow-hidden border-0 rounded-[12px] bg-[#0C0C0C] shadow-none cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                        >
                          <div className="aspect-[3/5.28] w-[85%] max-w-full mx-auto overflow-hidden rounded-[12px] border border-white/15">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover object-center block rounded-[12px]"
                            />
                          </div>
                          <CardContent className="p-5 pt-6 pb-6 bg-[#0C0C0C] text-center rounded-b-none">
                            <h3 className="text-white text-xl font-bold mb-3 tracking-tight">
                              {item.title}
                            </h3>
                            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium text-black bg-[#E8E0D0]">
                              {item.category}
                            </span>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="w-[90vw] sm:max-w-[40vw] max-h-[90vh] overflow-y-auto bg-[#0C0C0C] border-white/20 text-white p-6 md:p-8">
                        <DialogHeader className="mb-4">
                          <DialogTitle className="text-3xl font-serif text-white">{item.title}</DialogTitle>
                          <DialogDescription className="text-gray-400 text-base mt-2">
                            {item.category}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center">
                          <div className="w-full relative rounded-[12px] overflow-hidden border border-white/15 bg-black/50">
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full max-h-[55vh] object-contain"
                            />
                          </div>
                          {item.description && (
                            <p className="mt-6 text-gray-300 text-center text-sm md:text-base leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))
                ) : (
                  <p className="col-span-full text-center py-12 text-gray-400">
                    No portfolio items found for the selected category.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
