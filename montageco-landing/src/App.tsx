import { ScreenEffects } from './components/ScreenEffects';
import { Hero } from './components/Hero';
import { FlexIntro } from './components/FlexIntro';
import { MontageComparison } from './components/MontageComparison';
import { Divisions } from './components/Divisions';
import { FakeScience } from './components/FakeScience';
import { Testimonials } from './components/Testimonials';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="relative">
      <ScreenEffects />
      <main>
        <Hero />
        <FlexIntro />
        <MontageComparison />
        <Divisions />
        <FakeScience />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

export default App;
