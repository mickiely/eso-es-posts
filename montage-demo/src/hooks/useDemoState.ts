import { useCallback, useEffect, useState } from 'react';
import type { DemoState, IndustryId, StepId } from '../types';
import { STEP_ORDER } from '../types';

const STORAGE_KEY = 'montage-demo-state';

const INITIAL_STATE: DemoState = {
  step: 'select',
  industryId: null,
  selectedEnquiryId: null,
  customerReply: '',
  callMissed: false,
};

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_STATE, ...parsed };
  } catch {
    return INITIAL_STATE;
  }
}

export function useDemoState() {
  const [state, setState] = useState<DemoState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const stepIndex = STEP_ORDER.indexOf(state.step);

  const goToStep = useCallback((step: StepId) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      const idx = STEP_ORDER.indexOf(prev.step);
      const nextStep = STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
      return { ...prev, step: nextStep };
    });
  }, []);

  const previous = useCallback(() => {
    setState((prev) => {
      const idx = STEP_ORDER.indexOf(prev.step);
      const prevStep = STEP_ORDER[Math.max(idx - 1, 0)];
      return { ...prev, step: prevStep };
    });
  }, []);

  const selectIndustry = useCallback((industryId: IndustryId) => {
    setState((prev) => ({
      ...prev,
      industryId,
      step: 'discovery',
      selectedEnquiryId: null,
      customerReply: '',
      callMissed: false,
    }));
  }, []);

  const changeIndustry = useCallback(() => {
    setState(INITIAL_STATE);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const restart = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_STATE,
      industryId: prev.industryId,
      step: 'discovery',
    }));
  }, []);

  const setCallMissed = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, callMissed: value }));
  }, []);

  const selectEnquiry = useCallback((enquiryId: string) => {
    setState((prev) => ({ ...prev, selectedEnquiryId: enquiryId }));
  }, []);

  const setCustomerReply = useCallback((text: string) => {
    setState((prev) => ({ ...prev, customerReply: text }));
  }, []);

  return {
    state,
    stepIndex,
    totalSteps: STEP_ORDER.length,
    goToStep,
    next,
    previous,
    selectIndustry,
    changeIndustry,
    restart,
    setCallMissed,
    selectEnquiry,
    setCustomerReply,
  };
}
