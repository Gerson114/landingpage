"use client"

import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"
import Link from "next/link"

function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  )
}

export default function HeroSection() {
  return (
    <section className="bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Gerencie seu negócio com
            <span className="text-accent block mt-2">inteligência e eficiência</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Uma plataforma completa de dashboard administrativo que centraliza todas as informações do seu negócio em um
            só lugar. Tome decisões mais inteligentes com dados em tempo real.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button className="border border-accent text-accent hover:bg-accent/10 px-8 py-3">
                Ver Demonstração
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Avançado</h3>
            <p className="text-muted-foreground">
              Visualize dados complexos de forma simples e tome decisões baseadas em insights reais.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Segurança Total</h3>
            <p className="text-muted-foreground">
              Seus dados protegidos com criptografia de ponta e controle de acesso granular.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Performance Rápida</h3>
            <p className="text-muted-foreground">
              Interface otimizada que carrega instantaneamente, mesmo com grandes volumes de dados.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
