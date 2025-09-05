"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { MessageCircle, CheckCircle, Clock, BarChart3, TrendingUp, RefreshCw, ArrowDown, Minus } from "lucide-react"
import Grafico from "./grafico"

interface Mensagem {
  id: string
  createdAt: string
  startAt: string
  endAt: string | null
  statusDescription: string
  number: string
  companyId?: string
}

interface TotaisAPI {
  total: number
  concluidas: number
  pendentes: number
  novos: number
  andamento: number
  mensagens: Mensagem[]
}

async function getTotais(): Promise<TotaisAPI> {
  const res = await fetch("http://localhost:3000/total", {
    cache: "no-store",
    credentials: "include",
  })
  if (!res.ok) throw new Error(`Erro na API: ${res.status}`)
  const data = await res.json()
  if (!data.totalConversasHoje) throw new Error("Formato inesperado da API")
  return data.totalConversasHoje
}

/* ---------------- Calendário ---------------- */
function Calendario({ anoSelecionado, onChange }: { anoSelecionado: string; onChange: (ano: string) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Filtro de Ano</h3>
          <p className="text-sm text-slate-600">Selecione o ano para análise</p>
        </div>
      </div>
      <input
        type="number"
        min="2000"
        max={new Date().getFullYear()}
        className="w-full md:w-auto border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
        value={anoSelecionado}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

/* ---------------- Card ---------------- */
function Card({
  title,
  value,
  icon: Icon,
  gradient,
  description,
  percentual,
}: {
  title: string
  value: number
  icon: React.ElementType
  gradient: string
  description: string
  percentual: number | "Novo"
}) {
  const isNovo = percentual === "Novo"
  const valorNum = typeof percentual === "number" ? percentual : 0
  const cor = isNovo ? "text-emerald-600" : valorNum > 0 ? "text-emerald-600" : valorNum < 0 ? "text-red-600" : "text-slate-500"
  const IconePercentual = () => (isNovo || valorNum > 0 ? <TrendingUp className="w-4 h-4" /> : valorNum < 0 ? <ArrowDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />)
  const textoPercentual = () => (isNovo ? "Novo" : valorNum > 0 ? `+${valorNum.toFixed(0)}%` : `${valorNum.toFixed(0)}%`)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-slate-900 mb-1">{value.toLocaleString()}</p>
          <div className={`flex items-center justify-end gap-1 ${cor}`}>
            <IconePercentual />
            <span className="text-sm font-medium">{textoPercentual()}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  )
}

/* ---------------- Helpers ---------------- */
function calcularPercentualAnoAnterior(atual: number, anterior: number): number | "Novo" {
  if (anterior === 0) return atual > 0 ? "Novo" : 0
  if (atual === 0) return -100
  return ((atual - anterior) / anterior) * 100
}

function calcularTotais(mensagens: Mensagem[]) {
  const total = mensagens.length
  const concluidas = mensagens.filter(m => m.statusDescription === "Concluído").length
  const pendentes = mensagens.filter(m => m.statusDescription === "Pendente").length
  const andamento = mensagens.filter(m => m.statusDescription === "Andamento").length

  // Novos = total - pendentes
  const novos = total - pendentes
  return { total, concluidas, pendentes, andamento, novos }
}

/* ---------------- Dashboard Anual ---------------- */
export default function DashboardAnual() {
  const [totais, setTotais] = useState<TotaisAPI | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [anoSelecionado, setAnoSelecionado] = useState<string>(new Date().getFullYear().toString())
  const [tempoAtual, setTempoAtual] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const dados = await getTotais()
        setTotais({ ...dados, mensagens: dados.mensagens.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) })
        setErro(null)
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 120000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setTempoAtual(new Date()), 300000)
    return () => clearInterval(timer)
  }, [])

  const mensagensFiltradas = useMemo(() => totais?.mensagens.filter(m => m.startAt.startsWith(anoSelecionado)) || [], [totais, anoSelecionado])
  const anoAnterior = (parseInt(anoSelecionado) - 1).toString()
  const mensagensAnoAnterior = useMemo(() => totais?.mensagens.filter(m => m.startAt.startsWith(anoAnterior)) || [], [totais, anoAnterior])

  const totaisAnoAtual = useMemo(() => calcularTotais(mensagensFiltradas), [mensagensFiltradas])
  const totaisAnoAnterior = useMemo(() => calcularTotais(mensagensAnoAnterior), [mensagensAnoAnterior])

  const cardsData = [
    { title: "Total de Conversas", value: totaisAnoAtual.total, icon: BarChart3, gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600", description: "Conversas registradas no ano", percentual: calcularPercentualAnoAnterior(totaisAnoAtual.total, totaisAnoAnterior.total) },
    { title: "Concluídas", value: totaisAnoAtual.concluidas, icon: CheckCircle, gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600", description: "Atendimentos finalizados", percentual: calcularPercentualAnoAnterior(totaisAnoAtual.concluidas, totaisAnoAnterior.concluidas) },
    { title: "Pendentes", value: totaisAnoAtual.pendentes, icon: Clock, gradient: "bg-gradient-to-br from-amber-500 to-amber-600", description: "Aguardando resolução", percentual: calcularPercentualAnoAnterior(totaisAnoAtual.pendentes, totaisAnoAnterior.pendentes) },
    { title: "Novos", value: totaisAnoAtual.novos, icon: MessageCircle, gradient: "bg-gradient-to-br from-purple-500 to-purple-600", description: "Conversas iniciadas (total - pendentes)", percentual: calcularPercentualAnoAnterior(totaisAnoAtual.novos, totaisAnoAnterior.novos) },
    { title: "Em Andamento", value: totaisAnoAtual.andamento, icon: RefreshCw, gradient: "bg-gradient-to-br from-blue-500 to-blue-600", description: "Atendimentos ativos", percentual: calcularPercentualAnoAnterior(totaisAnoAtual.andamento, totaisAnoAnterior.andamento) },
  ]

  if (erro) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-md w-full text-center">
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Erro no Sistema</h3>
        <p className="text-red-600 mb-4">{erro}</p>
        <button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors duration-200">Tentar Novamente</button>
      </div>
    </div>
  )

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">Carregando Dashboard</h3>
        <p className="text-slate-600">Aguarde enquanto coletamos os dados...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Dashboard Analítico Anual
            </h1>
            <p className="text-lg text-slate-600">Acompanhe o desempenho das suas conversas por ano</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Última atualização</p>
            <p className="text-lg font-semibold text-slate-900">{tempoAtual.toLocaleTimeString()}</p>
          </div>
        </div>

        <Calendario anoSelecionado={anoSelecionado} onChange={setAnoSelecionado} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {cardsData.map((card) => (<Card key={card.title} {...card} />))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-6 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg"><BarChart3 className="w-6 h-6 text-indigo-600" /></div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Análise de Conversas por Mês</h2>
              <p className="text-slate-600 mt-1">Distribuição de conversas concluídas, pendentes e em andamento ao longo do ano</p>
            </div>
          </div>
          <div className="p-8">
            <Grafico totais={totais!} mesSelecionado={anoSelecionado} isAnual />
          </div>
        </div>
      </div>
    </div>
  )
}
