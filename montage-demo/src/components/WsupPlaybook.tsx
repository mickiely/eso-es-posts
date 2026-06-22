import type { EnquiryOption, IndustryConfig } from '../types';

export function WsupPlaybook({
  industry,
  enquiry,
}: {
  industry: IndustryConfig;
  enquiry: EnquiryOption;
}) {
  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: 'var(--purple)' }}>
        Step 4 — W'SUP
      </div>
      <h2 className="headline">The team gets a clear playbook, instantly.</h2>
      <p>
        For "{enquiry.label}" at {industry.businessName}:
      </p>

      <div className="checklist">
        {enquiry.playbook.map((item, i) => (
          <div className="checklist-item" key={i}>
            <span className="box" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <p className="disclaimer">
        This checklist is an illustrative demo workflow only. It does not constitute legal, safety, or
        compliance certification of any kind.
      </p>

      <div className="explain-box">
        <strong>W'SUP shows the team what to do.</strong> No guessing, no inconsistent handling — every
        enquiry gets the same standard of response.
      </div>
    </div>
  );
}
