/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // 紧凑字号刻度：整体比 tailwind 默认小一档，让内容区容纳更多信息
    fontSize: {
      '2xs': ['0.625rem', '0.875rem'],
      xs: ['0.6875rem', '1rem'],
      sm: ['0.8125rem', '1.2rem'],
      base: ['0.875rem', '1.35rem'],
      lg: ['1rem', '1.45rem'],
      xl: ['1.125rem', '1.6rem'],
      '2xl': ['1.375rem', '1.8rem'],
      '3xl': ['1.625rem', '2rem'],
      '4xl': ['2rem', '2.4rem'],
    },
    extend: {
      colors: {
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
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        pop: "var(--shadow-pop)",
      },
      height: {
        toolbar: "var(--toolbar-h)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        spring: "var(--ease-spring)",
      },
      keyframes: {
        "rise-in": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "none" },
        },
        "pop-in": {
          from: { opacity: 0, transform: "translateY(8px) scale(0.97)" },
          to: { opacity: 1, transform: "none" },
        },
      },
      animation: {
        "rise-in": "rise-in 280ms var(--ease-out) both",
        "pop-in": "pop-in 280ms var(--ease-spring) both",
      },
    },
  },
  plugins: [],
}
