import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Legal() {
  const location = useLocation();
  const activeTab = location.pathname === '/privacy' ? 'privacy' : 'terms';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">Paranubhuti Foundation</p>
              <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950">
                {activeTab === 'privacy' ? 'Dignity in Privacy.' : 'Terms of Service.'}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                {activeTab === 'privacy'
                  ? 'Our commitment to transparency starts with responsible data handling and respect for every individual we serve.'
                  : 'These terms set out how we agree to work together with our volunteers, donors, and partners on the Paranubhuti platform.'}
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Legal Overview</p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Access the foundation’s governance standards, privacy commitments, and community rules in one place.
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'terms' ? (
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-10">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">01 Acceptance of Terms</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Agreement to the platform rules.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  By accessing or using the Paranubhuti Foundation digital platform, you agree to abide by these terms. Please read carefully before continuing.
                </p>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                  <li>Use of the platform constitutes a legally binding agreement with the Foundation.</li>
                  <li>If you do not agree to any part of these terms, do not access or use the platform.</li>
                  <li>The Foundation reserves the right to modify terms with notice posted on the site.</li>
                </ul>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">02 User Conduct</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Respectful participation is required.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  All users are expected to engage with the platform honestly, transparently, and in good faith. Prohibited actions include, but are not limited to:
                </p>
                <ul className="mt-6 space-y-3 text-sm leading-7 text-slate-600">
                  <li>Misrepresenting identity or affiliation with the Foundation.</li>
                  <li>Using platform features for unauthorized financial gain.</li>
                  <li>Attempting to access or alter restricted Foundation databases.</li>
                </ul>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">03 Limitation of Liability</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Purposeful transparency, limited liability.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  To the maximum extent permitted by law, the Foundation is not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  We strive for accuracy, but do not guarantee error-free operation. The platform is provided on an "as-is" basis, and service interruptions may occur.
                </p>
              </article>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Support & Inquiry</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  If you have questions about these terms, our legal team is ready to help.
                </p>
                <p className="mt-6 rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
                  legal@paranubhuti.org
                </p>
              </div>
              <div className="rounded-[2rem] bg-brand p-8 text-white shadow-sm shadow-rose-200">
                <p className="text-xs uppercase tracking-[0.32em] text-rose-100">Policy Notice</p>
                <p className="mt-4 text-2xl font-semibold">Platform use is a trust agreement.</p>
                <p className="mt-4 text-sm leading-7 text-rose-100">
                  Continued use of the platform constitutes acceptance of these terms and any future updates.
                </p>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-10">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">01 Data Collection</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">We collect only what supports your mission.</h2>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                  <li>Personal identifiers (name, email, phone) to enable meaningful engagement.</li>
                  <li>Donation and transaction history required for receipts and reporting.</li>
                  <li>Platform activity logs to protect the community and maintain integrity.</li>
                </ul>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">02 Purposeful Use</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">Your data is used to serve you better.</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  We use data to improve platform security, generate accurate documentation, and tailor support services for our community.
                </p>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">03 User Rights</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-950">You control your information.</h2>
                <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                  <p>At any time, you may request access, correction, deletion, or export of your personal data held by the Foundation.</p>
                  <ul className="space-y-3 list-disc pl-5">
                    <li>The right to rectify</li>
                    <li>The right to be forgotten</li>
                    <li>The right to inspect</li>
                  </ul>
                </div>
              </article>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Integrity Guarantee</p>
                <p className="mt-4 text-lg font-semibold text-slate-950">We never sell, rent, or trade your personal information.</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  Your data is protected with industry-standard safeguards and only used for operational and legal support purposes.
                </p>
              </div>
              <div className="rounded-[2rem] bg-brand p-8 text-white shadow-sm shadow-rose-200">
                <p className="text-xs uppercase tracking-[0.32em] text-rose-100">Data Export</p>
                <p className="mt-4 text-2xl font-semibold">Request your full archive.</p>
                <Link
                  to="/contact-support"
                  className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand transition hover:bg-slate-100"
                >
                  Request Data Export
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
