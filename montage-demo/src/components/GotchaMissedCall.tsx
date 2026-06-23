import type { IndustryConfig, LiveResult, LiveStatus } from '../types';

export function GotchaMissedCall({
  industry,
  selectedEnquiryId,
  customerReply,
  liveStatus,
  liveResult,
  liveError,
  onSelectEnquiry,
  onReplyChange,
  onSubmitLive,
}: {
  industry: IndustryConfig;
  selectedEnquiryId: string | null;
  customerReply: string;
  liveStatus: LiveStatus;
  liveResult: LiveResult | null;
  liveError: string | null;
  onSelectEnquiry: (id: string) => void;
  onReplyChange: (text: string) => void;
  onSubmitLive: () => void;
}) {
  const selected = industry.enquiryOptions.find((o) => o.id === selectedEnquiryId);
  const displayedReply = liveStatus === 'success' && liveResult ? liveResult.gotchaReply : selected?.smsReply;

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
              <textarea
                className="reply-input"
                placeholder="Edit the response before sending to the live demo webhook (no real SMS or call is sent)..."
                value={customerReply}
                onChange={(e) => onReplyChange(e.target.value)}
              />

              <button
                className="btn btn-primary"
                style={{ marginTop: 10 }}
                onClick={onSubmitLive}
                disabled={liveStatus === 'loading'}
              >
                {liveStatus === 'loading' ? 'Contacting Gotcha…' : 'Send to Gotcha (Live)'}
              </button>

              {liveStatus === 'loading' && (
                <p className="demo-data-note" style={{ marginTop: 8 }}>
                  Waiting on the live Gotcha webhook…
                </p>
              )}

              {liveStatus === 'error' && (
                <p className="demo-data-note" style={{ marginTop: 8, color: 'var(--red)' }}>
                  Live webhook unavailable ({liveError}) — showing demo fallback reply below.
                </p>
              )}

              <div className="sms-bubble outgoing" style={{ marginTop: 14 }}>
                <div className="sms-label">
                  {liveStatus === 'success' ? 'Live Gotcha reply (demo data)' : 'Auto-suggested reply (demo fallback)'}
                </div>
                {displayedReply}
              </div>
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
