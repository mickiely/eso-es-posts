interface NavControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onRestart: () => void;
  onChangeIndustry: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  nextLabel?: string;
}

export function NavControls({
  onPrevious,
  onNext,
  onRestart,
  onChangeIndustry,
  canGoPrevious,
  canGoNext,
  nextLabel = 'Next',
}: NavControlsProps) {
  return (
    <div className="nav-controls">
      <div className="nav-left">
        <button className="btn btn-ghost" onClick={onPrevious} disabled={!canGoPrevious}>
          ← Previous
        </button>
        {canGoNext && (
          <button className="btn btn-primary" onClick={onNext}>
            {nextLabel} →
          </button>
        )}
      </div>
      <div className="nav-right">
        <button className="btn" onClick={onRestart}>
          Restart Demo
        </button>
        <button className="btn btn-danger" onClick={onChangeIndustry}>
          Change Industry
        </button>
      </div>
    </div>
  );
}
