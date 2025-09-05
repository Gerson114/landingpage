"use client"

import { useState } from "react"
import {
  LucideIcon,
  BarChart3,
  MessageCircle,
  Users,
  Settings,
  Home,
  Calendar,
  TrendingUp,
  Bell,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"

interface MenuItem {
  name: string
  href: string
  icon: LucideIcon
  current?: boolean
  badge?: number
}

const navigation: MenuItem[] = [
  { name: "Dashboard", href: "/", icon: Home, current: true },
  { name: "Relatórios", href: "/", icon: TrendingUp },
    { name: "Clientes", href: "/clientes", icon: Users },
  { name: "Conversas", href: "/conversas", icon: MessageCircle, badge: 3 },
  { name: "Agenda", href: "/agenda", icon: Calendar },
  { name: "Notificações", href: "/notificacoes", icon: Bell, badge: 5 },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
]

export default function TopMenu() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative
                    ${item.current
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <IconComponent
                    className={`w-4 h-4 transition-colors ${
                      item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="hidden xl:block">{item.name}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-100 text-red-600 text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Desktop performance indicator */}
          <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2 border border-green-200">
            <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
              <TrendingUp className="w-3 h-3 text-white" />
            </div>
            <p className="text-xs font-medium text-green-900">+12% este mês</p>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1 max-h-96 overflow-y-auto">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.current
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`w-5 h-5 transition-colors ${
                        item.current ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            {/* Mobile performance indicator */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-900">Performance</p>
                    <p className="text-xs text-green-600">+12% este mês</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
