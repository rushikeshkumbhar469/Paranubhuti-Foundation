import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

const features = [
  {
    title: 'Identity Card',
    description: 'Generate your official digital identity card to represent the foundation during field operations and outreach programs.',
    label: 'Generate ID',
    href: '/generate-id'
  },
  {
    title: 'Payment Receipt',
    description: 'Download official 80G compliant donation receipts for your contributions. Maintain a transparent record of your altruism.',
    label: 'Get Receipt',
    href: '/receipt'
  },
  {
    title: ' Certificate',
    description: 'Official recognition for your dedicated hours and impact. Validated certificates for academic and professional portfolios.',
    label: 'Get Certificate',
    href: '/certificate'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-12 sm:pt-16">
        <section className="text-center">
          <p className="mx-auto inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs uppercase tracking-[0.36em] text-slate-600 sm:text-sm">
            Official Document Portal
          </p>
          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Empowering your <span className="text-brand">contribution</span> with formal recognition.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Access and manage your credentials seamlessly. From volunteer identity cards to donation receipts,
            we ensure your journey with Paranubhuti is documented with dignity and precision.
          </p>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
