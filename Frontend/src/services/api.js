const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const ADMIN_TOKEN_KEY = 'paranubhuti_admin_token';

// ── Shared fetch helper ──────────────────────────────────────────────────────
const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      const err = await res.json();
      throw new Error(err.message || 'Something went wrong');
    }
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res;
};

const adminFetch = async (url, options = {}) => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return apiFetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// ── Download helper – triggers a browser file download ───────────────────────
const downloadPdf = async (res, filename) => {
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// ── ID Card ──────────────────────────────────────────────────────────────────
export const generateIdCard = async (formData) => {
  const res = await apiFetch('/id/generate', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res.json();
};

// ── Receipt ──────────────────────────────────────────────────────────────────
export const generateReceipt = async (formData) => {
  const res = await apiFetch('/receipt/generate', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res.json();
};

export const sendReceiptEmail = async (formData) => {
  const res = await apiFetch('/receipt/send-email', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res.json();
};

// ── Certificate ──────────────────────────────────────────────────────────────
export const generateCertificate = async (formData) => {
  const res = await apiFetch('/certificate/generate', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res.json();
};

export const sendCertificateEmail = async (formData) => {
  const res = await apiFetch('/certificate/send-email', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res.json();
};

// ── Request status & download ────────────────────────────────────────────────
export const getRequestStatus = async (requestNumber) => {
  const res = await apiFetch(`/requests/${encodeURIComponent(requestNumber.trim())}/status`);
  return res.json();
};

export const downloadApprovedRequest = async (requestNumber) => {
  const res = await apiFetch(`/requests/${encodeURIComponent(requestNumber.trim())}/download`);
  await downloadPdf(res, `document-${requestNumber.trim()}.pdf`);
};

// ── Contact ──────────────────────────────────────────────────────────────────
export const submitContact = async (formData) => {
  const res = await apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  return res.json();
};

// ── Documents / Stats ────────────────────────────────────────────────────────
export const getDocumentStats = async () => {
  const res = await apiFetch('/documents/stats');
  return res.json();
};

// ── Admin ──────────────────────────────────────────────────────────────────────
export const adminLogin = async (username, password) => {
  const res = await apiFetch('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  }
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);

export const adminMe = async () => {
  const res = await adminFetch('/admin/me');
  return res.json();
};

export const getAdminRequests = async (status = '') => {
  const query = status ? `?status=${status}` : '';
  const res = await adminFetch(`/admin/requests${query}`);
  return res.json();
};

export const approveAdminRequest = async (requestNumber) => {
  const res = await adminFetch(`/admin/requests/${encodeURIComponent(requestNumber)}/approve`, {
    method: 'PATCH',
  });
  return res.json();
};

export const rejectAdminRequest = async (requestNumber, reason = '') => {
  const res = await adminFetch(`/admin/requests/${encodeURIComponent(requestNumber)}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
  return res.json();
};
