import type { ReactNode } from 'react';

export function GlitchHeading({
  text,
  as = 'h2',
  className = '',
}: {
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  const Tag = as as 'h1';
  return (
    <Tag className={`glitch-heading font-display uppercase ${className}`}>
      <span data-text={text}>{text}</span>
    </Tag>
  );
}

export function RecBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rec-badge">
      <span className="rec-dot" /> {children}
    </span>
  );
}
