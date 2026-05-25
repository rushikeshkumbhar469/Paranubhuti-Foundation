import { Link, useLocation } from 'react-router-dom';
import { getAdminToken } from '../services/api';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Get Identity Card', href: '/generate-id' },
  { label: 'Get Receipt', href: '/receipt' },
  { label: 'Get Certificate', href: '/certificate' },
  { label: 'Admin Portal', href: '/admin/login' },
];

export default function Navbar() {
  const location = useLocation();
  const showExtras = location.pathname !== '/';
  const adminHref = getAdminToken() ? '/admin' : '/admin/login';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Paranubhuti Foundation
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          {links.map((link) => {
            const href = link.label === 'Admin Portal' ? adminHref : link.href;
            const isActive =
              location.pathname === href ||
              (link.href === '/certificate' && location.pathname.startsWith('/certificate')) ||
              (link.label === 'Admin Portal' && location.pathname.startsWith('/admin'));
            return (
              <Link
                key={link.label}
                to={href}
                className={`text-sm font-medium ${
                  isActive ? 'text-brand border-b-2 border-brand' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        {/* <div className="flex items-center gap-3">
          {showExtras && (
            <>
              <a
                href="#donate"
                className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark"
              >
                Donate
              </a>
              <Link
                to="/profile"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                <span className="sr-only">Profile</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </>
          )}
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden">
            <span className="sr-only">Open menu</span>
            ☰
          </button>
        </div> */}
      </div>
    </header>
  );
}
