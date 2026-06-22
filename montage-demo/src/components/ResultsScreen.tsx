import type { EnquiryOption, IndustryConfig } from '../types';

const OPS_CHECK_MAILTO =
  'mailto:oi@esoes.com.au?subject=Book%20an%20Ops%20Check%20-%20Montage%20Demo';

export function ResultsScreen({
  industry,
  enquiry,
}: {
  industry: IndustryConfig;
  enquiry: EnquiryOption;
}) {
  const savedValue = enquiry.estValue > 0 ? enquiry.estValue : industry.avgJobValue;

  return (
    <div className="panel">
      <div className="eyebrow">Step 6 — Results</div>
      <h2 className="headline">Here's what just happened at {industry.businessName}.</h2>

      <div className="results-list">
        <div className="results-item">
          <span className="check">✓</span> Business discovered via Ripple
        </div>
        <div className="results-item">
          <span className="check">✓</span> Missed call recovered via Gotcha
        </div>
        <div className="results-item">
          <span className="check">✓</span> Enquiry qualified: {enquiry.need}
        </div>
        <div className="results-item">
          <span className="check">✓</span> Staff playbook triggered via W'SUP
        </div>
        <div className="results-item">
          <span className="check">✓</span> Follow-up scheduled via {industry.followUp.product}
        </div>
      </div>

      <div className="value-banner">
        <span className="label">Estimated opportunity value saved (demo data)</span>
        ${savedValue.toLocaleString()}
      </div>

      <div className="cta-row">
        <a className="btn btn-primary" href={OPS_CHECK_MAILTO}>
          Book an Ops Check
        </a>
        <a className="btn" href={OPS_CHECK_MAILTO}>
          Build This For My Business
        </a>
      </div>
      <p className="demo-data-note">
        All names, figures, and messages in this demo are fictional and for illustration only.
      </p>
    </div>
  );
}
