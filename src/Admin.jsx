import { useEffect, useState } from 'react';

const MESSAGES_ENDPOINT = 'https://k3gqqptkf8.execute-api.us-east-1.amazonaws.com/api_prod/messages';

async function sha256(message) {
    // encode as UTF-8
    const msgBuffer = new TextEncoder().encode(message);                    

    // hash the message
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    // convert ArrayBuffer to Array
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // convert bytes to hex string                  
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export default function Admin() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const rowsPerPage = 6;

  const handleAdminLogin = async (event) => {
    // event.preventDefault();
    // setAdminError('');

    // if (!adminEmail.trim() || !adminPassword.trim()) {
    //   setAdminError('Please enter both email and password.');
    //   return;
    // }

    // if (!adminEmail.trim() || !adminPassword.trim()) {
    //   setAdminError('Please enter both email and password.');
    //   return;
    // }
    const passwordHash = await sha256(adminPassword);
    if (adminEmail == 'admin' && passwordHash == 'b6a293f3ce3972b251ae1be3cc9603c270c5bd581a45699f5a096d2705f57e56') {
      setAdminAuthenticated(true);
    }
  };

  const filteredMessages = messages.filter((item) => {
    const search = filterText.trim().toLowerCase();

    if (!search) return true;

    return [item.name, item.message, item.attending ? 'sí' : 'no']
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(search);
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const valueA = sortBy === 'attending' ? Number(Boolean(a.attending)) : String(a[sortBy] ?? '').toLowerCase();
    const valueB = sortBy === 'attending' ? Number(Boolean(b.attending)) : String(b[sortBy] ?? '').toLowerCase();

    if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedMessages.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pagedMessages = sortedMessages.slice(startIndex, startIndex + rowsPerPage);
  const confirmedAttending = messages.filter((item) => item.attending).length;

  const exportToCsv = () => {
    const rows = messages.map((item) => ({
      name: item.name || '',
      message: item.message || '',
      attending: item.attending ? 'Yes' : 'No'
    }));

    const header = ['name', 'message', 'attending'];
    const csvContent = [
      header.join(','),
      ...rows.map((row) =>
        header
          .map((key) => {
            const value = String(row[key] ?? '').replace(/\r?\n/g, ' ').replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'messages.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!adminAuthenticated) {
      return;
    }

    const fetchMessages = async () => {
      setMessagesLoading(true);
      setMessagesError('');

      try {
        const response = await fetch(MESSAGES_ENDPOINT);

        if (!response.ok) {
          throw new Error('Unable to load messages.');
        }

        const data = await response.json();
        const nextMessages = Array.isArray(data)
          ? data
          : Array.isArray(data?.messages)
            ? data.messages
            : Array.isArray(data?.items)
              ? data.items
              : [];

        setMessages(nextMessages);
        setCurrentPage(1);
        setFilterText('');
      } catch (error) {
        console.error(error);
        setMessagesError('Could not fetch messages from the endpoint.');
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, [adminAuthenticated]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/80 sm:p-8">
        {!adminAuthenticated ? <div className="mx-auto max-w-2xl text-center sm:text-left">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Login</h1>
          <p className="mt-2 text-sm text-slate-600">Ingrese las credenciales para continuar</p>
        </div> : ''}

        {adminAuthenticated ? (
          <div className="mt-6 grid gap-6 xl:grid-cols-[320px_1fr]">
            <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-6 text-slate-900 shadow-sm">
              <h2 className="text-xl font-semibold text-cyan-800 sm:text-2xl">Bienvenida</h2>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">Credenciales correctas</p>

              <div className="mt-5 rounded-2xl bg-white/90 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-700">Asistencia confirmada</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{confirmedAttending}</p>
              </div>

              <button
                onClick={() => setAdminAuthenticated(false)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400 sm:w-auto"
              >
                Salir
              </button>
            </section>

            <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-slate-900">Mensajes</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={exportToCsv}
                    className="rounded-full bg-cyan-500 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-cyan-400"
                  >
                    Exportar a CSV
                  </button>
                </div>
              </div>

              <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_180px_140px]">
                <input
                  type="search"
                  value={filterText}
                  onChange={(e) => {
                    setFilterText(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Filtrar por nombre, mensaje o asistencia"
                  className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none ring-1 ring-slate-200 transition focus:border-cyan-400 focus:ring-cyan-400/30"
                />
                <button
                  type="button"
                  onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Invertir orden
                </button>
              </div>

              {messagesLoading ? (
                <p className="text-sm text-slate-600">Cargando mensajes...</p>
              ) : messagesError ? (
                <p className="text-sm text-rose-500">{messagesError}</p>
              ) : sortedMessages.length === 0 ? (
                <p className="text-sm text-slate-600">No se encontraron mensajes con ese filtro.</p>
              ) : (
                <>
                  <div className="mb-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>Monstrando {startIndex + 1}-{Math.min(startIndex + rowsPerPage, sortedMessages.length)} de {sortedMessages.length}</span>
                    <span>Página {currentPage} de {totalPages}</span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-[560px] w-full divide-y divide-slate-200 text-left text-sm sm:min-w-full">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setSortBy('name');
                                setSortOrder((prev) => (sortBy === 'name' && prev === 'asc' ? 'desc' : 'asc'));
                              }}
                              className="flex items-center gap-1 text-left hover:text-cyan-700"
                            >
                              Nombre
                              {sortBy === 'name' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}
                            </button>
                          </th>
                          <th className="px-3 py-2 font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setSortBy('message');
                                setSortOrder((prev) => (sortBy === 'message' && prev === 'asc' ? 'desc' : 'asc'));
                              }}
                              className="flex items-center gap-1 text-left hover:text-cyan-700"
                            >
                              Mensaje
                              {sortBy === 'message' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}
                            </button>
                          </th>
                          <th className="px-3 py-2 font-semibold">
                            <button
                              type="button"
                              onClick={() => {
                                setSortBy('attending');
                                setSortOrder((prev) => (sortBy === 'attending' && prev === 'asc' ? 'desc' : 'asc'));
                              }}
                              className="flex items-center gap-1 text-left hover:text-cyan-700"
                            >
                              Asistirá
                              {sortBy === 'attending' ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : ''}
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {pagedMessages.map((item, index) => (
                          <tr key={`${item.name || 'guest'}-${startIndex + index}`} className="align-top hover:bg-slate-50">
                            <td className="px-3 py-3 font-medium">{item.name || '—'}</td>
                            <td className="max-w-xs px-3 py-3 whitespace-pre-wrap">{item.message || '—'}</td>
                            <td className="px-3 py-3">{item.attending ? 'Sí' : 'No'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 rounded-full text-sm font-semibold ${page === currentPage ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        ) : (
          <form className="mx-auto mt-6 w-full max-w-md space-y-4" onSubmit={handleAdminLogin}>
            <label className="block text-sm font-medium text-slate-700">
              Usuario
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-1 ring-slate-200 transition focus:border-cyan-400 focus:ring-cyan-400/30"
                placeholder="Ingrese usuario admin"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contraseña
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-1 ring-slate-200 transition focus:border-cyan-400 focus:ring-cyan-400/30"
                placeholder="••••••••"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              Ingresar
            </button>
            {adminError && <p className="text-sm text-rose-400">{adminError}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
