import { GlitchHeading } from './GlitchHeading';

const TESTIMONIALS = [
  { quote: 'Results may not be real, but they look incredible.', name: 'Brad T., Customer' },
  { quote: 'I did one montage and now my mirror is afraid of me.', name: 'Carla V., Customer' },
  { quote: "I'm not sure what happened, but the music was great.", name: 'Doug R., Customer' },
];

export function Testimonials() {
  return (
    <section className="bg-ink px-4 sm:px-8 py-16 sm:py-20 border-b-[6px] border-hotpink">
      <div className="max-w-5xl mx-auto">
        <GlitchHeading
          text="Real Fake Testimonials"
          className="text-3xl sm:text-5xl text-vhs-cyan text-center block"
        />
        <div className="mt-10 grid sm:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="video-frame bg-wood/50 p-5">
              <p className="text-lg text-[#f4ecd8]">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm uppercase tracking-wide text-vhs-yellow">— {t.name}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs uppercase tracking-widest text-[#999] text-center">
          *Testimonials are fictional. Results not typical. Results not anything, really.
        </p>
      </div>
    </section>
  );
}
