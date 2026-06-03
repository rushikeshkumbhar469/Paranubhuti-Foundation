import { useEffect, useState, useRef } from 'react';
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

// ── Inline Toast Component ──────────────────────────────────────────────────
function Toast({ toast, onDismiss }) {
  if (!toast) return null;

  const styles = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  };
  const icons = {
    success: (
      <svg className="h-5 w-5 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-sm transition-all ${styles[toast.type]}`}
      style={{ animation: 'slideDown 0.35s ease-out' }}
    >
      {icons[toast.type]}
      <span className="flex-1 font-medium">{toast.message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-2 shrink-0 rounded-full p-0.5 transition hover:bg-black/5"
        aria-label="Dismiss"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ── Rejection Modal Component ───────────────────────────────────────────────
function RejectModal({ isOpen, requestNumber, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        style={{ animation: 'scaleIn 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Reject request</h3>
            <p className="text-sm text-slate-500">
              ID: <span className="font-mono font-semibold">{requestNumber}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="rejection-reason">
            Rejection reason <span className="text-slate-400">(optional)</span>
          </label>
          <textarea
            id="rejection-reason"
            ref={inputRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Provide a reason for rejection…"
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason)}
            className="flex-1 rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 shadow-sm"
          >
            Reject request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Approve Confirmation Modal ──────────────────────────────────────────────
function ApproveModal({ isOpen, requestNumber, deliveryMethod, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ animation: 'fadeIn 0.2s ease-out' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        style={{ animation: 'scaleIn 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Approve request</h3>
            <p className="text-sm text-slate-500">
              ID: <span className="font-mono font-semibold">{requestNumber}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <p className="mb-5 text-sm text-slate-600 leading-relaxed">
          This will mark the document as approved and make it available for download.
          {deliveryMethod === 'email' && (
            <span className="mt-1 block font-medium text-slate-800">
              📧 The document will also be automatically emailed to the requester.
            </span>
          )}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark shadow-sm shadow-rose-200"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [filter, setFilter] = useState('pending');
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState('');

  // Toast notifications instead of plain inline text
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const addToast = (type, message) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modal state
  const [rejectModal, setRejectModal] = useState({ open: false, requestNumber: '' });
  const [approveModal, setApproveModal] = useState({ open: false, requestNumber: '', deliveryMethod: '' });

  const loadRequests = async (status = filter) => {
    setLoading(true);
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
      addToast('error', err.message || 'Failed to load requests.');
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
  }, []);

  useEffect(() => {
    loadRequests(filter);
  }, [filter]);

  // Approve flow: open modal → confirm → API call
  const openApproveModal = (req) => {
    setApproveModal({ open: true, requestNumber: req.requestNumber, deliveryMethod: req.deliveryMethod });
  };

  const confirmApprove = async () => {
    const { requestNumber } = approveModal;
    setApproveModal({ open: false, requestNumber: '', deliveryMethod: '' });
    setActionId(requestNumber);
    try {
      const result = await approveAdminRequest(requestNumber);
      addToast('success', result.message || 'Request approved successfully!');
      await loadRequests(filter);
    } catch (err) {
      addToast('error', err.message || 'Approval failed.');
    } finally {
      setActionId('');
    }
  };

  // Reject flow: open modal → type reason → confirm → API call
  const openRejectModal = (requestNumber) => {
    setRejectModal({ open: true, requestNumber });
  };

  const confirmReject = async (reason) => {
    const { requestNumber } = rejectModal;
    setRejectModal({ open: false, requestNumber: '' });
    setActionId(requestNumber);
    try {
      const result = await rejectAdminRequest(requestNumber, reason);
      addToast('success', result.message || 'Request rejected.');
      await loadRequests(filter);
    } catch (err) {
      addToast('error', err.message || 'Rejection failed.');
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

      {/* ── Modals ── */}
      <RejectModal
        isOpen={rejectModal.open}
        requestNumber={rejectModal.requestNumber}
        onConfirm={confirmReject}
        onCancel={() => setRejectModal({ open: false, requestNumber: '' })}
      />
      <ApproveModal
        isOpen={approveModal.open}
        requestNumber={approveModal.requestNumber}
        deliveryMethod={approveModal.deliveryMethod}
        onConfirm={confirmApprove}
        onCancel={() => setApproveModal({ open: false, requestNumber: '', deliveryMethod: '' })}
      />

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

        {/* ── Toast Notifications ── */}
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
        ))}

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
                      <div className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading requests…
                      </div>
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
                    <tr key={req._id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
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
                              onClick={() => openApproveModal(req)}
                              className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionId === req.requestNumber}
                              onClick={() => openRejectModal(req.requestNumber)}
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

      {/* ── Animation Keyframes (injected inline for portability) ── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
