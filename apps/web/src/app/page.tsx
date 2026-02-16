import Link from 'next/link';

export default function HomePage() {
  const links = [
    { title: 'Case Dashboard', href: '/cases' },
    { title: 'Case Details For Case 1', href: '/cases/1' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10 border border-slate-100">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            COLLECTIONS CASE MANAGER
          </h1>
          <p className="text-slate-500 font-medium">Internal Operations Portal</p>
        </header>

        <nav className="space-y-4">
          {links.map((link) => (
            <div key={link.href} className="group">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-widest">
                {link.title}
              </p>
              <Link 
                href={link.href}
                className="block p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <code className="text-blue-600 font-mono font-bold text-lg">
                  {link.href}
                </code>
              </Link>
            </div>
          ))}
        </nav>

        <footer className="mt-12 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-medium">
            Connected to Rule Engine v1.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}