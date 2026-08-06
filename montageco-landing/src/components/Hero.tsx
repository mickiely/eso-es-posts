import { GlitchHeading, RecBadge } from './GlitchHeading';
import { FlexPortrait } from './FlexPortrait';

export function Hero() {
  return (
    <section className="wood-backdrop relative px-4 sm:px-8 py-16 sm:py-24 border-b-[6px] border-ink">
      <div className="max-w-5xl mx-auto grid gap-10 sm:grid-cols-2 items-center">
        <div className="text-center sm:text-left">
          <RecBadge>LIVE BROADCAST — CHANNEL 87</RecBadge>
          <GlitchHeading
            as="h1"
            text="MONTAGE CO™"
            className="text-5xl sm:text-7xl text-vhs-yellow mt-3 leading-none"
          />
          <p className="font-display uppercase text-xl sm:text-2xl text-hotpink mt-4 tracking-wide">
            Life's Better In A Montage™
          </p>
          <p className="mt-5 text-lg sm:text-xl text-[#f4ecd8]/90 max-w-md mx-auto sm:mx-0">
            Making ordinary people look successful since 1987.
          </p>
          <button className="vhs-button mt-8 bg-hotpink text-ink font-display uppercase text-lg sm:text-xl px-8 py-4 border-4 border-ink shadow-[6px_6px_0_#000] hover:shadow-[3px_3px_0_#000] transition-shadow">
            Start Your Montage
          </button>
        </div>
        <FlexPortrait caption="ARCHIVE FOOTAGE — FLEX MONTAGE, 1987" />
      </div>
    </section>
  );
}
