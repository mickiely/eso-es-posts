import { INDUSTRIES } from './config/industries';
import { useDemoState } from './hooks/useDemoState';
import { ProgressBar } from './components/ProgressBar';
import { NavControls } from './components/NavControls';
import { IndustrySelector } from './components/IndustrySelector';
import { RippleDiscovery } from './components/RippleDiscovery';
import { GotchaMissedCall } from './components/GotchaMissedCall';
import { LeadCapture } from './components/LeadCapture';
import { WsupPlaybook } from './components/WsupPlaybook';
import { FollowUp } from './components/FollowUp';
import { ResultsScreen } from './components/ResultsScreen';
import './styles/global.css';

function App() {
  const {
    state,
    next,
    previous,
    selectIndustry,
    changeIndustry,
    restart,
    selectEnquiry,
    setCustomerReply,
  } = useDemoState();

  const industry = state.industryId ? INDUSTRIES[state.industryId] : null;
  const enquiry = industry?.enquiryOptions.find((o) => o.id === state.selectedEnquiryId) ?? null;

  const canGoPrevious = state.step !== 'select';
  let canGoNext = false;
  if (state.step === 'discovery') canGoNext = true;
  if (state.step === 'missedCall') canGoNext = Boolean(enquiry);
  if (state.step === 'leadCapture') canGoNext = true;
  if (state.step === 'playbook') canGoNext = true;
  if (state.step === 'followUp') canGoNext = true;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>
            MONTAGE <span>— powered by Eso Es</span>
          </h1>
          <span className="powered-by">Interactive sales demonstration</span>
        </div>
        <span className="demo-badge">Demo data only</span>
      </header>

      {state.step !== 'select' && <ProgressBar step={state.step} />}

      <main className="app-main">
        {state.step === 'select' && <IndustrySelector onSelect={selectIndustry} />}

        {state.step === 'discovery' && industry && (
          <RippleDiscovery industry={industry} onCall={next} />
        )}

        {state.step === 'missedCall' && industry && (
          <GotchaMissedCall
            industry={industry}
            selectedEnquiryId={state.selectedEnquiryId}
            customerReply={state.customerReply}
            onSelectEnquiry={selectEnquiry}
            onReplyChange={setCustomerReply}
          />
        )}

        {state.step === 'leadCapture' && industry && enquiry && (
          <LeadCapture industry={industry} enquiry={enquiry} />
        )}

        {state.step === 'playbook' && industry && enquiry && (
          <WsupPlaybook industry={industry} enquiry={enquiry} />
        )}

        {state.step === 'followUp' && industry && <FollowUp industry={industry} />}

        {state.step === 'results' && industry && enquiry && (
          <ResultsScreen industry={industry} enquiry={enquiry} />
        )}

        {state.step !== 'select' && (
          <NavControls
            onPrevious={previous}
            onNext={next}
            onRestart={restart}
            onChangeIndustry={changeIndustry}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            nextLabel={state.step === 'discovery' ? 'Simulate Call' : 'Next'}
          />
        )}
      </main>
    </div>
  );
}

export default App;
