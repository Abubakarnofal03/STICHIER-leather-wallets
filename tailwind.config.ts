import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", ...fontFamily.serif],
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        // Premium Leather Brand Palette
        leather: {
          espresso: '#2B1D13',
          black: '#0F0F0F',
          cognac: '#B97745',
          beige: '#E7D3B6',
          gold: '#C6A664',
          charcoal: '#3C3C3C',
          bone: '#F5F3EE',
          smoked: '#1C140F',
          rust: '#8B3E2F',
          ash: '#B4A79A',
          tan: '#5B4A3A',
          olive: '#A68C43',
          taupe: '#574E47',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Stichéra Noir variables
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        // border is already defined above for shadcn; keep mapping by variable for utilities
        accent: "var(--accent)",
        "accent-2": "var(--accent-2)",
        sand: "var(--sand)",
        parchment: "var(--parchment)",
      },
      backgroundImage: {
        'leather-deep': 'linear-gradient(135deg, #2B1D13 0%, #0F0F0F 50%, #3C3C3C 100%)',
        'tan-glow': 'linear-gradient(45deg, #B97745 0%, #C6A664 100%)',
        'beige-mist': 'linear-gradient(to bottom, #E7D3B6 0%, #F5F3EE 100%)',
        'btn-grad': 'linear-gradient(135deg, var(--cognac) 0%, var(--chestnut) 100%)',
        'noir-grad': 'radial-gradient(1200px 600px at 30% -10%, #2B1D15 0%, #141212 45%, #0E0E0E 100%)',
      },
      boxShadow: {
        'leather': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'gold-glow': '0 0 10px rgba(198, 166, 100, 0.4)',
        'leather-inner': 'inset 0 2px 6px rgba(0, 0, 0, 0.3)',
        luxe: 'var(--shadow-xl)',
        soft: 'var(--shadow-soft)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl2: "1.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
