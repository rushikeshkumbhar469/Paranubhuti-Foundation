import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Paranubhuti Foundation. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-slate-900">Terms of Service</Link>
          <Link to="/contact-support" className="hover:text-slate-900">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}
  