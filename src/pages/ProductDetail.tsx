import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Minus, Plus, ShoppingCart, X, Star, ShieldCheck, Truck, Banknote, Package, Cpu, Zap, CreditCard, Gift, Heart, Sparkles, Ruler, Recycle, Leaf, PackageCheck } from "lucide-react";
import { addToGuestCart } from "@/lib/cartUtils";
import { formatPrice } from "@/lib/currency";
import { LoadingScreen } from "@/components/LoadingScreen";
import { calculateSalePrice } from "@/lib/saleUtils";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import { organizationSchema, productSchema, breadcrumbSchema } from "@/lib/structuredData";
import ProductReviews from "@/components/ProductReviews";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ProductDetail = ({ key }: { key?: string }) => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  const { toast } = useToast();
  const [showSticky, setShowSticky] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'care'>('details');
  const [addGiftNote, setAddGiftNote] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Reset component state when slug changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
    setSelectedVariation(null);
    
    // Invalidate all queries to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['product', slug] });
    queryClient.invalidateQueries({ queryKey: ['product-variations'] });
    queryClient.invalidateQueries({ queryKey: ['related-products'] });
  }, [slug, queryClient]);

  // Sticky purchase bar after 40% scroll
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      setShowSticky(scrolled / Math.max(height, 1) > 0.4);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*, categories(*)").eq("slug", slug).single();
      if (error) throw error;
      return data;
    },
  });

  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("is_active", true)
        .gt("end_date", new Date().toISOString());
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.category_id],
    queryFn: async () => {
      if (!product?.category_id) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(*)")
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .limit(4);
      if (error) throw error;
      return data;
    },
    enabled: !!product,
  });

  const { data: variations } = useQuery({
    queryKey: ["product-variations", product?.id],
    queryFn: async () => {
      if (!product?.id) return [];
      const { data, error } = await supabase
        .from("product_variations")
        .select("*")
        .eq("product_id", product.id)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!product,
  });

  // Set first variation as default when variations load
  useEffect(() => {
    if (variations && variations.length > 0 && !selectedVariation) {
      setSelectedVariation(variations[0]);
    }
  }, [variations, selectedVariation]);

  const addToCart = useMutation({
    mutationFn: async () => {
      // Determine the price to use (variation price or product price)
      const priceToUse = selectedVariation ? selectedVariation.price : product.price;

      if (user) {
        // Check if item already exists in cart (considering variation)
        const { data: existingItems } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", product.id);

        let existingItem = null;
        if (existingItems && existingItems.length > 0) {
          // Find exact match including variation
          existingItem = existingItems.find(item => 
            item.variation_id === (selectedVariation?.id || null)
          );
        }

        if (existingItem) {
          // Update quantity of existing item
          const { error } = await supabase
            .from("cart_items")
            .update({ quantity: existingItem.quantity + quantity })
            .eq("id", existingItem.id);
          if (error) throw error;
        } else {
          // Insert new cart item
          const { error } = await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: product.id,
            quantity,
            variation_id: selectedVariation?.id || null,
            variation_name: selectedVariation?.name || null,
            variation_price: selectedVariation?.price || null,
          });
          if (error) throw error;
        }
      } else {
        // Guest cart
        addToGuestCart({
          product_id: product.id,
          quantity,
          product_name: product.name,
          product_price: product.price,
          product_image: product.images?.[0],
          variation_id: selectedVariation?.id || null,
          variation_name: selectedVariation?.name || null,
          variation_price: selectedVariation?.price || null,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // Calculate sale price for tracking (use variation price if selected)
      const basePrice = selectedVariation ? selectedVariation.price : product.price;
      const productSale = sales?.find((s) => s.product_id === product.id);
      const globalSale = sales?.find((s) => s.is_global);
      const { finalPrice } = calculateSalePrice(basePrice, productSale, globalSale);

      toast({
        title: "Added to cart",
        description: "Product has been added to your cart.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBuyNow = async () => {
    await addToCart.mutateAsync();
    navigate("/checkout");
  };

  // Calculate sale price (needed for tracking)
  // Use variation price if selected, otherwise use product price
  const displayPrice = selectedVariation ? selectedVariation.price : product?.price || 0;
  const productSale = sales?.find((s) => s.product_id === product?.id);
  const globalSale = sales?.find((s) => s.is_global);
  const applySaleToVariation = selectedVariation ? selectedVariation.apply_sale !== false : true;
  const { finalPrice, discount } = calculateSalePrice(displayPrice, productSale, globalSale, applySaleToVariation);
  
  // Calculate total price (finalPrice * quantity)
  const totalPrice = finalPrice * quantity;


  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingScreen message="Loading product details..." />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images || [];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationSchema,
      productSchema({
        name: product.name,
        description: product.description || product.name,
        price: finalPrice,
        images: productImages,
        sku: product.sku,
        stock_quantity: product.stock_quantity,
      }),
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Shop", url: "/shop" },
        ...(product.categories
          ? [{ name: product.categories.name, url: `/shop?category=${product.categories.slug}` }]
          : []),
        { name: product.name, url: `/product/${product.slug}` },
      ]),
    ],
  };

  return (
    <>
      <SEOHead
        title={product.meta_title || `${product.name} | Buy Online at The Shopping Cart`}
        description={
          product.meta_description ||
          product.description ||
          `Buy ${product.name} online in Pakistan. Premium quality products at TheShoppingCart.shop with fast delivery.`
        }
        keywords={product.focus_keywords || [product.name, product.categories?.name || "", "buy online Pakistan"]}
        canonicalUrl={`https://theshoppingcart.shop/product/${product.slug}`}
        ogImage={productImages[0]}
        ogType="product"
        structuredData={structuredData}
      />

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 py-8 md:py-12 st-noir-soft">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Media Gallery */}
              <div className="space-y-3 md:space-y-4">
                {/* Media Carousel (Video + Images) */}
                {(product.video_url || (product.images && product.images.length > 0)) &&
                (product.video_url ? 1 : 0) + (product.images?.length || 0) > 1 ? (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {/* Video as first carousel item */}
                      {product.video_url && (
                        <CarouselItem key="video">
                          <div className="aspect-square rounded-xl2 overflow-hidden border border-[color:var(--border)] bg-[color:var(--noir-800)] shadow-luxe">
                            <video
                              src={product.video_url}
                              controls
                              className="w-full h-full object-contain"
                              poster={product.images?.[0]}
                            >
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        </CarouselItem>
                      )}
                      {/* Images as subsequent carousel items */}
                      {product.images?.map((image, index) => (
                        <CarouselItem key={`image-${index}`}>
                          <div
                            className="aspect-square rounded-xl2 overflow-hidden cursor-zoom-in border border-[color:var(--border)] bg-[color:var(--noir-800)] shadow-luxe transition-all duration-300 st-animated-border"
                            onClick={() => {
                              setSelectedImageIndex(index);
                              setZoomDialogOpen(true);
                            }}
                          >
                            <img
                              src={image}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                ) : (
                  /* Single item display */
                  <>
                    {product.video_url ? (
                      <div className="aspect-square rounded-xl2 overflow-hidden border border-[color:var(--border)] bg-[color:var(--noir-800)] shadow-luxe">
                        <video
                          src={product.video_url}
                          controls
                          className="w-full h-full object-cover"
                          poster={product.images?.[0]}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : product.images?.[0] ? (
                      <div
                        className="aspect-square rounded-xl2 overflow-hidden cursor-zoom-in border border-[color:var(--border)] bg-[color:var(--noir-800)] shadow-luxe transition-all duration-300 st-animated-border"
                        onClick={() => {
                          setSelectedImageIndex(0);
                          setZoomDialogOpen(true);
                        }}
                      >
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="p-6 md:p-8 rounded-xl2 border border-[color:var(--border)] bg-[color:var(--noir-800)] shadow-soft st-animated-border">
                  <p className="h-sub mb-2">{product.categories?.name}</p>
                  {product.sku && <p className="text-xs md:text-sm text-text-muted mb-3">SKU: <span className="text-sand font-medium">{product.sku}</span></p>}
                  <h1 className="h-title text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-sand leading-tight">
                    {product.name}
                  </h1>
                  {discount ? (
                    <div className="space-y-3">
                      <Badge variant="sale" className="px-4 py-2 text-sm shadow-soft">{discount}% OFF SALE</Badge>
                      <div className="flex items-baseline gap-3">
                        <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-sand">{formatPrice(totalPrice)}</p>
                        <p className="text-lg md:text-xl text-text-muted line-through opacity-60">
                          {formatPrice(displayPrice * quantity)}
                        </p>
                      </div>
                      {quantity > 1 && (
                        <p className="text-sm text-text-muted">
                          {formatPrice(finalPrice)} × {quantity}
                        </p>
                      )}
                    </div>
                   ) : (
                    <div>
                      <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-sand">{formatPrice(totalPrice)}</p>
                      {quantity > 1 && (
                        <p className="text-sm text-text-muted mt-1">
                          {formatPrice(displayPrice)} × {quantity}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Feature Chips */}
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 reveal-up">
                  {[{label:'NFC Smart Chip', Icon:Cpu},{label:'RFID Shield', Icon:ShieldCheck},{label:'Magnetic Flap', Icon:Zap},{label:'Handcrafted', Icon:Sparkles}].map(({label, Icon},i)=> (
                    <li key={i} className="flex items-center gap-2 rounded-xl2 border border-[color:var(--border)] bg-[color:var(--noir-800)] px-3 py-2 text-parchment hover:bg-[color:var(--noir-800)]/80 transition-colors">
                      <Icon className="w-4 h-4 text-[color:var(--cognac)]" />
                      <span className="text-xs sm:text-sm">{label}</span>
                    </li>
                  ))}
                </ul>

                {product.stock_quantity !== undefined && product.stock_quantity < 10 && (
                  <div className="glass-card border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl p-4 animate-pulse">
                    {product.stock_quantity > 0 ? (
                      <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                        🔥 Hurry! Only {product.stock_quantity} {product.stock_quantity === 1 ? "item" : "items"} left in
                        stock!
                      </p>
                    ) : (
                      <p className="text-sm font-bold text-destructive">❌ Out of stock</p>
                    )}
                  </div>
                )}

                {variations && variations.length > 0 && (
                  <div>
                    <h2 className="font-semibold text-base md:text-lg mb-3">Select Variation</h2>
                    <div className="flex flex-wrap gap-3">
                      {variations.map((variation) => {
                        const varSale = sales?.find((s) => s.product_id === product?.id);
                        const varGlobalSale = sales?.find((s) => s.is_global);
                        const varApplySale = variation.apply_sale !== false;
                        const { finalPrice: varFinalPrice, discount: varDiscount } = calculateSalePrice(
                          variation.price,
                          varSale,
                          varGlobalSale,
                          varApplySale
                        );
                        
                        return (
                          <button
                            key={variation.id}
                            onClick={() => {
                              setSelectedVariation(variation);
                              setQuantity(1);
                            }}
                            className={`
                              relative px-4 py-3 rounded-xl transition-all duration-200
                              ${selectedVariation?.id === variation.id
                                ? 'bg-primary text-primary-foreground shadow-lg scale-105 ring-2 ring-primary ring-offset-2'
                                : 'bg-card border-2 border-border hover:border-primary hover:shadow-md'
                              }
                            `}
                          >
                            <div className="text-center space-y-1">
                              <div className="font-semibold text-sm">{variation.name}</div>
                              {varDiscount ? (
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold">{formatPrice(varFinalPrice)}</div>
                                  <div className="text-xs line-through opacity-60">{formatPrice(variation.price)}</div>
                                </div>
                              ) : (
                                <div className="text-xs font-medium">{formatPrice(variation.price)}</div>
                              )}
                            </div>
                            {varDiscount && (
                              <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                -{varDiscount}%
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="font-semibold text-base md:text-lg mb-2">Quantity</h2>
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <Button
                      variant="outlineGold"
                      size="icon"
                      className="h-9 w-9 md:h-10 md:w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <span className="text-lg md:text-xl font-semibold w-10 md:w-12 text-center">{quantity}</span>
                    <Button
                      variant="outlineGold"
                      size="icon"
                      className="h-9 w-9 md:h-10 md:w-10"
                      onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
                      disabled={product.stock_quantity === 0}
                    >
                      <Plus className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-2 md:pt-4">
                  <Button
                    variant="outlineGold"
                    className="w-full text-sm md:text-base h-12 md:h-14 font-semibold"
                    size="lg"
                    onClick={() => addToCart.mutate()}
                    disabled={addToCart.isPending || product.stock_quantity === 0}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 md:h-6 md:w-6 icon-cart" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full text-sm md:text-base h-12 md:h-14 font-bold text-white"
                    size="lg"
                    onClick={handleBuyNow}
                    disabled={addToCart.isPending || product.stock_quantity === 0}
                  >
                    Buy Now
                  </Button>
                </div>
                {/* Trust Badges */}
                <div className="grid grid-cols-2 gap-4 py-6 border-y border-[color:var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[color:var(--noir-800)] border border-[color:var(--border)] flex items-center justify-center shadow-soft">
                      <ShieldCheck className="h-5 w-5 text-[color:var(--cognac)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight text-sand">7 Day Easy</p>
                      <p className="text-xs text-parchment leading-tight">Return</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[color:var(--noir-800)] border border-[color:var(--border)] flex items-center justify-center shadow-soft">
                      <Banknote className="h-5 w-5 text-[color:var(--cognac)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight text-sand">Cash on</p>
                      <p className="text-xs text-parchment leading-tight">Delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[color:var(--noir-800)] border border-[color:var(--border)] flex items-center justify-center shadow-soft">
                      <Truck className="h-5 w-5 text-[color:var(--cognac)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight text-sand">Free Delivery</p>
                      <p className="text-xs text-parchment leading-tight">All Pakistan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[color:var(--noir-800)] border border-[color:var(--border)] flex items-center justify-center shadow-soft">
                      <Package className="h-5 w-5 text-[color:var(--cognac)]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold leading-tight text-sand">100% Original</p>
                      <p className="text-xs text-parchment leading-tight">Products</p>
                    </div>
                  </div>
                </div>
                {product.description && (
                  <div className="p-6 rounded-xl2 border border-[color:var(--border)] bg-[color:var(--noir-800)] reveal-in">
                    <h2 className="h-title text-2xl text-sand mb-4">Product Details</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['details','shipping','care'].map((t) => (
                        <button key={t} onClick={() => setActiveTab(t as any)} className={`px-3 py-1.5 rounded-full text-xs border ${activeTab===t? 'bg-[color:var(--noir-800)] text-sand border-[color:var(--border)]' : 'text-parchment border-[color:var(--border)]/60 hover:border-[color:var(--border)]'}`}>{t.toUpperCase()}</button>
                      ))}
                    </div>
                    {activeTab==='details' && (
                      <p className="text-sm md:text-base text-text-muted leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    )}
                    {activeTab==='shipping' && (
                      <div className="text-sm md:text-base text-text-muted leading-relaxed">
                        • Free delivery across Pakistan within 2–4 business days.<br/>
                        • Cash on Delivery available nationwide.<br/>
                        • Orders ship in a magnetic gift box with protective wraps.
                      </div>
                    )}
                    {activeTab==='care' && (
                      <div className="text-sm md:text-base text-text-muted leading-relaxed">
                        • Keep away from prolonged moisture and heat.<br/>
                        • Clean using a dry microfiber cloth; apply neutral leather balm occasionally.<br/>
                        • Store in the included dust sleeve when not in use.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Smart Wallet */}
            <section className="mt-14 rounded-xl2 border border-[color:var(--border)] bg-[color:var(--noir-800)] p-6 st-animated-border">
              <h2 className="h-title text-2xl text-sand mb-3">Tap. Connect. Impress.</h2>
              <p className="text-text-muted">Tap your wallet to any NFC-enabled phone to open your digital profile.</p>
            </section>

            {/* Craftsmanship Section */}
            <section className="mt-10 overflow-hidden rounded-xl2 border border-[color:var(--border)] relative reveal-in st-animated-border">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
              <div className="w-full h-[320px] sm:h-[420px] bg-[radial-gradient(1200px_600px_at_30%_-10%,#2B1D15_0%,#141212_45%,#0E0E0E_100%)] st-grain" />
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
                <h3 className="h-title text-2xl sm:text-3xl text-sand mb-2">12 stages of hand‑finishing.</h3>
                <p className="text-parchment max-w-2xl">European hides. Edge burnished. Thread-locked. Built to outlast trends.</p>
              </div>
            </section>

            {/* Packaging & Gifting */}
            <section className="mt-10 rounded-xl2 border border-[color:var(--border)] bg-[color:var(--noir-800)] p-6 reveal-up st-animated-border">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="h-title text-2xl text-sand">Packaging & Gifting</h3>
                <button onClick={() => setAddGiftNote(!addGiftNote)} className="px-3 py-1.5 rounded-full text-xs border border-[color:var(--border)] text-parchment hover:bg-[color:var(--noir-800)]">{addGiftNote? 'Remove Gift Note' : 'Add Gift Note'}</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--noir-900)]/40 aspect-video" />
                <div>
                  <p className="text-text-muted mb-3">Presented in a magnetic gift box with soft-touch insert and dust sleeve.</p>
                  {addGiftNote && (
                    <textarea rows={4} className="w-full rounded-xl2 bg-[color:var(--noir-900)] border border-[color:var(--border)] p-3 text-parchment placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--cognac)]" placeholder="Write a short message to include with your order" />
                  )}
                </div>
              </div>
            </section>

            {/* Customer Reviews */}
            <div className="mt-12 md:mt-20">
              <ProductReviews productId={product.id} />
            </div>

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-12 md:mt-20">
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 gold-accent pb-6">
                    You May Also Like
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Discover more from our curated collection
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((relatedProduct) => {
                    const relatedProductSale = sales?.find((s) => s.product_id === relatedProduct.id);
                    const relatedGlobalSale = sales?.find((s) => s.is_global);
                    const { finalPrice: relatedFinalPrice, discount: relatedDiscount } = calculateSalePrice(
                      relatedProduct.price,
                      relatedProductSale,
                      relatedGlobalSale,
                    );

                    return (
                      <Card
                        key={relatedProduct.id}
                        className="overflow-hidden rounded-xl2 relative border border-[color:var(--border)] hover:shadow-luxe transition-all duration-300 group cursor-pointer bg-[color:var(--noir-800)]"
                      >
                        {relatedDiscount && (
                          <Badge variant="sale" className="absolute top-3 left-3 z-10 px-3 py-1 shadow-soft">
                            {relatedDiscount}% OFF
                          </Badge>
                        )}
                        <div className="aspect-square relative overflow-hidden bg-[radial-gradient(600px_300px_at_50%_-20%,#2B1D15_0%,#0E0E0E_70%)]">
                          {relatedProduct.images?.[0] && (
                            <>
                              <img
                                src={relatedProduct.images[0]}
                                alt={relatedProduct.name}
                                className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                              />
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                          )}
                        </div>
                        <CardContent className="p-3 md:p-4">
                          <h3 className="h-title text-sm md:text-base font-semibold text-sand mb-1 md:mb-2 truncate">
                            {relatedProduct.name}
                          </h3>
                          <div className="mb-2 md:mb-3">
                            {relatedDiscount ? (
                              <div className="flex items-baseline gap-2">
                                <p className="text-lg md:text-xl font-bold text-sand">
                                  {formatPrice(relatedFinalPrice)}
                                </p>
                                <p className="text-xs text-text-muted line-through opacity-60">
                                  {formatPrice(relatedProduct.price)}
                                </p>
                              </div>
                            ) : (
                              <p className="text-lg md:text-xl font-bold text-sand">
                                {formatPrice(relatedProduct.price)}
                              </p>
                            )}
                          </div>
                          <Button 
                            asChild 
                            variant="primary"
                            className="w-full text-xs md:text-sm font-semibold text-white" 
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              // Force a full page reload to ensure fresh data
                              window.location.href = `/product/${relatedProduct.slug}`;
                            }}
                          >
                            <Link to={`/product/${relatedProduct.slug}`} onClick={(e) => e.preventDefault()}>
                              View Details
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Sticky Purchase Bar */}
        {product && showSticky && (
          <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[min(980px,92%)] rounded-2xl bg-[color:var(--noir-800)]/85 backdrop-blur border border-[color:var(--border)] shadow-luxe p-3 reveal-up">
            <div className="flex items-center gap-3">
              {product.images?.[0] && (
                <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded-md object-cover border border-[color:var(--border)]" loading="lazy" decoding="async" />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-parchment">{product.name}</p>
                <p className="text-sand font-semibold text-base">{formatPrice(finalPrice)}</p>
              </div>
              <Button variant="primary" size="lg" className="h-11 px-6" onClick={handleBuyNow}>Buy Now</Button>
            </div>
          </div>
        )}

        {/* Image Zoom Dialog */}
        <Dialog open={zoomDialogOpen} onOpenChange={setZoomDialogOpen}>
          <DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 rounded-full bg-background/80 hover:bg-background"
              onClick={() => setZoomDialogOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            {product.images && product.images[selectedImageIndex] && (
              <img
                src={product.images[selectedImageIndex]}
                alt={`${product.name} ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
