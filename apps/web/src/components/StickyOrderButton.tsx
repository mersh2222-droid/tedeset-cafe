import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StickyOrderButtonProps {
  orderUrl?: string | null;
}

export function StickyOrderButton({ orderUrl }: StickyOrderButtonProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/90 p-4 backdrop-blur md:hidden">
      <Button asChild size="lg" className="w-full">
        <Link href={orderUrl || "/order"}>Order Online</Link>
      </Button>
    </div>
  );
}

