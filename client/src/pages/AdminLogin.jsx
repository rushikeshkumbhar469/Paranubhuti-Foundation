import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { adminLogin, getAdminToken } from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (getAdminToken()) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Admin Portal</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter your admin credentials to review and approve document requests.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/10"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand px-6 py-3 font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in to dashboard'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
