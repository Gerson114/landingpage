"use client"
import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import LoadingScreen from "../components/loanding/index"

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true) // verifica token

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/total", {
          method: "GET",
          credentials: "include", // envia cookie JWT
        })

        if (!res.ok) {
          router.replace("/login")
        } else {
          setAuthorized(true)
        }
      } catch {
        router.replace("/login")
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router])

  if (checking) return <LoadingScreen />
  if (!authorized) return null

  return <>{children}</>
}
