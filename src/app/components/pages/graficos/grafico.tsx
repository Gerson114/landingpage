"use client"

import { useEffect, useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface Mensagem {
  id: string
  startAt: string
  statusDescription: string // obrigatório para o gráfico
}

interface Totais {
  mensagens: Mensagem[]
}

interface GraficoProps {
  totais: Totais
}

export default function Grafico({ totais }: GraficoProps) {
  const [horaAtual, setHoraAtual] = useState(new Date().getHours())

  // Atualiza hora a cada minuto
  useEffect(() => {
    const timer = setInterval(() => setHoraAtual(new Date().getHours()), 60_000)
    return () => clearInterval(timer)
  }, [])

  // Processa os dados para o gráfico
  const data = useMemo(() => {
    const horasMap: Record<
      string,
      { recebidos: number; concluidas: number; pendentes: number; andamento: number }
    > = {}

    // Inicializa horas das 8h às 16h
    for (let h = 8; h <= 16; h++) {
      horasMap[`${h}h`] = { recebidos: 0, concluidas: 0, pendentes: 0, andamento: 0 }
    }

    let pendentesAntesTotal = 0

    totais.mensagens.forEach((msg) => {
      const dataMsg = new Date(msg.startAt)
      const hora = dataMsg.getHours()
      const status = (msg.statusDescription ?? "").trim().toLowerCase()

      // Contabiliza pendentes de antes
      if (status === "pendentes (antes)") {
        pendentesAntesTotal += 1
        return
      }

      if (hora < 8 || hora > 16) return

      const key = `${hora}h`
      horasMap[key].recebidos += 1

      if (status === "concluído") horasMap[key].concluidas += 1
      else if (status === "andamento") horasMap[key].andamento += 1
      else if (status === "pendente") horasMap[key].pendentes += 1
    })

    // Acumula pendentes e andamento até a hora atual
    let pendentesAcum = pendentesAntesTotal
    let andamentoAcum = 0
    for (let h = 8; h <= horaAtual && h <= 16; h++) {
      const key = `${h}h`
      pendentesAcum += horasMap[key].pendentes
      andamentoAcum += horasMap[key].andamento

      if (h !== horaAtual) {
        horasMap[key].pendentes = 0
        horasMap[key].andamento = 0
      } else {
        horasMap[key].pendentes = pendentesAcum
        horasMap[key].andamento = andamentoAcum
      }
    }

    // Converte mapa em array ordenado
    return Object.keys(horasMap)
      .sort((a, b) => Number(a.replace("h", "")) - Number(b.replace("h", "")))
      .map((h) => ({
        name: h,
        recebidos: horasMap[h].recebidos,
        concluidas: horasMap[h].concluidas,
        pendentes: horasMap[h].pendentes,
        andamento: horasMap[h].andamento,
      }))
  }, [totais.mensagens, horaAtual])

  return (
    <div className="w-full flex flex-col gap-8 mt-8">
      <div className="flex-1 bg-white shadow-lg rounded-[3px] p-8 border border-gray-100">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 0, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="recebidos" name="Recebidos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="concluidas" name="Concluídas" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pendentes" name="Pendentes" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="andamento" name="Em andamento" fill="#6b7280" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
