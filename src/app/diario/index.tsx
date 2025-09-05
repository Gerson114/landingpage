"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Clock, CheckCircle, BarChart3, Target, RefreshCw, TrendingUp, Activity } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"

// ====================== Tipos ======================
interface BancoData {
  id: number
  data: string
  total: number
  andamento: number
  pendentes: number
  concluido: number
  pendenteAntes: number
  userId: number
}

interface GraficoDataPoint {
  hora: number
  concluidos: number
  total: number
  timestamp: Date
}

// ====================== Funções auxiliares ======================
function calcularTotais(dados: BancoData[]) {
  const total = dados.reduce((acc, item) => acc + item.total, 0)
  const andamento = dados.reduce((acc, item) => acc + item.andamento, 0)
  const pendentes = dados.reduce((acc, item) => acc + item.pendentes, 0)
  const concluido = dados.reduce((acc, item) => acc + item.concluido, 0)
  const pendenteAntes = dados.reduce((acc, item) => acc + item.pendenteAntes, 0)

  return {
    total,
    andamento,
    pendentes,
    concluido,
    pendenteAntes,
    percAndamento: total > 0 ? (andamento / total) * 100 : 0,
    percPendentes: total > 0 ? (pendentes / total) * 100 : 0,
    percConcluido: total > 0 ? (concluido / total) * 100 : 0,
    percPendenteAntes: total > 0 ? (pendenteAntes / total) * 100 : 0,
  }
}

// ====================== Componentes ======================
function Card({
  title,
  value,
  perc,
  icon: Icon,
  gradient,
  description,
}: {
  title: string
  value: number
  perc?: number
  icon: React.ElementType
  gradient: string
  description: string
}) {
  return (
    <div className="group relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`p-4 rounded-2xl ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-7 h-7 text-white drop-shadow-sm" />
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-gray-900 mb-1 tracking-tight">{value.toLocaleString("pt-BR")}</p>
            {perc !== undefined && (
              <div className="flex items-center justify-end gap-1">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-600">{perc.toFixed(1)}%</p>
              </div>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 text-balance">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

function FiltroDia({
  diaSelecionado,
  onDiaChange,
}: {
  diaSelecionado: string
  onDiaChange: (dia: string) => void
}) {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Filtrar por Período</h3>
            <p className="text-sm text-gray-600">Selecione um dia específico para análise</p>
          </div>
        </div>
        <div className="flex-1 max-w-xs">
          <input
            type="date"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
            value={diaSelecionado}
            onChange={(e) => onDiaChange(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>
    </div>
  )
}

function GraficoAnalitico({ diaSelecionado }: { diaSelecionado: string }) {
  const [graficoData, setGraficoData] = useState<GraficoDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [rawData, setRawData] = useState<{ [key: string]: any[] }>({})

  useEffect(() => {
    async function fetchAllData() {
      try {
        setIsLoading(true)
        const res = await fetch("http://localhost:3000/grafico/get", {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Dados não encontrados")
        const data = await res.json()
        setRawData(data)
        setErro(null)
      } catch (err: any) {
        setErro(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAllData()
  }, [])

  useEffect(() => {
    if (Object.keys(rawData).length > 0 && diaSelecionado) {
      // Transformar YYYY-MM-DD → DD/MM/YYYY
      const [year, month, day] = diaSelecionado.split("-")
      const formattedDate = `${day}/${month}/${year}`

      const apiDataMap = new Map()
      if (rawData[formattedDate]) {
        rawData[formattedDate].forEach((item: any) => {
          if (item.hora >= 8 && item.hora <= 19) {
            apiDataMap.set(item.hora, item)
          }
        })
      }

      const completeData: GraficoDataPoint[] = []
      for (let hour = 8; hour <= 19; hour++) {
        const item = apiDataMap.get(hour)
        const concluidos = item ? item.concluidos : 0
        const total = item ? item.total : 0
        const timestamp = new Date(`${diaSelecionado}T${String(hour).padStart(2, "0")}:00:00`)

        completeData.push({ hora: hour, concluidos, total, timestamp })
      }

      setGraficoData(completeData)
    }
  }, [diaSelecionado, rawData])

  if (isLoading)
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Carregando dados do gráfico...</p>
      </div>
    )

  if (erro)
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-red-200 p-12 text-center">
        <p className="text-red-600 font-medium">Erro ao carregar o gráfico: {erro}</p>
      </div>
    )

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-8 py-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-1 text-balance">Performance Horária</h2>
            <p className="text-gray-600 text-lg">Análise detalhada de registros concluídos ao longo do dia</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {graficoData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">Não há dados para exibir o gráfico neste dia.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={450}>
            <AreaChart data={graficoData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis
                dataKey="hora"
                domain={[8, 19]}
                ticks={[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]}
                tickFormatter={(hora: number) => `${String(hora).padStart(2, "0")}h`}
                stroke="#64748b"
                fontSize={12}
                fontWeight={500}
              />
              <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
              <Tooltip
                labelFormatter={(hora: number) => `Horário: ${String(hora).padStart(2, "0")}:00`}
                formatter={(value: number, name: string) => [
                  value.toLocaleString("pt-BR"),
                  name === "concluidos" ? "Registros Concluídos" : name,
                ]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "12px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  fontWeight: "600",
                  paddingTop: "20px",
                }}
              />
              <Area
                type="monotone"
                dataKey="concluidos"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#colorConcluidos)"
                name="Registros Concluídos"
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#ffffff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ====================== Componente Principal ======================
export default function BancoPage() {
  const [dados, setDados] = useState<BancoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [diaSelecionado, setDiaSelecionado] = useState<string>("")
  const [tempoAtual, setTempoAtual] = useState<Date>(new Date())

  // Dia atual
  useEffect(() => {
    const hoje = new Date()
    hoje.setUTCHours(0, 0, 0, 0)
    setDiaSelecionado(hoje.toISOString().slice(0, 10))
  }, [])

  // Buscar dados
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const res = await fetch("http://localhost:3000/banco", {
          method: "GET",
          credentials: "include",
        })

        if (res.status === 401) {
          window.location.href = "/login"
          return
        }

        if (!res.ok) throw new Error("Erro ao buscar dados")

        const data: BancoData[] = await res.json()
        setDados(data.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()))
        setErro(null)
      } catch (err: any) {
        setErro(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 120000)
    return () => clearInterval(interval)
  }, [])

  // Atualizar hora a cada 5min
  useEffect(() => {
    const timer = setInterval(() => setTempoAtual(new Date()), 300000)
    return () => clearInterval(timer)
  }, [])

  const dadosFiltrados = useMemo(() => {
    return dados.filter((item) => new Date(item.data).toISOString().slice(0, 10) === diaSelecionado)
  }, [dados, diaSelecionado])

  const totais = calcularTotais(dadosFiltrados)

  const cardsData = [
    {
      title: "Total de Registros",
      value: totais.total,
      icon: BarChart3,
      gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
      description: "Volume total de registros processados no período selecionado",
    },
    {
      title: "Em Processamento",
      value: totais.andamento,
      perc: totais.percAndamento,
      icon: RefreshCw,
      gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
      description: "Registros atualmente sendo processados pelo sistema",
    },
    {
      title: "Aguardando",
      value: totais.pendentes,
      perc: totais.percPendentes,
      icon: Clock,
      gradient: "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500",
      description: "Registros na fila aguardando processamento",
    },
    {
      title: "Finalizados",
      value: totais.concluido,
      perc: totais.percConcluido,
      icon: CheckCircle,
      gradient: "bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700",
      description: "Registros processados com sucesso e finalizados",
    },
    {
      title: "Pendências Anteriores",
      value: totais.pendenteAntes,
      perc: totais.percPendenteAntes,
      icon: Target,
      gradient: "bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700",
      description: "Registros pendentes de períodos anteriores",
    },
  ]

  // ====================== Renderizações ======================
  if (erro) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-red-200 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Erro no Sistema</h3>
          <p className="text-red-600 mb-6 leading-relaxed">{erro}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || diaSelecionado === "") {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="animate-spin w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-6"></div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Carregando Dashboard</h3>
          <p className="text-gray-600 leading-relaxed">Aguarde enquanto coletamos e processamos os dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 text-balance">
              Dashboard Analítico
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Acompanhe o desempenho e métricas dos processos bancários em tempo real
            </p>
          </div>
          <div className="text-right bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <p className="text-sm text-gray-500 font-medium">Última atualização</p>
            <p className="text-2xl font-bold text-gray-900">{tempoAtual.toLocaleTimeString("pt-BR")}</p>
            <p className="text-sm text-gray-500">{tempoAtual.toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        {/* Filtro */}
        <FiltroDia diaSelecionado={diaSelecionado} onDiaChange={setDiaSelecionado} />

        {/* Cards */}
        {dadosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {cardsData.map((card) => (
              <Card key={card.title} {...card} />
            ))}
          </div>
        )}

        {/* Gráfico */}
        <div className="mb-12">
          <GraficoAnalitico diaSelecionado={diaSelecionado} />
        </div>

        {/* Lista de registros */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-8 py-8 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-1">Detalhamento de Registros</h2>
                <p className="text-gray-600 text-lg">Análise detalhada dos registros do período selecionado</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {dadosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xl font-medium">Não há registros para o dia selecionado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {dadosFiltrados.map((item) => {
                  const total = item.total || 1
                  return (
                    <div
                      key={item.id}
                      className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          {new Date(item.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </h3>
                        <span className="px-4 py-2 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 shadow-sm">
                          {item.total.toLocaleString("pt-BR")}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium text-gray-600">
                              <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                              Processando
                            </span>
                            <span className="font-bold text-blue-600 text-lg">
                              {item.andamento}{" "}
                              <span className="text-sm">({((item.andamento / total) * 100).toFixed(1)}%)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium text-gray-600">
                              <Clock className="h-4 w-4 mr-2 text-amber-500" />
                              Aguardando
                            </span>
                            <span className="font-bold text-amber-600 text-lg">
                              {item.pendentes}{" "}
                              <span className="text-sm">({((item.pendentes / total) * 100).toFixed(1)}%)</span>
                            </span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium text-gray-600">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                              Finalizados
                            </span>
                            <span className="font-bold text-green-600 text-lg">
                              {item.concluido}{" "}
                              <span className="text-sm">({((item.concluido / total) * 100).toFixed(1)}%)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="flex items-center text-sm font-medium text-gray-600">
                              <Target className="h-4 w-4 mr-2 text-purple-500" />
                              Pend. Anterior
                            </span>
                            <span className="font-bold text-purple-600 text-lg">
                              {item.pendenteAntes}{" "}
                              <span className="text-sm">({((item.pendenteAntes / total) * 100).toFixed(1)}%)</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-700">Taxa de Conclusão</span>
                          <span className="text-2xl font-black text-gray-900">
                            {((item.concluido / total) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-sm"
                            style={{ width: `${(item.concluido / total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
