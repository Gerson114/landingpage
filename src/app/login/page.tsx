"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { BarChart3, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const togglePassword = useCallback(() => setShowPassword(prev => !prev), [])
  const handleChangeEmail = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value), [])
  const handleChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:3000/cadastro/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // envia cookie HTTP-only automaticamente
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || "Falha ao efetuar login.")
      }

      // Redireciona para o dashboard/diário
      window.location.href = "/"
    } catch (err: any) {
      setError(err.message || "Erro inesperado. Tente novamente.")
      setPassword("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <BarChart3 className="h-8 w-8 text-[var(--primary)] mr-2" />
            <span className="text-2xl font-bold text-[var(--foreground)]">DashBoard Pro</span>
          </Link>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-md">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold text-[var(--card-foreground)] mb-2">Entrar na sua conta</h2>
            <p className="text-[var(--muted-foreground)]">Digite suas credenciais para acessar o dashboard</p>
          </div>

          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium text-[var(--card-foreground)]">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={handleChangeEmail}
                  required
                  className="w-full px-3 py-2 border rounded-md border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block font-medium text-[var(--card-foreground)]">Senha</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={handleChangePassword}
                    required
                    className="w-full pr-10 px-3 py-2 border rounded-md border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                  />
                  {password && (
                    <button type="button" className="absolute right-0 top-0 h-full px-3 hover:bg-transparent" onClick={togglePassword}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-[var(--muted-foreground)]" /> : <Eye className="h-4 w-4 text-[var(--muted-foreground)]" />}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-sm text-[var(--accent)] hover:text-[var(--accent)/80] transition-colors">Esqueceu a senha?</Link>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 font-medium rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)/90] disabled:opacity-50 transition-colors"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)]">
                Não tem uma conta?{" "}
                <Link href="/signup" className="font-medium text-[var(--accent)] hover:text-[var(--accent)/80] transition-colors">
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
