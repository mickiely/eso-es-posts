import { GlitchHeading } from './GlitchHeading';

export function FlexIntro() {
  return (
    <section className="bg-ink px-4 sm:px-8 py-16 sm:py-20 border-b-[6px] border-vhs-yellow">
      <div className="max-w-3xl mx-auto text-center">
        <GlitchHeading text="A Word From Flex" className="text-3xl sm:text-5xl text-vhs-cyan" />
        <div className="video-frame mt-8 mx-auto bg-wood/40 p-6 sm:p-10 text-left">
          <p className="text-lg sm:text-xl leading-relaxed text-[#f4ecd8]">
            "Hi. I'm Flex Montage. Inventor of the montage. Amateur scientist. Professional
            winner. If you're still spending <em className="text-hotpink">years</em> achieving
            things... you're doing it wrong."
          </p>
          <p className="mt-4 text-right text-vhs-yellow italic">— Flex Montage, probably</p>
        </div>
      </div>
    </section>
  );
}
