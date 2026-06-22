import type { IndustryConfig } from '../types';

export function FollowUp({ industry }: { industry: IndustryConfig }) {
  const { followUp } = industry;
  const accentVar = followUp.product === 'Frother' ? 'var(--green)' : 'var(--cyan)';

  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: accentVar }}>
        Step 5 — {followUp.product}
      </div>
      <h2 className="headline">{followUp.headline}</h2>

      <div className="phone-sim">
        <div className="phone-screen">
          <div className="sms-bubble">
            <div className="sms-label">{industry.businessName} (follow-up SMS, demo)</div>
            {followUp.message}
          </div>
        </div>
      </div>

      <div className="explain-box">
        <strong>
          {followUp.product === 'Frother' ? 'Frother brings customers back.' : 'Ripple supports reviews and referrals.'}
        </strong>{' '}
        {followUp.explain}
      </div>
      <p className="demo-data-note">No real SMS is sent in this demo.</p>
    </div>
  );
}
