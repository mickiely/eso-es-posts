import type { IndustryConfig } from '../types';

export function GotchaMissedCall({
  industry,
  selectedEnquiryId,
  customerReply,
  onSelectEnquiry,
  onReplyChange,
}: {
  industry: IndustryConfig;
  selectedEnquiryId: string | null;
  customerReply: string;
  onSelectEnquiry: (id: string) => void;
  onReplyChange: (text: string) => void;
}) {
  const selected = industry.enquiryOptions.find((o) => o.id === selectedEnquiryId);

  return (
    <div className="panel">
      <div className="eyebrow" style={{ color: 'var(--red)' }}>
        Step 2 — Gotcha
      </div>
      <h2 className="headline">The call was missed. Gotcha caught it anyway.</h2>

      <div className="phone-sim">
        <div className="missed-call-banner">{industry.missedCallText}</div>
        <div className="phone-screen">
          <div className="sms-bubble">
            <div className="sms-label">{industry.businessName} (instant SMS)</div>
            {industry.instantSmsIntro}
          </div>

          <p style={{ marginTop: 14, fontSize: 12, color: '#555' }}>
            Choose what the fictional customer is enquiring about:
          </p>

          <div className="option-list">
            {industry.enquiryOptions.map((opt, i) => (
              <button
                key={opt.id}
                className={`option-btn ${selectedEnquiryId === opt.id ? 'selected' : ''}`}
                onClick={() => onSelectEnquiry(opt.id)}
              >
                <span>
                  <span className="option-num">{i + 1}</span>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <>
              <div className="sms-bubble outgoing" style={{ marginTop: 14 }}>
                <div className="sms-label">Auto-suggested reply</div>
                {selected.smsReply}
              </div>
              <textarea
                className="reply-input"
                placeholder="Edit the response before it goes out (demo only — no message is actually sent)..."
                value={customerReply}
                onChange={(e) => onReplyChange(e.target.value)}
              />
            </>
          )}
        </div>
      </div>

      <div className="explain-box">
        <strong>Gotcha catches the call.</strong> A missed call instantly becomes a conversation, not a lost lead.
      </div>
      <p className="demo-data-note">No real SMS or phone call is sent in this demo.</p>
    </div>
  );
}
