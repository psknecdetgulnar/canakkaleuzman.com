import type { Config } from "tailwindcss";

/**
 * Design.md §10: Yalnızca aşağıdaki tokenlar kullanılır.
 * Varsayılan renk paleti tamamen değiştirilir — bg-blue-500 gibi sınıflar
 * projede mevcut olmaz. Yuvarlak köşe yok (radius = 2px), gölge yok.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    // Varsayılan paleti tamamen ez: yalnızca tasarım tokenları.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ink: "#14181C",
      strait: "#1F3A46",
      limestone: "#EDE9E2",
      bronze: "#8A6A3B",
      paper: "#FAF9F7",
      hairline: "rgba(20, 24, 28, 0.08)",
      muted: "rgba(20, 24, 28, 0.56)",
    },
    borderRadius: {
      none: "0",
      DEFAULT: "2px",
      full: "9999px", // yalnızca focus/erişilebilirlik gerekirse
    },
    boxShadow: {
      none: "none",
    },
    extend: {
      fontFamily: {
        display: ["Newsreader", "Georgia", "serif"],
        body: ["'Inter Tight'", "-apple-system", "sans-serif"],
      },
      fontSize: {
        xs: "0.8125rem",
        sm: "0.9375rem",
        base: "1.0625rem",
        lg: "1.375rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      lineHeight: {
        tight: "1.15",
        body: "1.6",
      },
      maxWidth: {
        measure: "1080px",
        prose: "68ch",
      },
      spacing: {
        gutter: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
