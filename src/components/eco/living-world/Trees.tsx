type Props = {
  variant: "tree" | "stump" | "small";
  trunk: string;
  leaf: string;
};

/** Single tree or stump SVG used along the Living World horizon. */
export function TreeOrStump({ variant, trunk, leaf }: Props) {
  if (variant === "stump") {
    return (
      <svg width="60" height="40" viewBox="0 0 60 40" aria-hidden focusable="false">
        <rect x="22" y="20" width="16" height="18" fill={trunk} rx="2" />
        <ellipse cx="30" cy="20" rx="10" ry="3" fill="#7A5A3A" />
      </svg>
    );
  }
  const scale = variant === "small" ? 0.7 : 1;
  return (
    <svg width={80 * scale} height={140 * scale} viewBox="0 0 80 140" aria-hidden focusable="false">
      <rect x="34" y="80" width="12" height="60" fill={trunk} rx="2" />
      <circle cx="40" cy="60" r="34" fill={leaf} />
      <circle cx="22" cy="74" r="22" fill={leaf} opacity={0.9} />
      <circle cx="58" cy="74" r="22" fill={leaf} opacity={0.9} />
    </svg>
  );
}
