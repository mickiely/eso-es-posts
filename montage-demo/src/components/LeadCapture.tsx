import type { EnquiryOption, IndustryConfig, LiveResult } from '../types';

export function LeadCapture({
  industry,
  enquiry,
  liveResult,
}: {
  industry: IndustryConfig;
  enquiry: EnquiryOption;
  liveResult: LiveResult | null;
}) {
  const summary = liveResult?.leadSummary;
  const customer = summary?.customer ?? 'Fictional caller';
  const need = summary?.need ?? enquiry.need;
  const urgency = summary?.urgency ?? enquiry.urgency;
  const estValue = summary?.estValue ?? enquiry.estValue;
  const nextAction = summary?.nextAction ?? enquiry.nextAction;

  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: 'var(--red)' }}>
        Step 3 — Gotcha (lead capture)
      </div>
      <h2 className="headline">Enquiry qualified automatically.</h2>
      <p className="demo-data-note" style={{ textAlign: 'left', marginTop: 0 }}>
        {liveResult ? 'Live webhook response (demo data)' : 'Demo fallback data'}
      </p>

      <div className="data-grid">
        <div className="data-cell">
          <div className="label">Customer</div>
          <div className="value">{customer}</div>
        </div>
        <div className="data-cell">
          <div className="label">Need</div>
          <div className="value">{need}</div>
        </div>
        <div className="data-cell">
          <div className="label">Urgency</div>
          <div className="value">
            <span className={`urgency-pill urgency-${urgency}`}>{urgency}</span>
          </div>
        </div>
        <div className="data-cell">
          <div className="label">Estimated Value</div>
          <div className="value">{estValue > 0 ? `$${estValue.toLocaleString()}` : 'N/A'}</div>
        </div>
        <div className="data-cell" style={{ gridColumn: '1 / -1' }}>
          <div className="label">Recommended Next Action</div>
          <div className="value">{nextAction}</div>
        </div>
      </div>

      <div className="explain-box">
        <strong>Gotcha catches the call.</strong> {industry.businessName}'s team sees a qualified lead, not just a missed-call notification.
      </div>
      <p className="demo-data-note">Figures shown are illustrative demonstration data.</p>
    </div>
  );
}
