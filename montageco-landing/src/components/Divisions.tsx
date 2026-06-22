import { GlitchHeading } from './GlitchHeading';

const DIVISIONS = [
  { name: 'Montage Fitness', tag: 'Abs in one sunset.' },
  { name: 'Montage Cafe', tag: 'Coffee that believes in you.' },
  { name: 'Montage Business', tag: 'Quarterly results, daily montages.' },
  { name: 'Montage AI', tag: 'Thinks for you. Looks great doing it.' },
  { name: 'Montage Dating', tag: 'Falling in love, but faster.' },
  { name: 'Montage Beauty', tag: 'Glow-ups, pre-edited.' },
];

export function Divisions() {
  return (
    <section className="bg-ink px-4 sm:px-8 py-16 sm:py-20 border-b-[6px] border-vhs-cyan">
      <div className="max-w-5xl mx-auto">
        <GlitchHeading
          text="The Divisions"
          className="text-3xl sm:text-5xl text-vhs-yellow text-center block"
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIVISIONS.map((d) => (
            <div
              key={d.name}
              className="video-frame bg-wood/60 p-5 hover:bg-wood/90 transition-colors"
            >
              <p className="font-display uppercase text-xl text-hotpink leading-tight">
                {d.name}
              </p>
              <p className="mt-2 text-base text-vhs-cyan">{d.tag}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
