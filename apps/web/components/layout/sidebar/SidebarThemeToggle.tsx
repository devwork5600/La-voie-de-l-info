"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const themes = ["light", "dark"] as const;

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // If theme is 'system', we map it to 'light' for the UI indicator default
  const current = (
    theme === "system" ? "light" : (theme ?? "light")
  ) as (typeof themes)[number];
  const index = mounted ? themes.indexOf(current) : 0;

  return (
    <div className="bg-muted relative flex h-9 w-[56px] items-center rounded-full p-1">
      {/* Thumb */}
      <div
        className="bg-background absolute top-1 left-1 h-7 w-7 rounded-full shadow-sm transition-transform duration-150"
        style={{
          transform: `translateX(${index * 26}px)`,
        }}
      />

      {/* Buttons */}
      {themes.map((t) => {
        const Icon = t === "light" ? Sun : Moon;

        return (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className="relative z-10 flex flex-1 cursor-pointer items-center justify-center"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
