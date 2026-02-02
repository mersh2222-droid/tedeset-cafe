interface BrandStampProps {
  label?: string;
}

export function BrandStamp({ label = "Tedeset" }: BrandStampProps) {
  return (
    <span className="brand-stamp">
      {label}
    </span>
  );
}
