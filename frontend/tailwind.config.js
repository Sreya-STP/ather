/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b9fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        accent: {
          purple: "#8b5cf6",
          pink:   "#ec4899",
          cyan:   "#06b6d4",
          emerald:"#10b981",
          amber:  "#f59e0b",
          rose:   "#f43f5e",
        },
        surface: {
          DEFAULT: "#ffffff",
          dark:    "#0f0f11",
          "dark-card": "#18181b",
          "dark-border":"#27272a",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease forwards",
        "fade-in":    "fadeIn 0.3s ease forwards",
        "slide-right":"slideRight 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow":  "spin 8s linear infinite",
        "float":      "float 6s ease-in-out infinite",
        "shimmer":    "shimmer 1.8s linear infinite",
        "gradient":   "gradient 8s ease infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity:"0", transform:"translateY(20px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        fadeIn:    { "0%": { opacity:"0" }, "100%": { opacity:"1" } },
        slideRight:{ "0%": { opacity:"0", transform:"translateX(-20px)" }, "100%": { opacity:"1", transform:"translateX(0)" } },
        float:     { "0%,100%": { transform:"translateY(0px)" }, "50%": { transform:"translateY(-12px)" } },
        shimmer:   { "0%": { backgroundPosition:"-400px 0" }, "100%": { backgroundPosition:"400px 0" } },
        gradient:  { "0%,100%": { backgroundPosition:"0% 50%" }, "50%": { backgroundPosition:"100% 50%" } },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
        "gradient-dark":  "linear-gradient(135deg, #0f0f11 0%, #18181b 100%)",
        "gradient-card":  "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)",
        "mesh-gradient":  "radial-gradient(at 40% 20%, hsla(240,100%,70%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(270,100%,70%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340,100%,70%,0.1) 0px, transparent 50%)",
      },
      boxShadow: {
        "brand-glow": "0 0 30px rgba(99,102,241,0.35)",
        "card":       "0 4px 24px rgba(0,0,0,0.08)",
        "card-dark":  "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(99,102,241,0.2)",
      },
    },
  },
  plugins: [],
};
