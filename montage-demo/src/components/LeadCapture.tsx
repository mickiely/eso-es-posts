import type { EnquiryOption, IndustryConfig } from '../types';

export function LeadCapture({
  industry,
  enquiry,
}: {
  industry: IndustryConfig;
  enquiry: EnquiryOption;
}) {
  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: 'var(--red)' }}>
        Step 3 — Gotcha (lead capture)
      </div>
      <h2 className="headline">Enquiry qualified automatically.</h2>

      <div className="data-grid">
        <div className="data-cell">
          <div className="label">Customer</div>
          <div className="value">Fictional caller</div>
        </div>
        <div className="data-cell">
          <div className="label">Need</div>
          <div className="value">{enquiry.need}</div>
        </div>
        <div className="data-cell">
          <div className="label">Urgency</div>
          <div className="value">
            <span className={`urgency-pill urgency-${enquiry.urgency}`}>{enquiry.urgency}</span>
          </div>
        </div>
        <div className="data-cell">
          <div className="label">Estimated Value</div>
          <div className="value">
            {enquiry.estValue > 0 ? `$${enquiry.estValue.toLocaleString()}` : 'N/A'}
          </div>
        </div>
        <div className="data-cell" style={{ gridColumn: '1 / -1' }}>
          <div className="label">Recommended Next Action</div>
          <div className="value">{enquiry.nextAction}</div>
        </div>
      </div>

      <div className="explain-box">
        <strong>Gotcha catches the call.</strong> {industry.businessName}'s team sees a qualified lead, not just a missed-call notification.
      </div>
      <p className="demo-data-note">Figures shown are illustrative demonstration data.</p>
    </div>
  );
}
