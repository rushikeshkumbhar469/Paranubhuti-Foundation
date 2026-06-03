import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContact } from '../services/api';

const subjects = [
  'Document Download Issue',
  'ID Card Request',
  'Receipt Query',
  'Certificate Query',
  'Volunteering Inquiry',
  'Technical Support',
  'Other',
];

export default function ContactSupport() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: subjects[0], message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.'); return;
    }
    setLoading(true); setError(''); setSuccess('');
    try {
      const result = await submitContact(formData);
      setSuccess(result.message || '✅ Message sent! We will get back to you shortly.');
      setFormData({ name: '', email: '', subject: subjects[0], message: '' });
    } catch (err) { setError(err.message || 'Failed to send message. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand">Get in touch</p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-950">Dignity in Dialogue.</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
            We are here to listen, support, and collaborate. Reach out to our team for any inquiries regarding our foundation's work or your contributions.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
          <section className="rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@domain.com"
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Subject</label>
                <select name="subject" value={formData.subject} onChange={handleChange}
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10">
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Message *</label>
                <textarea rows="6" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you today?"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10" />
              </div>

              {error && <div className="rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">{error}</div>}
              {success && <div className="rounded-2xl bg-green-50 border border-green-200 px-5 py-4 text-sm text-green-700">{success}</div>}

              <button type="submit" disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-sm shadow-slate-200 transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? '⏳ Sending…' : 'Send Message'}
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">Headquarters</p>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Paranubhuti Foundation Office</p>
                <p>E-45, 2nd Floor, South Extension Part I</p>
                <p>New Delhi, Delhi 110049, India</p>
              </div>
              <Link to="/contact-support" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                View on Map <span aria-hidden="true">↗</span>
              </Link>
            </div>

            <div className="rounded-[2rem] bg-brand p-8 text-white shadow-sm shadow-rose-200">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-100">Support Email</p>
              <p className="mt-4 text-xl font-semibold">support@paranubhuti.org</p>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm shadow-slate-200">
              <div className="h-48 bg-gradient-to-br from-rose-50 to-slate-100 flex items-center justify-center">
                <span className="text-6xl">🤝</span>
              </div>
              <div className="p-6">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Our doors are open</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">Mon - Fri, 9am - 6pm</p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xl font-semibold text-slate-950">Common Questions</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Before reaching out, you might find an instant answer in our digital resources. We aim for full transparency in all our philanthropic activities.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Read FAQs</button>
              <button className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">Foundation Reports</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
