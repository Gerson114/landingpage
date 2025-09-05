"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"

interface Resultado {
  id: string
  titulo: string
  data: string
}

export default function FiltroServer({ dataInicial }: { dataInicial?: Date }) {
  const [data, setData] = useState("")
  const [resultados, setResultados] = useState<Resultado[] | null>(null)
  const [loading, setLoading] = useState(false)

  // Inicializa a data pegando do localStorage ou da prop inicial
  useEffect(() => {
    const dataSalva = localStorage.getItem("dataSelecionada")
    if (dataSalva) {
      setData(dataSalva)
    } else {
      const hoje = dataInicial || new Date()
      const dataFormatada = format(hoje, "yyyy-MM-dd")
      setData(dataFormatada)
      localStorage.setItem("dataSelecionada", dataFormatada)
    }
  }, [dataInicial])

  const handleFiltrar = async () => {
    if (!data) return
    setLoading(true)
    localStorage.setItem("dataSelecionada", data)
    try {
      const res = await fetch("http://localhost:3000/filtro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      const dataResp = await res.json()
      setResultados(dataResp)
      
      // Aguarda 5 segundos e recarrega a página
      setTimeout(() => {
        window.location.reload()
      }, 50)
    } catch (err) {
      console.error("Erro ao filtrar:", err)
      setResultados(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          type="button"
          onClick={handleFiltrar}
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 cursor-pointer hover:bg-blue-600 transition"
        >
          Filtrar
        </button>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading && resultados && resultados.length > 0 && (
        <ul>
          {resultados.map((item) => (
            <li key={item.id}>
              {item.titulo} - {item.data}
            </li>
          ))}
        </ul>
      )}

      {!loading && resultados && resultados.length === 0 && <p>Nenhum resultado</p>}
    </div>
  )
}
