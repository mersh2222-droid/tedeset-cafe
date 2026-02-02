import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container flex flex-col items-center gap-6 text-center">
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you are looking for doesn’t exist. Browse our menu or marketplace.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/menu">Menu</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/marketplace">Marketplace</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

