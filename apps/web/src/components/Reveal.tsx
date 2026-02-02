"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  className?: string;
  children: React.ReactNode;
}

export function Reveal({ className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("reveal", isVisible && "is-visible", className)}>
      {children}
    </div>
  );
}

