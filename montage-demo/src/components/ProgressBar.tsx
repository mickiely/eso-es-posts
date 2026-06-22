import { STEP_ORDER, type StepId } from '../types';

const STEP_LABELS: Record<StepId, string> = {
  select: 'Industry',
  discovery: 'Ripple',
  missedCall: 'Gotcha',
  leadCapture: 'Lead',
  playbook: "W'SUP",
  followUp: 'Follow-up',
  results: 'Results',
};

export function ProgressBar({ step }: { step: StepId }) {
  const idx = STEP_ORDER.indexOf(step);
  return (
    <div className="progress-bar">
      {STEP_ORDER.map((s, i) => (
        <div key={s} className={`progress-step ${i <= idx ? 'done' : ''}`} />
      ))}
      <span className="progress-label">
        Step {idx + 1} / {STEP_ORDER.length} — {STEP_LABELS[step]}
      </span>
    </div>
  );
}
