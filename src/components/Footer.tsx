import { Link } from "react-router-dom";
import { Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logo.jpg";

export const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[color:var(--noir-800)] border-t border-[color:var(--border)] py-12">
      <div className="container mx-auto px-4">
        {/* SEO-rich footer text */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <p className="text-sm text-parchment leading-relaxed">
            <strong className="text-sand">Stichéra</strong> is your premier destination for exquisite 
            <span className="hidden sm:inline"> leather wallets, premium home decor, stylish furniture, quality accessories, and curated lifestyle products.</span>
            <span className="sm:hidden inline"> premium leather goods and lifestyle products.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="Stichéra - Premium Leather Goods & Lifestyle" className="h-16 w-auto mb-4" />
            <p className="text-sm mb-4 text-parchment italic">Crafted elegance for the discerning connoisseur.</p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/share/1EgybenFiL/" target="_blank" rel="noopener noreferrer" className="text-parchment hover:text-sand transition-colors" aria-label="Visit our Facebook page">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/theshoppingcart.official?igsh=MTMzbGd3ZXhvMHFvbA==" target="_blank" rel="noopener noreferrer" className="text-parchment hover:text-sand transition-colors" aria-label="Visit our Instagram page">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="h-sub mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-parchment">
              <li><Link to="/shop" onClick={handleLinkClick} className="hover:text-sand transition-colors">Shop All Products</Link></li>
              <li><Link to="/blog" onClick={handleLinkClick} className="hover:text-sand transition-colors">Blog</Link></li>
              <li><Link to="/about" onClick={handleLinkClick} className="hover:text-sand transition-colors">About Us</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick} className="hover:text-sand transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="h-sub mb-4">Shop by Category</h4>
            <ul className="space-y-2 text-sm text-parchment">
              <li><Link to="/shop?category=home-decor" onClick={handleLinkClick} className="hover:text-sand transition-colors">Home Decor</Link></li>
              <li><Link to="/shop?category=furniture" onClick={handleLinkClick} className="hover:text-sand transition-colors">Furniture</Link></li>
              <li><Link to="/shop?category=mens-wallets" onClick={handleLinkClick} className="hover:text-sand transition-colors">Men's Wallets</Link></li>
              <li><Link to="/shop?category=womens-wallets" onClick={handleLinkClick} className="hover:text-sand transition-colors">Women's Wallets</Link></li>
              <li><Link to="/shop?category=accessories" onClick={handleLinkClick} className="hover:text-sand transition-colors">Accessories</Link></li>
              <li><Link to="/shop?category=garden-decorations" onClick={handleLinkClick} className="hover:text-sand transition-colors">Garden Decorations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="h-sub mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm text-parchment">
              <li><Link to="/contact" onClick={handleLinkClick} className="hover:text-sand transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[color:var(--border)] mt-8 pt-8 text-center text-sm">
          <p className="text-parchment">&copy; 2025 <span className="text-sand font-semibold">Stichéra</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};