import type { IndustryConfig } from '../types';

export function RippleDiscovery({
  industry,
  onCall,
}: {
  industry: IndustryConfig;
  onCall: () => void;
}) {
  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: 'var(--cyan)' }}>
        Step 1 — Ripple
      </div>
      <h2 className="headline">A customer just found you online.</h2>
      <p>This is a realistic, fictional search result — Ripple's job is to make sure it looks this good.</p>

      <div className="search-bar">🔍 {industry.services[0].toLowerCase()} near me</div>

      <div className="result-card">
        <div className="result-name">{industry.businessName}</div>
        <div className="result-meta">
          <span className="stars">★ {industry.reviewScore}</span>{' '}
          ({industry.reviewCount} reviews · demo data) · {industry.address}
        </div>
        <div className="result-services">
          {industry.services.map((s) => (
            <span className="tag" key={s}>
              {s}
            </span>
          ))}
        </div>
        <div className="result-actions">
          <button className="btn btn-primary" onClick={onCall}>
            📞 Call Now
          </button>
          <button className="btn btn-ghost">🌐 Website</button>
        </div>
      </div>

      <div className="explain-box">
        <strong>Ripple gets them calling.</strong> Strong reviews and a clear listing turn a search into a phone call.
      </div>
    </div>
  );
}
