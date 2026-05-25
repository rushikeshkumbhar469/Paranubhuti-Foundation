const stats = [
  { value: '12k+', label: 'Certificates Issued' },
  { value: '₹4.2M', label: 'Total Donations Verified' },
  { value: '850+', label: 'Active Volunteers' }
];

export default function StatsSection() {
  return (
    <section className="mx-auto mt-20 flex max-w-7xl flex-col gap-12 px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid aspect-[4/3] w-full place-items-center overflow-hidden rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl sm:aspect-auto sm:p-10 lg:w-2/5">
        <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/80">
          <span className="absolute left-0 top-0 h-36 w-36 rounded-full bg-rose-500/20 blur-3xl" />
          <span className="absolute right-6 top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-72 w-full max-w-md items-end justify-between gap-4">
              <div className="space-y-4">
                <div className="h-28 w-28 rounded-3xl bg-slate-800" />
                <div className="h-20 w-20 rounded-3xl bg-slate-800" />
              </div>
              <div className="h-56 w-48 rounded-[2rem] bg-slate-800" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center gap-7 lg:w-1/2">
        <div className="flex flex-col gap-3 rounded-[2rem] bg-white p-8 shadow-sm shadow-slate-200">
          <p className="text-sm uppercase tracking-[0.4em] text-rose-600">Trust through Transparency.</p>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Reliable records that reflect your impact.</h2>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Streamlined documentation for volunteers, donors, and event contributors. Every record is designed to support accountability,
            recognition, and sustained trust across the foundation.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-3xl bg-white p-6 text-center shadow-sm shadow-slate-200">
              <p className="text-3xl font-semibold text-slate-900">{item.value}</p>
              <p className="mt-3 text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
