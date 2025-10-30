# Button Styles - Quick Reference Guide

## 🎨 Available Button Classes

### **Primary Liquid Glass Button**
```tsx
className="btn-liquid-primary btn-leather-texture"
```
**Use for**: Buy Now, View Details, Primary CTAs  
**Colors**: Cognac → Gold gradient  
**Effect**: Bright, glowing, premium  

---

### **Secondary Liquid Glass Button**
```tsx
className="btn-liquid-secondary btn-leather-texture"
```
**Use for**: Add to Cart, Secondary actions  
**Colors**: Dark glass with gold accents  
**Effect**: Sophisticated, transparent, refined  

---

## 📍 Where They're Used

### Product Detail Page
- **Add to Cart**: Secondary style + icon pulse
- **Buy Now**: Primary style (most prominent)

### Shop Page (Product Cards)
- **Cart Icon Button**: Secondary style
- **View Button**: Primary style

### Homepage
- **View Details**: Primary style
- **View All Products**: Primary style (large)

---

## 🎯 Visual Effects

### On Hover:
- ✨ Light shimmer sweeps across
- 🌟 Gold glow intensifies
- 📈 Button lifts up 2px
- 💫 Icons pulse and scale
- 🎨 Gradient shifts warmer

### On Click:
- 📉 Button presses down
- 💎 Shadow compresses
- ⚡ Instant tactile feedback

---

## 💡 Pro Tips

1. **Always pair with `.btn-leather-texture`** for brand consistency
2. **Use white text** on primary buttons: `text-white`
3. **Add `.icon-cart`** to cart icons for pulse animation
4. **Set proper heights**: `h-12` or `h-14` for prominence
5. **Use `font-semibold` or `font-bold`** for better visibility

---

## 🎨 Color Psychology

### Primary Button (Cognac/Gold)
- Warm and inviting
- Signals premium quality
- Encourages action
- Stands out prominently

### Secondary Button (Dark Glass)
- Professional and refined
- Subtle but accessible
- Shows sophistication
- Complements primary

---

## 📱 Responsive Sizes

**Mobile**: 48px height (comfortable touch)  
**Desktop**: 56px height (prominent)  
**Cards**: 36-40px (balanced)

---

## ✨ Special Features

### Apple-Style Liquid Glass
- 20px blur effect
- 180% saturation
- Multi-layer shadows
- Inner light reflection

### Leather Texture
- Subtle grain pattern
- 3% opacity overlay
- Authentic material feel
- SVG-based (crisp)

### Smooth Animations
- 400ms transitions
- Cubic-bezier easing
- Hardware accelerated
- 60fps performance

---

## 🚀 Quick Copy-Paste Examples

### Large Primary Button
```tsx
<Button className="btn-liquid-primary btn-leather-texture font-bold text-white h-14 px-8">
  Buy Now
</Button>
```

### Add to Cart Button
```tsx
<Button className="btn-liquid-secondary btn-leather-texture font-semibold h-12">
  <ShoppingCart className="mr-2 h-5 w-5 icon-cart" />
  Add to Cart
</Button>
```

### Product Card Button
```tsx
<Button className="btn-liquid-primary btn-leather-texture font-semibold text-white h-10">
  View Details
</Button>
```

---

**Remember**: These buttons are designed to match Stichéra's premium leather brand aesthetic while providing Apple-quality user experience! 🏆✨
