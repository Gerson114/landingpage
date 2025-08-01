'use client';

import { useEffect, useState } from 'react';

interface Reserva {
  id: number;
  horario: number;
  data: string;
  valor: number;
}

interface UserAgrupado {
  nome: string;
  email: string;
  telefone?: string;
  reservas: Reserva[];
  totalHoras: number;
  valorTotal: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserAgrupado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletandoEmail, setDeletandoEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3000/users');
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json();
      const agrupados = agruparPorUsuario(data);
      setUsers(agrupados);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }

  function agruparPorUsuario(reservas: any[]): UserAgrupado[] {
    const mapa = new Map<string, UserAgrupado>();

    reservas.forEach((item) => {
      const email = item.email;
      if (!email) return; // ignora se não tem email

      if (!mapa.has(email)) {
        mapa.set(email, {
          nome: item.name || 'Sem nome',
          email,
          telefone: item.telefone || item.phone || '',
          reservas: [],
          totalHoras: 0,
          valorTotal: 0,
        });
      }

      const user = mapa.get(email)!;
      user.reservas.push({
        id: item.id,
        horario: item.horario,
        data: item.data,
        valor: item.valor,
      });
      user.totalHoras += 1;
      user.valorTotal += item.valor;
    });

    return Array.from(mapa.values());
  }

  function formatHorario(hora: number) {
    return `${hora.toString().padStart(2, '0')}:00`;
  }

  function intervaloHoras(reservas: Reserva[]) {
    const horarios = reservas.map((r) => r.horario).sort((a, b) => a - b);
    return {
      inicio: horarios.length > 0 ? formatHorario(horarios[0]) : '--:--',
      fim: horarios.length > 0 ? formatHorario(horarios[horarios.length - 1]) : '--:--',
    };
  }

  async function deletarUsuario(nome: string, email: string) {
    if (!confirm(`Tem certeza que deseja deletar ${nome}?`)) return;

    try {
      setDeletandoEmail(email);

      const res = await fetch('http://localhost:3000/auth/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao deletar usuário');

      alert(data.message || 'Usuário deletado com sucesso');
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao deletar usuário');
    } finally {
      setDeletandoEmail(null);
    }
  }

  if (loading)
    return (
      <p className="text-center py-8 text-gray-500">🔄 Carregando...</p>
    );

  if (error)
    return (
      <p className="text-center py-8 text-red-600 font-semibold">
        {error}
      </p>
    );

  if (users.length === 0)
    return (
      <p className="text-center py-8 text-gray-500">
        Nenhuma reserva encontrada.
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-800">
        📋 Reservas por Usuário
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user, idx) => (
          <div
            key={user.email}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between border-2 border-gray-200 hover:border-indigo-500 transition"
          >
            <div>
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-extrabold text-2xl mr-4 select-none">
                  {idx + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    👤 {user.nome}
                  </h2>
                  <p
                    className="text-md font-semibold text-indigo-700 truncate max-w-xs"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                  {user.telefone && (
                    <p
                      className="text-md font-semibold text-indigo-600 mt-1 select-text"
                      title={user.telefone}
                    >
                      📞 {user.telefone}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-base text-gray-600 font-semibold mb-6">
                📅{' '}
                {new Date(user.reservas[0]?.data).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>

              <div className="grid grid-cols-3 gap-5 text-center mb-6">
                <StatCard label="Horas" value={`${user.totalHoras}h`} color="green" />
                <StatCard
                  label="Total"
                  value={`R$ ${user.valorTotal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  })}`}
                  color="yellow"
                />
                <StatCard
                  label="Intervalo"
                  value={`${intervaloHoras(user.reservas).inicio} – ${intervaloHoras(user.reservas).fim}`}
                  color="blue"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {user.reservas
                  .sort((a, b) => a.horario - b.horario)
                  .map((r) => (
                    <span
                      key={r.id}
                      title={`Dia ${new Date(r.data).toLocaleDateString()} às ${formatHorario(
                        r.horario
                      )}`}
                      className="bg-indigo-300 text-indigo-900 px-5 py-2 rounded-full text-sm font-semibold shadow-md select-none"
                    >
                      {formatHorario(r.horario)}
                    </span>
                  ))}
              </div>
            </div>

            <button
              onClick={() => deletarUsuario(user.nome, user.email)}
              disabled={deletandoEmail === user.email}
              className={`mt-8 py-3 px-6 rounded-lg text-sm font-semibold transition ${
                deletandoEmail === user.email
                  ? 'bg-red-400 text-red-900 cursor-wait shadow-inner'
                  : 'bg-red-600 text-white hover:bg-red-700 shadow-md'
              }`}
            >
              {deletandoEmail === user.email ? 'Deletando...' : '🗑 Deletar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'green' | 'yellow' | 'blue';
}) {
  const colorMap = {
    green: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      value: 'text-green-900 font-extrabold text-xl',
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      value: 'text-yellow-900 font-extrabold text-xl',
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      value: 'text-blue-900 font-extrabold text-xl',
    },
  };

  return (
    <div className={`${colorMap[color].bg} rounded-md p-4 shadow-sm`}>
      <p className={`text-sm font-semibold uppercase ${colorMap[color].text} mb-1`}>
        {label}
      </p>
      <p className={`${colorMap[color].value}`}>{value}</p>
    </div>
  );
}
