import { Reveal } from "@/components/Reveal";

interface SectionHeaderProps {
  title: string;
  description?: string;
  descriptionClassName?: string;
}

export function SectionHeader({ title, description, descriptionClassName }: SectionHeaderProps) {
  return (
    <Reveal className="mb-10 flex flex-col gap-3">
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl font-display">
        {title}
      </h2>
      {description ? (
        <p className={`max-w-2xl text-sm ${descriptionClassName || "text-muted-foreground"}`}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}

