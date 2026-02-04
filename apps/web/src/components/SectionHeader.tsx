import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: React.ReactNode;
  description?: string;
  descriptionClassName?: string;
  titleClassName?: string;
}

export function SectionHeader({
  title,
  description,
  descriptionClassName,
  titleClassName
}: SectionHeaderProps) {
  return (
    <Reveal className="mb-10 flex flex-col gap-3">
      <h2
        className={cn(
          "text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl font-display [background-clip:unset] [-webkit-background-clip:unset]",
          titleClassName
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className={`max-w-2xl text-sm font-sf-pro ${descriptionClassName || "text-muted-foreground"}`}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

