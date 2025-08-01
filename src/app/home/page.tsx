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
  reservas: Reserva[];
  totalHoras: number;
  valorTotal: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserAgrupado[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [deletando, setDeletando] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    setErro(false);

    try {
      const res = await fetch('http://localhost:3000/users');
      if (!res.ok) throw new Error('Erro na resposta da API');

      const data = await res.json();
      const agrupados = agruparPorUsuario(data);
      setUsers(agrupados);
    } catch (err) {
      setErro(true);
    } finally {
      setLoading(false);
    }
  };

  const agruparPorUsuario = (reservas: any[]): UserAgrupado[] => {
    const mapa = new Map<string, UserAgrupado>();

    reservas.forEach((item) => {
      if (!mapa.has(item.email)) {
        mapa.set(item.email, {
          nome: item.name,
          email: item.email,
          reservas: [],
          totalHoras: 0,
          valorTotal: 0,
        });
      }

      const user = mapa.get(item.email)!;
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
  };

  const formatHorario = (h: number) => `${h.toString().padStart(2, '0')}:00`;

  const intervaloHoras = (reservas: Reserva[]) => {
    const horarios = reservas.map(r => r.horario).sort((a, b) => a - b);
    return {
      inicio: formatHorario(horarios[0]),
      fim: formatHorario(horarios[horarios.length - 1]),
    };
  };

  const deletarUsuario = async (nome: string, email: string) => {
    const confirmar = confirm(`Tem certeza que deseja deletar ${nome}?`);
    if (!confirmar) return;

    try {
      setDeletando(email);

      const res = await fetch('http://localhost:3000/auth/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao deletar usuário');

      alert(data.message);
      await carregarDados();
    } catch {
      alert('Erro ao deletar usuário');
    } finally {
      setDeletando(null);
    }
  };

  if (loading) return <p className="text-center py-8 text-gray-500">🔄 Carregando...</p>;
  if (erro) return <p className="text-center py-8 text-red-600 font-semibold">Erro ao carregar os dados.</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 border-b pb-2 text-gray-800">📋 Reservas por Usuário</h1>

      {users.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">Nenhuma reserva encontrada.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map(user => (
            <div key={user.email} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">👤 {user.nome}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400 mb-4">
                  📅 {new Date(user.reservas[0]?.data).toLocaleDateString('pt-BR')}
                </p>

                <div className="grid grid-cols-3 gap-3 text-center mb-4">
                  <StatCard label="Horas" value={`${user.totalHoras}h`} color="green" />
                  <StatCard
                    label="Total"
                    value={`R$ ${user.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    color="yellow"
                  />
                  <StatCard
                    label="Intervalo"
                    value={`${intervaloHoras(user.reservas).inicio} – ${intervaloHoras(user.reservas).fim}`}
                    color="blue"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {user.reservas
                    .sort((a, b) => a.horario - b.horario)
                    .map((r) => (
                      <span
                        key={r.id}
                        title={`Dia ${new Date(r.data).toLocaleDateString()} às ${formatHorario(r.horario)}`}
                        className="bg-indigo-100 text-indigo-900 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {formatHorario(r.horario)}
                      </span>
                    ))}
                </div>
              </div>

              <button
                onClick={() => deletarUsuario(user.nome, user.email)}
                disabled={deletando === user.email}
                className={`mt-4 py-2 px-4 rounded text-sm font-semibold transition ${
                  deletando === user.email
                    ? 'bg-red-200 text-red-700 cursor-wait'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {deletando === user.email ? 'Deletando...' : '🗑 Deletar'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: 'green' | 'yellow' | 'blue' }) {
  const colorMap = {
    green: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      value: 'text-green-800',
    },
    yellow: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      value: 'text-yellow-800',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      value: 'text-blue-800',
    },
  };

  return (
    <div className={`${colorMap[color].bg} rounded-md p-2`}>
      <p className={`text-xs font-semibold uppercase ${colorMap[color].text}`}>{label}</p>
      <p className={`text-base font-bold ${colorMap[color].value}`}>{value}</p>
    </div>
  );
}
