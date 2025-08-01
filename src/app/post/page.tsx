'use client';

import { useState } from 'react';

export default function CadastroReserva() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    horaInicio: '01:00',
    horaFim: '01:00',
    data: '',
  });

  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  // Converte "HH:mm" para número (hora)
  const horaStringParaNumero = (horaStr: string) => {
    return Number(horaStr.split(':')[0]);
  };

  // Aplica máscara manual: dd/mm/yyyy
  const aplicarMascaraData = (valor: string) => {
    let data = valor.replace(/\D/g, '');
    if (data.length > 2) data = data.slice(0, 2) + '/' + data.slice(2);
    if (data.length > 5) data = data.slice(0, 5) + '/' + data.slice(5);
    return data.slice(0, 10); // Limita a 10 caracteres
  };

  // Atualiza o estado conforme o input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'data' ? aplicarMascaraData(value) : value,
    }));
  };

  // Envia os dados para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setLoading(true);

    const payload = {
      ...formData,
      horaInicio: horaStringParaNumero(formData.horaInicio),
      horaFim: horaStringParaNumero(formData.horaFim),
    };

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar');
      }

      setMensagem('✅ Reserva cadastrada com sucesso!');
      setFormData({ name: '', email: '', horaInicio: '01:00', horaFim: '01:00', data: '' });
    } catch (err: any) {
      setMensagem(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-gradient-to-tr from-white via-slate-50 to-slate-100 rounded-3xl shadow-xl border border-gray-200 mt-12">
      <h1 className="text-4xl font-extrabold text-center text-black mb-10 tracking-tight drop-shadow-sm">
        Cadastro de Horário
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-5 text-black py-3 placeholder-gray-400
                       focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600
                       transition duration-300 shadow-sm"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="seuemail@exemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 text-black px-5 py-3 placeholder-gray-400
                       focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600
                       transition duration-300 shadow-sm"
          />
        </div>

        {/* Data com máscara manual */}
        <div>
          <label htmlFor="data" className="block text-sm font-semibold text-black mb-2">
            Data (dd/mm/yyyy)
          </label>
          <input
            type="text"
            id="data"
            name="data"
            placeholder="Ex: 25/12/2025"
            value={formData.data}
            onChange={handleChange}
            maxLength={10}
            required
            inputMode="numeric"
            className="w-full rounded-lg border border-gray-300 text-black px-5 py-3 placeholder-gray-400
                       focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600
                       transition duration-300 shadow-sm"
          />
        </div>

        {/* Horas */}
        <div className="flex gap-6">
          <div className="flex-1">
            <label htmlFor="horaInicio" className="block text-sm font-semibold text-black mb-2">
              Hora Início
            </label>
            <input
              type="time"
              id="horaInicio"
              name="horaInicio"
              value={formData.horaInicio}
              onChange={handleChange}
              step={3600}
              required
              className="w-full rounded-lg border border-gray-300 text-black px-5 py-3 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600
                         transition duration-300 shadow-sm"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="horaFim" className="block text-sm font-semibold text-black mb-2">
              Hora Fim
            </label>
            <input
              type="time"
              id="horaFim"
              name="horaFim"
              value={formData.horaFim}
              onChange={handleChange}
              step={3600}
              required
              className="w-full rounded-lg border border-gray-300 text-black px-5 py-3 placeholder-gray-400
                         focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-blue-600
                         transition duration-300 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold
                     py-4 rounded-xl shadow-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>

      {mensagem && (
        <p
          className={`mt-8 text-center text-sm font-semibold select-none ${
            mensagem.startsWith('✅') ? 'text-green-700' : 'text-red-700'
          }`}
          role="alert"
        >
          {mensagem}
        </p>
      )}
    </div>
  );
}
