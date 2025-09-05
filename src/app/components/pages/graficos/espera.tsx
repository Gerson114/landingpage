"use client"

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
import { CheckCircle, Clock, BarChart3, TrendingUp, Timer } from "lucide-react"

interface Mensagem {
  id: string
  startAt: string
  endAt?: string  // Agora consideramos um fim para calcular tempo
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

export default function Grafic({ resumo }: GraficoProps) {
  // Inicializa mapa de horas (6h a 18h)
  const horasMap: Record<string, { totalTempo: number; qtd: number }> = {}
  for (let h = 6; h <= 18; h++) {
    horasMap[`${h}h`] = { totalTempo: 0, qtd: 0 }
  }

  // Tempo total global
  let tempoTotalGlobal = 0

  // Preenche dados calculando tempo de atendimento
  resumo.mensagens.forEach((m) => {
    const start = new Date(m.startAt)
    const hora = start.getHours()

    if (hora >= 6 && hora <= 18) {
      const key = `${hora}h`

      // Se concluída, calcular tempo entre startAt e endAt
      if (m.statusDescription?.trim().toLowerCase() === "concluído" && m.endAt) {
        const end = new Date(m.endAt)
        const diffMin = Math.max(0, (end.getTime() - start.getTime()) / 60000) // em minutos
        horasMap[key].totalTempo += diffMin
        horasMap[key].qtd += 1
        tempoTotalGlobal += diffMin
      }
    }
  })

  // Transforma em array com tempo médio por hora
  const data = Object.keys(horasMap)
    .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    .map((hora) => {
      const h = horasMap[hora]
      return {
        name: hora,
        tempoMedio: h.qtd > 0 ? h.totalTempo / h.qtd : 0,
      }
    })

  // Tempo médio geral (das horas ativas)
  const totalTempo = data.reduce((sum, d) => sum + d.tempoMedio, 0)
  const mediaGeral = data.length > 0 ? totalTempo / data.length : 0

  // Cards de desempenho
  const cards = [
    {
      title: "Total de Conversas",
      value: resumo.total,
      icon: BarChart3,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      title: "Concluídas",
      value: resumo.concluidas,
      icon: CheckCircle,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pendentes",
      value: resumo.pendentes,
      icon: Clock,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-600",
    },
    {
      title: "Tempo Médio (min)",
      value: mediaGeral.toFixed(1),
      icon: TrendingUp,
      bgColor: "bg-violet-50",
      textColor: "text-violet-700",
      iconColor: "text-violet-600",
    },
    {
      title: "Tempo Total (min)",
      value: tempoTotalGlobal.toFixed(0), // minutos totais
      icon: Timer,
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 mt-8">
      {/* Gráfico de tempo de atendimento */}
      <div className="flex-1 bg-white shadow-[3px] rounded-2xl p-8 border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tempo Médio de Atendimento por Hora</h2>
          <p className="text-gray-600 text-sm">
            Mostra o tempo médio gasto para concluir conversas em cada hora do dia
          </p>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
            <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} label={{ value: "Minutos", angle: -90, position: "insideLeft", fill: "#64748b" }} />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(1)} min`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="tempoMedio" name="Tempo Médio (min)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards de desempenho */}
      <div className="w-full lg:w-[280px] flex flex-col gap-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.title}
              className="bg-white shadow-lg rounded-[3px] p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`${card.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
