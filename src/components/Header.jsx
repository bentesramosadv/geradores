import { Scale, History, X } from 'lucide-react'

export default function Header({ sidebarOpen, onToggleSidebar }) {
  return (
    <header className="bg-blue-950 text-white shadow-xl flex-shrink-0">
      <div className="max-w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-blue-800 transition-colors text-blue-300 hover:text-white"
              title="Historico de analises"
            >
              {sidebarOpen ? <X size={18} /> : <History size={18} />}
            </button>
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <Scale size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-tight">Analisador Juridico IA</h1>
              <p className="text-blue-400 text-xs font-light hidden sm:block">Powered by Claude Sonnet</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-900 px-3 py-1.5 rounded-lg border border-blue-800">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-blue-200 font-medium">Online</span>
          </div>
        </div>
      </div>
    </header>
  )
}
