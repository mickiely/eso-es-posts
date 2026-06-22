import { INDUSTRY_LIST } from '../config/industries';
import type { IndustryId } from '../types';

const ICONS: Record<string, string> = {
  barber: '✂️',
  builder: '🏗️',
  electrician: '⚡',
  cafe: '☕',
};

export function IndustrySelector({
  onSelect,
}: {
  onSelect: (id: IndustryId) => void;
}) {
  return (
    <div className="panel">
      <div className="eyebrow">Montage — Powered by Eso Es</div>
      <h2 className="headline">See Eso Es working inside a business like yours.</h2>
      <p>Pick an industry below to walk through a live fictional example, end to end.</p>
      <div className="industry-grid">
        {INDUSTRY_LIST.map((industry) => (
          <button
            key={industry.id}
            className="industry-card"
            onClick={() => onSelect(industry.id as IndustryId)}
          >
            <span className="icon">{ICONS[industry.id]}</span>
            {industry.label}
          </button>
        ))}
      </div>
      <p className="demo-data-note">All names, reviews, and figures shown are demonstration data only.</p>
    </div>
  );
}
