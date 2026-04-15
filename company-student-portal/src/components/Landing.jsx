import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Pricing from './Pricing';
import CTA from './Cta';

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>


      <div className="relative z-10">
        <Hero />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Features />
          <HowItWorks />
        </div>
<Pricing/>
<CTA/>

      </div>
    </div>
  );
}
