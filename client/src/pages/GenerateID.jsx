import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { generateIdCard } from '../services/api';
import RequestStatusPanel from '../components/RequestStatusPanel';

const roles = ['Community Outreach', 'Medical Volunteer', 'Education Volunteer', 'Admin', 'Event Coordinator'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export default function GenerateID() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'Community Outreach',
    joinDate: '',
    bloodGroup: 'AB+',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [requestId, setRequestId] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.joinDate) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const result = await generateIdCard(formData);
      setRequestId(result.requestNumber);
      setSuccess(`✅ ${result.message} Your Request ID: ${result.requestNumber}`);
    } catch (err) {
      setError(err.message || 'Failed to generate ID card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewName = formData.fullName || 'Full Name';
  const previewRole = formData.role;
  const previewJoin = formData.joinDate || 'DD/MM/YYYY';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Volunteer Identity</h1>
          <p className="mt-2 text-slate-600">
            Create and manage your official Paranubhuti Foundation digital identity.
            <br />
            Complete the form to submit a request. An admin must approve before you can download your ID card.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form Section */}
          <div className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  placeholder="Arjun Vardhan"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="arjun@foundation.org"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Phone Number *</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Role</label>
                <select name="role" value={formData.role} onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10">
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Join Date *</label>
                  <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10">
                    {bloodGroups.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
              )}
              {success && (
                <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>
              )}

              <button type="submit" disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <><span className="animate-spin">⏳</span> Generating…</>
                ) : (
                  <>Submit request <span>📋</span></>
                )}
              </button>

              <div className="rounded-2xl bg-slate-100 p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand text-brand">!</div>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Important Note</p>
                    <p className="mt-2 text-sm text-slate-600">
                      Ensure all details match your official government ID. After admin approval, your PDF will include a unique QR code for field verification.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col gap-6">
            <div className="sticky top-24 rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Live Preview</p>
              <div className="overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl">
                <div className="bg-brand py-4 text-center">
                  <p className="text-lg font-bold tracking-widest text-white">PARANUBHUTI</p>
                </div>
                <div className="flex flex-col items-center gap-6 p-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-500/50">
                    <span className="text-4xl text-slate-400">📷</span>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{previewName}</p>
                    <p className="mt-1 text-xs font-semibold tracking-wider text-brand">{previewRole}</p>
                  </div>
                  <div className="w-full space-y-4 border-t border-slate-600/50 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">JOINED ON</p>
                        <p className="mt-1 font-mono text-sm font-semibold text-white">{previewJoin}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400">BLOOD GROUP</p>
                        <p className="mt-1 text-sm font-semibold text-white">{formData.bloodGroup}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-t border-slate-600/50 pt-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">AUTHORIZED SIGNATORY</p>
                        <p className="mt-2 text-xs font-semibold text-white">Paranubhuti Disc.</p>
                      </div>
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
                        <span className="text-xl">■■</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-600/50 bg-slate-900/50 px-6 py-3 text-center">
                  <p className="text-xs text-slate-400">This is a representation of how your printed ID will appear.</p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-brand">DRAFT</span>
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
