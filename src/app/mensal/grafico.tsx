"use client"

import { useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface Mensagem {
  id: string
  startAt: string
  statusDescription: string
}

interface Totais {
  mensagens: Mensagem[]
}

interface GraficoProps {
  totais: Totais
  mesSelecionado: string // "YYYY-MM"
}

export default function Grafico({ totais, mesSelecionado }: GraficoProps) {
  const { data, statusKeys } = useMemo(() => {
    const [ano, mes] = mesSelecionado.split("-").map(Number)
    const numDias = new Date(ano, mes, 0).getDate()

    const diasMap: Record<string, { recebidos: number; concluidas: number; pendentes: number; andamento: number }> = {}

    for (let d = 1; d <= numDias; d++) {
      diasMap[`${d}`] = { recebidos: 0, concluidas: 0, pendentes: 0, andamento: 0 }
    }

    totais.mensagens.forEach((msg) => {
      const dataMsg = new Date(msg.startAt)
      if (dataMsg.getFullYear() !== ano || dataMsg.getMonth() + 1 !== mes) return

      const dia = dataMsg.getDate()
      const key = `${dia}`
      const status = msg.statusDescription?.trim().toLowerCase() ?? ""

      diasMap[key].recebidos += 1
      if (status === "concluído") diasMap[key].concluidas += 1
      else if (status === "em andamento") diasMap[key].andamento += 1
      else diasMap[key].pendentes += 1
    })

    const dataArray = Array.from({ length: numDias }, (_, i) => {
      const dia = `${i + 1}`
      return { name: dia, ...diasMap[dia] }
    })

    const statusKeysArray = ["concluidas", "pendentes", "andamento"]
    return { data: dataArray, statusKeys: statusKeysArray }
  }, [totais.mensagens, mesSelecionado])

  return (
    <div className="w-full flex flex-col gap-8 mt-8">
      <div className="flex-1 bg-white shadow-lg rounded-[3px] p-8 border border-gray-100">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 0, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} />
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
            <Area
              type="monotone"
              dataKey="recebidos"
              name="Recebidos"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="concluidas"
              name="Concluídas"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="pendentes"
              name="Pendentes"
              stackId="1"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="andamento"
              name="Em andamento"
              stackId="1"
              stroke="#808080"
              fill="#808080"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
