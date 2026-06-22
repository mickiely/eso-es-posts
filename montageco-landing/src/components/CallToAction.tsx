import { GlitchHeading } from './GlitchHeading';

export function CallToAction() {
  return (
    <section className="wood-backdrop px-4 sm:px-8 py-16 sm:py-24 border-b-[6px] border-vhs-yellow">
      <div className="max-w-2xl mx-auto text-center">
        <GlitchHeading
          text="We Don't Do More. We Do It In A Montage."
          className="text-2xl sm:text-4xl text-vhs-yellow leading-tight block"
        />
        <button className="vhs-button mt-8 bg-hotpink text-ink font-display uppercase text-lg sm:text-xl px-8 py-4 border-4 border-ink shadow-[6px_6px_0_#000] hover:shadow-[3px_3px_0_#000] transition-shadow">
          Start Your Montage
        </button>
      </div>
    </section>
  );
}
