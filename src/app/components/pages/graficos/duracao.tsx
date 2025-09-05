"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Mensagem {
  id: string
  startAt: string
  endAt?: string // Pode ser undefined
  statusDescription: string
}

interface Resumo {
  total: number
  pendentes: number
  concluidas: number
  mensagens: Mensagem[]
}

interface GraficoProps {
  resumo: Resumo
}

export default function Graficq({ resumo }: GraficoProps) {
  // Inicializa mapa de horas (6h a 18h)
  const horasMap: Record<string, { totalTempo: number; qtd: number }> = {}
  for (let h = 6; h <= 18; h++) {
    horasMap[`${h}h`] = { totalTempo: 0, qtd: 0 }
  }

  // Calcula duração de cada atendimento concluído
  resumo.mensagens.forEach((m) => {
    if (!m.endAt) return // pula se não tiver endAt
    if (m.statusDescription?.trim().toLowerCase() !== "concluído") return

    const start = new Date(m.startAt)
    const end = new Date(m.endAt)
    const diffMin = Math.max(0, (end.getTime() - start.getTime()) / 60000) // duração em minutos
    const hora = start.getHours()

    if (hora >= 6 && hora <= 18) {
      const key = `${hora}h`
      horasMap[key].totalTempo += diffMin
      horasMap[key].qtd += 1
    }
  })

  // Constrói array para o gráfico com tempo médio por hora
  const data = Object.keys(horasMap)
    .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    .map((hora) => {
      const h = horasMap[hora]
      return {
        name: hora,
        tempoMedio: h.qtd > 0 ? h.totalTempo / h.qtd : 0, // média em minutos
      }
    })

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
          <YAxis
            tick={{ fontSize: 12, fill: "#64748b" }}
            axisLine={{ stroke: "#e2e8f0" }}
            label={{ value: "Minutos", angle: -90, position: "insideLeft", fill: "#64748b" }}
          />
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)} min`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Bar dataKey="tempoMedio" name="Tempo Médio (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
