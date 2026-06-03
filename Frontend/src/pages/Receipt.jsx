import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { generateReceipt, sendReceiptEmail } from '../services/api';
import RequestStatusPanel from '../components/RequestStatusPanel';

const projects = [
  'Rural Education Initiative',
  'Healthcare Program',
  'Community Development',
  'Disaster Relief',
  'Environmental Conservation',
];

export default function Receipt() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    fullName: '', amount: '', date: '',
    project: 'Rural Education Initiative', pan: '', email: '',
  });
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestId, setRequestId] = useState(searchParams.get('requestId') || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); setSuccess('');
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  const validate = (requireEmail = false) => {
    if (!formData.fullName || !formData.amount || !formData.date) {
      setError('Please fill in Name, Amount, and Date.'); return false;
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
      const result = await generateReceipt(formData);
      setRequestId(result.requestNumber);
      setSuccess(`✅ ${result.message} Request ID: ${result.requestNumber}`);
    } catch (err) { setError(err.message || 'Failed to submit receipt request.'); }
    finally { setLoading(false); }
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    if (!validate(true)) return;
    setEmailLoading(true); setError(''); setSuccess('');
    try {
      const result = await sendReceiptEmail(formData);
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
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Documentation Portal</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Receipt Generator</h1>
          <p className="mt-2 text-slate-600">Submit a request for an official 80G-compliant receipt. Admin approval is required before download or email delivery.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
            <form className="space-y-6">
              {[
                { label: 'Full Legal Name *', name: 'fullName', type: 'text', placeholder: 'John Doe' },
                { label: 'Amount (₹) *', name: 'amount', type: 'number', placeholder: '5000' },
                { label: 'Tax ID / PAN (Optional)', name: 'pan', type: 'text', placeholder: 'ABCDE1234F' },
                { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'donor@example.com' },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</label>
                  <input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Project / Fund</label>
                <select name="project" value={formData.project} onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10">
                  {projects.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
              {success && <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>}

              <button type="button" onClick={handleDownload} disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark disabled:opacity-60">
                {loading ? '⏳ Submitting…' : 'Submit receipt request'}
              </button>

              <button type="button" onClick={handleEmail} disabled={emailLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">
                {emailLoading ? '⏳ Submitting…' : '✉ Request email delivery'}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Receipt Preview</p>
              <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-slate-900">PARANUBHUTI</h2>
                  <p className="mt-1 text-xs text-slate-600">Foundation For Global Equality<br />122 Galitodia Way, Sector 4, New Delhi, 110015, India<br />Reg No. 80-2023-PBD3</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-brand">RECEIPT NO.</p>
                  <p className="text-lg font-bold text-slate-900">PR-{new Date().getFullYear()}-XXXXX</p>
                </div>
                <div className="border-t border-slate-300" />
                <div className="text-center"><h3 className="text-sm font-bold tracking-wider text-slate-900">OFFICIAL DONATION RECEIPT</h3></div>
                <div className="space-y-3 text-sm">
                  {[
                    ['RECEIVED FROM', formData.fullName || 'John Doe'],
                    ['DATE', formData.date ? formatDate(formData.date) : 'Oct 24, 2024'],
                    ['PURPOSE', formData.project],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="font-semibold text-slate-700">{k}</span>
                      <span className="text-slate-900">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">AMOUNT</span>
                    <span className="text-brand font-semibold">₹{formData.amount || '5,000'}</span>
                  </div>
                </div>
                <div className="border-t border-slate-300" />
                <p className="text-xs text-slate-600 leading-relaxed">Valid for tax exemption under Section 80G of the IT Act.</p>
                <div className="flex items-end justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-300 bg-slate-50">
                    <span className="text-xl">■■</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">A.K. Sharma</p>
                    <p className="text-xs text-slate-600">AUTHORIZED SIGNATORY</p>
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
          <RequestStatusPanel initialRequestId={requestId} docType="receipt" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
