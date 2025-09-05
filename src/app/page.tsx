"use client"

import { useState, useEffect } from "react"
import Diario from "./diario"
import LoadingScreen from "../app/components/loanding/index" // tela de carregamento
import TopMenu from "./components/header"

export default function Home() {
  const [loading, setLoading] = useState(true) // apenas para carregamento inicial

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500) // tempo do carregamento inicial
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <LoadingScreen /> // só aparece na inicialização
  }

  return (
    <>
      <TopMenu />
      <div className="">
        <Diario />
      </div>
    </>
  )
}
