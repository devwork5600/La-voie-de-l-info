"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

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
  const current = (theme === "system" ? "light" : theme ?? "light") as typeof themes[number];
  const index = mounted ? themes.indexOf(current) : 0;

  return (
    <div className="relative flex w-[56px] h-9 items-center rounded-full bg-muted p-1">
      {/* Thumb */}
      <div
        className="absolute top-1 left-1 h-7 w-7 rounded-full bg-background shadow-sm transition-transform duration-150"
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
            className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}