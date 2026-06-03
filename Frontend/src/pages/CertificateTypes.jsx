import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const certificateOptions = [
  {
    type: 'participation',
    title: 'Participation Certificate',
    description: 'Recognizes dedicated volunteers for their active participation in foundation programs and community events.'
  },
  {
    type: 'internship',
    title: 'Internship Completion Certificate',
    description: 'Acknowledges the successful completion of an internship program with Paranubhuti Foundation.'
  },
  {
    type: 'achievement',
    title: 'Achievement Certificate',
    description: 'Celebrates outstanding contributions, leadership, and measurable impact during foundation initiatives.'
  },
  {
    type: 'training',
    title: 'Training Completion Certificate',
    description: 'Validates the successful completion of a training or skills development program.'
  }
];

export default function CertificateTypes() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand">Certificate Library</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950">Choose the certificate type you need.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            Select a certificate category below to personalize and download the exact recognition you need for your work with Paranubhuti Foundation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {certificateOptions.map((item) => (
            <Link
              key={item.type}
              to={`/certificate/${item.type}`}
              className="group block rounded-[2rem] border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand/10 text-brand">
                  {item.type === 'participation' ? '🎖️' : item.type === 'internship' ? '💼' : item.type === 'achievement' ? '🏆' : '📜'}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm font-semibold text-brand">
                <span>Open certificate</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
