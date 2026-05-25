import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { generateCertificate, sendCertificateEmail } from '../services/api';
import RequestStatusPanel from '../components/RequestStatusPanel';

const certificateMeta = {
  participation: { title: 'Participation Certificate', bodyText: 'has actively participated and successfully completed the program titled', inputLabel: 'Program Title', placeholder: 'e.g. Annual Community Drive 2024' },
  internship: { title: 'Internship Completion Certificate', bodyText: 'has successfully completed the internship program titled', inputLabel: 'Internship Title', placeholder: 'e.g. Summer Internship in Community Outreach' },
  achievement: { title: 'Achievement Certificate', bodyText: 'has demonstrated outstanding performance and achievement in', inputLabel: 'Achievement Title', placeholder: 'e.g. Volunteer Leadership Award' },
  training: { title: 'Training Completion Certificate', bodyText: 'has successfully completed the training course titled', inputLabel: 'Training Title', placeholder: 'e.g. Digital Skills Training Program' },
};

export default function Certificate() {
  const { type } = useParams();
  const certificate = certificateMeta[type] || certificateMeta.participation;

  const [formData, setFormData] = useState({ fullName: '', title: '', date: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestId, setRequestId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); setSuccess('');
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  const validate = (requireEmail = false) => {
    if (!formData.fullName || !formData.title || !formData.date) {
      setError('Please fill in Name, Title, and Date.'); return false;
    }
    if (requireEmail && !formData.email) {
      setError('Please enter an email address.'); return false;
    }
    return true;
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!validate(true)) return;
    setLoading(true); setError(''); setSuccess('');
    try {
      const result = await generateCertificate({ ...formData, type: type || 'participation' });
      setRequestId(result.requestNumber);
      setSuccess(`✅ ${result.message} Request ID: ${result.requestNumber}`);
    } catch (err) { setError(err.message || 'Failed to submit certificate request.'); }
    finally { setLoading(false); }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!validate(true)) return;
    setEmailLoading(true); setError(''); setSuccess('');
    try {
      const result = await sendCertificateEmail({ ...formData, type: type || 'participation' });
      setRequestId(result.requestNumber);
      setSuccess(`✅ ${result.message} Request ID: ${result.requestNumber}`);
    } catch (err) { setError(err.message || 'Failed to send email.'); }
    finally { setEmailLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Certification Portal</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">{certificate.title}</h1>
          <p className="mt-2 text-slate-600">Submit a request for your {certificate.title.toLowerCase()}. Admin approval is required before download or email delivery.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
              <form className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Participant Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Advait Sharma"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">{certificate.inputLabel} *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder={certificate.placeholder}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Date of Completion *</label>
                  <input type="date" name="date" value={formData.date} onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="recipient@example.com"
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>

                {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
                {success && <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>}

                <button type="button" onClick={handleDownload} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark disabled:opacity-60">
                  {loading ? '⏳ Submitting…' : 'Submit certificate request'}
                </button>

                <button type="button" onClick={handleEmail} disabled={emailLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                  {emailLoading ? '⏳ Submitting…' : '✉ Request email delivery'}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex gap-4">
              <div className="flex-shrink-0 text-brand text-xl">🛡️</div>
              <p className="text-sm text-slate-700">This certificate uses the official foundation header, project director signature, and a QR code for instant verification.</p>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand"></span>Live Preview
                </span>
              </p>
              <div className="space-y-8 rounded-2xl bg-white p-12 border border-slate-200">
                <div className="grid gap-6 text-center">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">PARANUBHUTI FOUNDATION</p>
                    <p className="mt-1 text-sm text-slate-500">Stand For Humanity</p>
                  </div>
                  <div className="text-center">
                    <h2 className="text-4xl font-semibold text-brand">{certificate.title}</h2>
                    <div className="mx-auto mt-3 h-0.5 w-24 bg-brand"></div>
                  </div>
                  <div className="space-y-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">This is to certify that</p>
                    <p className="text-3xl font-bold text-slate-950">{formData.fullName || 'Advait Sharma'}</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{certificate.bodyText}</p>
                    <p className="text-sm font-semibold text-slate-900">"{formData.title || certificate.placeholder}"</p>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <p className="text-xs text-slate-600">PROJECT DIRECTOR</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">A.K. Sharma</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600">DATE ISSUED</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{formData.date ? formatDate(formData.date) : 'OCTOBER 24, 2024'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-right">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">PREVIEW</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <RequestStatusPanel initialRequestId={requestId} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
