import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  adminLogout,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest,
  adminMe,
} from '../services/api';

const statusBadge = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const filters = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [filter, setFilter] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRequests = async (status = filter) => {
    setLoading(true);
    setError('');
    try {
      const result = await getAdminRequests(status);
      setRequests(result.data || []);
      setCounts(result.counts || {});
    } catch (err) {
      if (err.message?.includes('authentication') || err.message?.includes('session')) {
        adminLogout();
        navigate('/admin/login');
        return;
      }
      setError(err.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    adminMe()
      .then((r) => setAdminName(r.admin?.username || 'Admin'))
      .catch(() => {
        adminLogout();
        navigate('/admin/login');
      });
    loadRequests();
  }, []);

  useEffect(() => {
    loadRequests(filter);
  }, [filter]);

  const handleApprove = async (requestNumber) => {
    setActionId(requestNumber);
    setError('');
    setSuccess('');
    try {
      const result = await approveAdminRequest(requestNumber);
      setSuccess(result.message);
      await loadRequests(filter);
    } catch (err) {
      setError(err.message || 'Approval failed.');
    } finally {
      setActionId('');
    }
  };

  const handleReject = async (requestNumber) => {
    const reason = window.prompt('Rejection reason (optional):') || '';
    setActionId(requestNumber);
    setError('');
    setSuccess('');
    try {
      const result = await rejectAdminRequest(requestNumber, reason);
      setSuccess(result.message);
      await loadRequests(filter);
    } catch (err) {
      setError(err.message || 'Rejection failed.');
    } finally {
      setActionId('');
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand">Admin Portal</p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">Document requests</h1>
            <p className="mt-2 text-slate-600">
              Welcome, {adminName}. Review user submissions and approve or reject before documents are issued.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="self-start rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Pending', value: counts.pending, color: 'border-amber-200 bg-amber-50' },
            { label: 'Approved', value: counts.approved, color: 'border-green-200 bg-green-50' },
            { label: 'Rejected', value: counts.rejected, color: 'border-red-200 bg-red-50' },
            { label: 'Total', value: counts.total, color: 'border-slate-200 bg-white' },
          ].map((c) => (
            <div key={c.label} className={`rounded-2xl border p-4 ${c.color}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{c.value}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.value
                  ? 'bg-brand text-white shadow-sm shadow-rose-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-4">Request ID</th>
                  <th className="px-4 py-4">Document</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Delivery</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                      Loading requests…
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                      No requests found for this filter.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="border-b border-slate-100 hover:bg-slate-50/80">
                      <td className="px-4 py-4 font-mono text-xs font-semibold text-slate-900">
                        {req.requestNumber}
                      </td>
                      <td className="px-4 py-4 text-slate-700">{req.docTypeLabel}</td>
                      <td className="px-4 py-4 font-medium text-slate-900">{req.fullName}</td>
                      <td className="px-4 py-4 text-slate-600">{req.email}</td>
                      <td className="px-4 py-4 capitalize text-slate-600">{req.deliveryMethod}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadge[req.status]}`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{formatDate(req.createdAt)}</td>
                      <td className="px-4 py-4">
                        {req.status === 'pending' ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={actionId === req.requestNumber}
                              onClick={() => handleApprove(req.requestNumber)}
                              className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionId === req.requestNumber}
                              onClick={() => handleReject(req.requestNumber)}
                              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
