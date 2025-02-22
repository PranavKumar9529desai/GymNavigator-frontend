import Footer from '@/app/(home)/_sections/Footer/Footer';
import Herosection from '@/app/(home)/_sections/Herosection/Herosection';
import Navbar from '@/app/(home)/_sections/Navbar/Navbar';
import CtaSection from '@/app/(home)/_sections/cta/CtaSection';
import FaqSection from '@/app/(home)/_sections/faq/FaqSection';
import FeaturesSection from '@/app/(home)/_sections/features/FeaturesSection';
import TestimonialsSection from '@/app/(home)/_sections/testimonials/TestimonialsSection';
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
