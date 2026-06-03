import { useState } from 'react'
import { Scale } from 'lucide-react'
import Header from './components/Header'
import AgentSelector from './components/AgentSelector'
import TextInput from './components/TextInput'
import AnalysisResult from './components/AnalysisResult'

export default function App() {
  const [text, setText] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('completa')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return

    setLoading(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode: selectedAgent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar analise')
      }

      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const canAnalyze = text.trim().length > 0 && !loading

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-5">
            <TextInput text={text} setText={setText} />
            <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="w-full py-4 px-6 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analisando peticao...
                </>
              ) : (
                <>
                  <Scale size={20} />
                  Analisar Peticao
                </>
              )}
            </button>
          </div>

          {/* Right column */}
          <div>
            <AnalysisResult result={result} loading={loading} error={error} />
          </div>
        </div>
      </main>

      <footer className="mt-16 pb-8 text-center">
        <p className="text-xs text-slate-400">
          Analisador Juridico IA &middot; Powered by Claude Sonnet &middot; Bentes Ramos Advocacia
        </p>
      </footer>
    </div>
  )
}
