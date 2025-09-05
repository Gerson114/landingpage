import { BarChart3, CheckCircle, Clock, MessageCircle } from "lucide-react"

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-80 mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded-lg w-96 animate-pulse"></div>
        </div>

        {/* Calendar Skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {[
            { icon: BarChart3, color: "bg-blue-50" },
            { icon: CheckCircle, color: "bg-green-50" },
            { icon: Clock, color: "bg-amber-50" },
            { icon: MessageCircle, color: "bg-purple-50" },
            { icon: Clock, color: "bg-gray-50" },
          ].map((card, index) => {
            const IconComponent = card.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg animate-pulse`}>
                    <IconComponent className="w-6 h-6 text-gray-300" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-72 mb-1 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="p-6">
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse">
                  <BarChart3 className="w-8 h-8 text-gray-400" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8">
          <div className="bg-white rounded-full shadow-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Carregando dados...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
