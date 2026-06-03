import { Scale } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-blue-950 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Scale size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Analisador Juridico IA</h1>
              <p className="text-blue-300 text-sm font-light">
                Analise inteligente de peticoes com Claude AI
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-blue-900 px-4 py-2 rounded-lg border border-blue-800">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-blue-200 font-medium">Claude Sonnet</span>
          </div>
        </div>
      </div>
    </header>
  )
}
