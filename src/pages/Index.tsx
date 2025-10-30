import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/currency";
import { calculateSalePrice } from "@/lib/saleUtils";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { organizationSchema, websiteSchema, breadcrumbSchema } from "@/lib/structuredData";

const Index = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const { data: banners } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (!banners || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners]);

  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('is_featured', true)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['home-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: sales } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('is_active', true)
        .gt('end_date', new Date().toISOString());
      if (error) throw error;
      return data;
    },
  });

  const activeBanner = banners?.[currentBannerIndex];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema]
  };

  return (
    <>
      <SEOHead
        title="Stichéra – Premium Leather Wallets & Curated Lifestyle Goods"
        description="Discover Stichéra's exquisite collection of handcrafted leather wallets, premium home décor, and refined accessories. Artisanal quality, timeless sophistication."
        keywords={[
          'leather wallets',
          'handcrafted wallets',
          'premium leather goods',
          'luxury wallets',
          'home decor',
          'furniture',
          'lifestyle accessories',
          'Stichéra',
          'artisanal craftsmanship',
          'premium decor',
          'sophisticated accessories',
          'curated lifestyle'
        ]}
        canonicalUrl="https://stichera.shop"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
      
      <main className="flex-1">
        {/* Dynamic Hero Banner */}
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden leather-texture">
          {banners && banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                index === currentBannerIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
              }`}
              style={{ backgroundImage: `url(${banner.image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-leather-espresso/60 via-leather-black/50 to-leather-charcoal/60" />
            </div>
          ))}
          
          {activeBanner && activeBanner.show_text_overlay && (
            <div 
              key={currentBannerIndex}
              className="relative z-10 text-center text-primary-foreground px-4 transition-all duration-700 ease-in-out"
            >
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gold-accent pb-8 animate-fade-in">
                {activeBanner.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in">
                {activeBanner.subtitle}
              </p>
              <div className="animate-fade-in">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to={activeBanner.link_url || '/shop'}>
                    Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
          
          {/* Navigation Dots */}
          {banners && banners.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentBannerIndex
                      ? 'bg-leather-gold w-8 shadow-gold-glow'
                      : 'bg-leather-beige/50 hover:bg-leather-gold/75 w-3'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* Introduction Section for SEO */}
        {/* <section className="py-12 bg-background">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            {/* <p className="text-lg text-muted-foreground leading-relaxed">
              Welcome to <strong>The Shopping Cart</strong> – your trusted online destination for premium <strong>home decor</strong>, 
              elegant <strong>wallets</strong>, stylish <strong>furniture</strong>, quality <strong>accessories</strong>, and beautiful 
              <strong> garden decorations</strong> in Pakistan. Shop with confidence and enjoy fast delivery across the country. 
              TheShoppingCart.shop brings you carefully curated products that blend style, quality, and affordability.
            </p> 
          </div>
        </section> */}

        {/* Shop by Category - Dynamic */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gold-accent pb-8 tracking-tight">
                Curated Collections
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Explore our meticulously selected offerings of premium leather goods, 
                distinguished décor, and refined accessories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories?.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/shop?category=${category.slug}`} 
                  className="group"
                >
                  <Card className="glass-card glass-hover overflow-hidden rounded-xl">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {category.image_url && (
                        <img 
                          src={category.image_url} 
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-leather-espresso/70 via-leather-black/60 to-leather-charcoal/70 group-hover:from-leather-espresso/80 group-hover:via-leather-cognac/60 group-hover:to-leather-charcoal/80 transition-all duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="font-display text-3xl md:text-4xl font-bold text-leather-beige drop-shadow-lg text-center px-4">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges with Shadow Cards */}
        <section className="py-16 bg-leather-smoked/20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card glass-hover rounded-xl border-leather-tan/20">
                <CardContent className="p-6 flex items-center space-x-4">
                  <ShieldCheck className="h-12 w-12 text-leather-gold flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Secure Checkout</h3>
                    <p className="text-sm text-muted-foreground">100% secure payments</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card glass-hover rounded-xl border-leather-tan/20">
                <CardContent className="p-6 flex items-center space-x-4">
                  <CreditCard className="h-12 w-12 text-leather-cognac flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Cash on Delivery</h3>
                    <p className="text-sm text-muted-foreground">Pay when you receive</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card glass-hover rounded-xl border-leather-tan/20">
                <CardContent className="p-6 flex items-center space-x-4">
                  <Truck className="h-12 w-12 text-leather-gold flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Fast Delivery</h3>
                    <p className="text-sm text-muted-foreground">Quick shipping nationwide</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card glass-hover rounded-xl border-leather-tan/20">
                <CardContent className="p-6 flex items-center space-x-4">
                  <Award className="h-12 w-12 text-leather-cognac flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">Premium Quality</h3>
                    <p className="text-sm text-muted-foreground">Handcrafted excellence</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Collection - Dynamic */}
        <section className="py-20 bg-leather-smoked/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-leather-espresso/10 via-transparent to-leather-charcoal/10" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gold-accent pb-8 tracking-tight">
                Signature Pieces
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                Our most coveted selections — handcrafted leather goods and curated essentials 
                for those who value authenticity and timeless design
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {featuredProducts?.map((product) => {
                const productSale = sales?.find(s => s.product_id === product.id);
                const globalSale = sales?.find(s => s.is_global);
                const { finalPrice, discount } = calculateSalePrice(product.price, productSale, globalSale);
                
                return (
                  <Link key={product.id} to={`/product/${product.slug}`} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] min-w-[280px] max-w-[400px] transition-all duration-300 hover:-translate-y-2">
                    <Card className="glass-card overflow-hidden rounded-xl group relative h-full cursor-pointer border-leather-tan/20 hover:border-leather-gold/50 shadow-leather hover:shadow-gold-glow transition-all duration-300">
                      {discount && (
                        <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-destructive to-red-700 text-white font-bold px-3 py-1 shadow-lg animate-pulse">
                          {discount}% OFF
                        </Badge>
                      )}
                      {product.is_featured && !discount && (
                        <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-leather-gold to-leather-cognac text-leather-espresso font-bold px-3 py-1 shadow-lg">
                          <Star className="h-3 w-3 mr-1" fill="currentColor" />
                          Featured
                        </Badge>
                      )}
                      <div className="aspect-square bg-gradient-to-br from-leather-espresso/10 to-leather-charcoal/10 relative overflow-hidden">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-leather-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-6">
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.categories?.name}
                        </p>
                        <h3 className="font-display text-lg font-semibold mb-2 truncate">
                          {product.name}
                        </h3>
                        <div className="mb-4">
                          {discount ? (
                            <div className="flex items-baseline gap-2">
                              <p className="text-2xl font-bold text-destructive">
                                {formatPrice(finalPrice)}
                              </p>
                              <p className="text-sm text-muted-foreground line-through opacity-60">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold bg-gradient-to-r from-leather-gold to-leather-cognac bg-clip-text text-transparent">
                              {formatPrice(product.price)}
                            </p>
                          )}
                        </div>
                        <Button className="w-full btn-liquid-primary btn-leather-texture font-semibold text-white h-10" size="sm">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button asChild size="lg" className="btn-liquid-primary btn-leather-texture font-bold text-white px-8 h-12">
                <Link to="/shop">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;