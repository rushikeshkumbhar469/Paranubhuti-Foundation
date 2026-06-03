import { Link } from 'react-router-dom';

export default function FeatureCard({ title, description, label, href }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-rose-50 text-brand">
        <span className="text-xl">📄</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      {href.startsWith('#') ? (
        <a
          href={href}
          className="mt-6 inline-flex items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark"
        >
          {label}
        </a>
      ) : (
        <Link
          to={href}
          className="mt-6 inline-flex items-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-brand-dark"
        >
          {label}
        </Link>
      )}
    </article>
  );
}
