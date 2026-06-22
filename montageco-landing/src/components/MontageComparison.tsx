import { GlitchHeading } from './GlitchHeading';

const NORMAL_LIFE = ['Slow', 'Painful', 'Boring', 'Consequences'];
const MONTAGE_LIFE = ['Music', 'Jump Cuts', 'Sweat', 'Sunset', 'Results'];

export function MontageComparison() {
  return (
    <section className="bg-wood px-4 sm:px-8 py-16 sm:py-20 border-b-[6px] border-ink">
      <div className="max-w-4xl mx-auto">
        <GlitchHeading
          text="What Is A Montage?"
          className="text-3xl sm:text-5xl text-vhs-yellow text-center block"
        />
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="video-frame bg-ink/70 p-6">
            <h3 className="font-display uppercase text-2xl text-[#9a9a9a] mb-4">Normal Life</h3>
            <ul className="space-y-2 text-lg">
              {NORMAL_LIFE.map((item) => (
                <li key={item} className="text-[#cfcfcf]">
                  ✗ {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="video-frame video-frame-accent bg-ink/70 p-6">
            <h3 className="font-display uppercase text-2xl text-hotpink mb-4">Montage Life</h3>
            <ul className="space-y-2 text-lg">
              {MONTAGE_LIFE.map((item) => (
                <li key={item} className="text-vhs-cyan">
                  ★ {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
