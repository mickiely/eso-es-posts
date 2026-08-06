import type { EnquiryOption, IndustryConfig, LiveResult } from '../types';

export function WsupPlaybook({
  industry,
  enquiry,
  liveResult,
}: {
  industry: IndustryConfig;
  enquiry: EnquiryOption;
  liveResult: LiveResult | null;
}) {
  const checklist =
    liveResult && liveResult.wsupChecklist.length > 0 ? liveResult.wsupChecklist : enquiry.playbook;

  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: 'var(--purple)' }}>
        Step 4 — W'SUP
      </div>
      <h2 className="headline">The team gets a clear playbook, instantly.</h2>
      <p>
        For "{enquiry.label}" at {industry.businessName}:
      </p>
      <p className="demo-data-note" style={{ textAlign: 'left' }}>
        {liveResult ? 'Live webhook response (demo data)' : 'Demo fallback data'}
      </p>

      <div className="checklist">
        {checklist.map((item, i) => (
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
