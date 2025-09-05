import { Users, FileText, TrendingUp, Settings, Bell, Calendar, PieChart, Lock } from "lucide-react"

export default function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: "Gestão de Usuários",
      description: "Controle completo de usuários, permissões e hierarquias organizacionais.",
    },
    {
      icon: FileText,
      title: "Relatórios Detalhados",
      description: "Gere relatórios personalizados com filtros avançados e exportação automática.",
    },
    {
      icon: TrendingUp,
      title: "Análise de Performance",
      description: "Monitore KPIs em tempo real e identifique oportunidades de crescimento.",
    },
    {
      icon: Settings,
      title: "Configurações Flexíveis",
      description: "Personalize o dashboard de acordo com as necessidades do seu negócio.",
    },
    {
      icon: Bell,
      title: "Notificações Inteligentes",
      description: "Receba alertas importantes e mantenha-se sempre informado sobre mudanças críticas.",
    },
    {
      icon: Calendar,
      title: "Agendamento Automático",
      description: "Automatize tarefas recorrentes e nunca perca prazos importantes.",
    },
    {
      icon: PieChart,
      title: "Dashboards Visuais",
      description: "Visualize dados complexos através de gráficos interativos e intuitivos.",
    },
    {
      icon: Lock,
      title: "Controle de Acesso",
      description: "Defina permissões granulares e mantenha informações sensíveis protegidas.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Recursos Poderosos para seu Negócio</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra todas as funcionalidades que farão a diferença na gestão do seu negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-center p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
