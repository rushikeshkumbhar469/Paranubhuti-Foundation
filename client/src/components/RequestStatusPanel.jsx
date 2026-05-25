import { useState } from 'react';
import { getRequestStatus, downloadApprovedRequest } from '../services/api';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-800 border-amber-200',
  approved: 'bg-green-50 text-green-800 border-green-200',
  rejected: 'bg-red-50 text-red-800 border-red-200',
};

export default function RequestStatusPanel({ initialRequestId = '' }) {
  const [requestId, setRequestId] = useState(initialRequestId);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusData, setStatusData] = useState(null);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!requestId.trim()) {
      setError('Please enter your Request ID.');
      return;
    }
    setLoading(true);
    setError('');
    setStatusData(null);
    try {
      const result = await getRequestStatus(requestId.trim());
      setStatusData(result.data);
    } catch (err) {
      setError(err.message || 'Could not find that request.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloadLoading(true);
    setError('');
    try {
      await downloadApprovedRequest(requestId.trim());
    } catch (err) {
      setError(err.message || 'Download failed.');
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200">
      <h3 className="text-lg font-semibold text-slate-900">Check request status</h3>
      <p className="mt-1 text-sm text-slate-600">
        Enter the Request ID you received after submitting. Download is available only after admin approval.
      </p>

      <form onSubmit={handleCheck} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          placeholder="e.g. REQ-2025-04271"
          className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm uppercase tracking-wide transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? 'Checking…' : 'Check status'}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {statusData && (
        <div className="mt-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Request ID</p>
              <p className="font-mono text-sm font-semibold text-slate-900">{statusData.requestNumber}</p>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[statusData.status]}`}
            >
              {statusData.status}
            </span>
          </div>
          <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-slate-900">Document:</span> {statusData.docTypeLabel}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Name:</span> {statusData.fullName}
            </p>
          </div>

          {statusData.status === 'pending' && (
            <p className="text-sm text-amber-800">
              Your request is awaiting admin review. Please check back later.
            </p>
          )}

          {statusData.status === 'rejected' && (
            <p className="text-sm text-red-700">
              {statusData.rejectionReason || 'This request was not approved.'}
            </p>
          )}

          {statusData.status === 'approved' && statusData.deliveryMethod === 'email' && (
            <p className="text-sm text-green-700">
              Approved. The document has been sent to your email address.
            </p>
          )}

          {statusData.status === 'approved' && statusData.deliveryMethod === 'download' && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloadLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark disabled:opacity-60"
            >
              {downloadLoading ? 'Downloading…' : '↓ Download approved document'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
