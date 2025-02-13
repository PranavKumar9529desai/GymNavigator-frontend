import Footer from './sections/Footer/Footer';
import Herosection from './sections/Herosection/Herosection';
import Navbar from './sections/Navbar/Navbar';
import CtaSection from './sections/cta/CtaSection';
import FaqSection from './sections/faq/FaqSection';
import FeaturesSection from './sections/features/FeaturesSection';
import TestimonialsSection from './sections/testimonials/TestimonialsSection';
export const dynamic = 'force-dynamic';
export default async function Homepage() {
  return (
    <main className="bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white min-h-screen overflow-hidden">
      <Navbar />
      <Herosection />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
