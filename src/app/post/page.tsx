'use client';

import { useState } from 'react';

export default function CadastroReserva() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    telefone: '',
    horaInicio: '01:00',
    horaFim: '01:00',
    data: '',
  });

  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/gm, '').trim();
  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const aplicarMascaraData = (valor: string) => {
    let data = valor.replace(/\D/g, '');
    if (data.length > 2) data = data.slice(0, 2) + '/' + data.slice(2);
    if (data.length > 5) data = data.slice(0, 5) + '/' + data.slice(5);
    return data.slice(0, 10);
  };

  const aplicarMascaraTelefone = (valor: string) => {
    const tel = valor.replace(/\D/g, '').slice(0, 11);
    if (tel.length <= 10) {
      return tel.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
      return tel.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
  };

  const horaStringParaNumero = (horaStr: string) => {
    return Number(horaStr.split(':')[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let novoValor = value;

    if (name === 'data') novoValor = aplicarMascaraData(value);
    if (name === 'telefone') novoValor = aplicarMascaraTelefone(value);
    if (name === 'email' || name === 'name') novoValor = sanitizeInput(value);

    setFormData((prev) => ({
      ...prev,
      [name]: novoValor,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setLoading(true);

    const nome = sanitizeInput(formData.name);
    const email = sanitizeInput(formData.email);
    const data = sanitizeInput(formData.data);
    const telefone = sanitizeInput(formData.telefone);

    if (!nome || !email || !data || !telefone) {
      setMensagem('❌ Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setMensagem('❌ E-mail inválido');
      setLoading(false);
      return;
    }

    const payload = {
      name: nome,
      email,
      telefone,
      data,
      horaInicio: horaStringParaNumero(formData.horaInicio),
      horaFim: horaStringParaNumero(formData.horaFim),
    };

    try {
      const response = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const res = await response.json();

      if (!response.ok) throw new Error(res.message || 'Erro ao cadastrar');

      setMensagem('✅ Reserva cadastrada com sucesso!');
      setFormData({
        name: '',
        email: '',
        telefone: '',
        horaInicio: '01:00',
        horaFim: '01:00',
        data: '',
      });
    } catch (err: any) {
      setMensagem(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-10 bg-white rounded-3xl shadow-xl border border-gray-200 mt-12">
      <h1 className="text-4xl font-extrabold text-center text-black mb-10">Cadastro de Horário</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
            Nome
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Seu nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
            E-mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="seuemail@exemplo.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-black mb-1">
            Telefone
          </label>
          <input
            type="text"
            name="telefone"
            id="telefone"
            placeholder="(99) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
            maxLength={15}
            inputMode="numeric"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        {/* Data */}
        <div>
          <label htmlFor="data" className="block text-sm font-medium text-black mb-1">
            Data (dd/mm/yyyy)
          </label>
          <input
            type="text"
            name="data"
            id="data"
            placeholder="Ex: 31/12/2025"
            value={formData.data}
            onChange={handleChange}
            maxLength={10}
            inputMode="numeric"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3"
          />
        </div>

        {/* Horários */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="horaInicio" className="block text-sm font-medium text-black mb-1">
              Hora Início
            </label>
            <input
              type="time"
              name="horaInicio"
              id="horaInicio"
              step={3600}
              value={formData.horaInicio}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="horaFim" className="block text-sm font-medium text-black mb-1">
              Hora Fim
            </label>
            <input
              type="time"
              name="horaFim"
              id="horaFim"
              step={3600}
              value={formData.horaFim}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>

      {mensagem && (
        <p
          className={`mt-6 text-center text-sm font-semibold ${
            mensagem.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {mensagem}
        </p>
      )}
    </div>
  );
}
