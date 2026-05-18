import { useState } from 'react';

export default function Admin() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAdminError('');

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminError('Please enter both email and password.');
      return;
    }

    const authenticated = false//await authenticateAdmin(adminEmail.trim(), adminPassword.trim());
    if (authenticated) {
      setAdminAuthenticated(true);
      setAdminError('');
    } else {
      setAdminAuthenticated(false);
      setAdminError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[32px] border border-slate-800/60 bg-slate-900/90 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-slate-50">Admin Login</h1>
        <p className="mt-2 text-sm text-slate-300">Enter your admin credentials to continue.</p>

        {adminAuthenticated ? (
          <div className="mt-6 rounded-3xl border border-cyan-500/10 bg-slate-950/80 p-6 text-slate-100">
            <h2 className="text-2xl font-semibold text-cyan-100">Welcome, Admin</h2>
            <p className="mt-3 text-slate-300">You have successfully authenticated with credentials.</p>
            <button
              onClick={() => setAdminAuthenticated(false)}
              className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleAdminLogin}>
            <label className="block text-sm font-medium text-slate-200">
              Email
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-700 transition focus:border-cyan-400 focus:ring-cyan-400/30"
                placeholder="admin@example.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-200">
              Password
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-1 ring-slate-700 transition focus:border-cyan-400 focus:ring-cyan-400/30"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-3xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign in
            </button>
            {adminError && <p className="text-sm text-rose-400">{adminError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
