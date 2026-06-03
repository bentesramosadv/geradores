import { useState, useEffect, useCallback } from 'react'
import { Scale } from 'lucide-react'
import Header from './components/Header'
import AgentSelector from './components/AgentSelector'
import FileUpload from './components/FileUpload'
import ConversationView from './components/ConversationView'
import HistorySidebar from './components/HistorySidebar'
import FollowUpInput from './components/FollowUpInput'

const ALL_MODES = ['completa', 'fatos', 'fundamentos', 'jurisprudencia', 'pedidos', 'ortografia', 'redacao', 'qa_bancario']
const HISTORY_KEY = 'juridico_history_v2'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

async function callApi(messages, mode) {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, mode }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Erro na API')
  return data.result
}

export default function App() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('completa')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [allResults, setAllResults] = useState(null)
  const [error, setError] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY)
      if (stored) setHistory(JSON.parse(stored))
    } catch {}
  }, [])

  const persist = useCallback((updated) => {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(updated)) } catch {}
  }, [])

  const saveToHistory = useCallback((entry) => {
    setHistory(prev => {
      const updated = [entry, ...prev].slice(0, 30)
      persist(updated)
      return updated
    })
  }, [persist])

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return
    setError('')
    setMessages([])
    setAllResults(null)

    const userContent = customPrompt.trim()
      ? `${customPrompt.trim()}\n\nPeticao para referencia:\n\n${text}`
      : `Analise a seguinte peticao:\n\n${text}`

    if (selectedAgent === 'todos') {
      const initial = {}
      ALL_MODES.forEach(m => { initial[m] = { loading: true, result: '', error: '' } })
      setAllResults({ ...initial })

      await Promise.allSettled(
        ALL_MODES.map(async (mode) => {
          try {
            const result = await callApi([{ role: 'user', content: userContent }], mode)
            setAllResults(prev => ({ ...prev, [mode]: { loading: false, result, error: '' } }))
          } catch (err) {
            setAllResults(prev => ({ ...prev, [mode]: { loading: false, result: '', error: err.message } }))
          }
        })
      )

      saveToHistory({
        id: genId(),
        timestamp: new Date().toISOString(),
        mode: 'todos',
        fileName: fileName || null,
        excerpt: text.slice(0, 120),
        messages: [],
        allResults: null,
      })
    } else {
      setLoading(true)
      try {
        const result = await callApi([{ role: 'user', content: userContent }], selectedAgent)
        const newMessages = [
          { role: 'user', content: userContent, timestamp: new Date().toISOString() },
          { role: 'assistant', content: result, timestamp: new Date().toISOString() },
        ]
        setMessages(newMessages)
        saveToHistory({
          id: genId(),
          timestamp: new Date().toISOString(),
          mode: selectedAgent,
          fileName: fileName || null,
          excerpt: text.slice(0, 120),
          messages: newMessages,
          allResults: null,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFollowUp = async () => {
    if (!followUp.trim() || loading) return
    const userMsg = { role: 'user', content: followUp, timestamp: new Date().toISOString() }
    const optimistic = [...messages, userMsg]
    setMessages(optimistic)
    setFollowUp('')
    setLoading(true)
    setError('')
    try {
      const apiMessages = optimistic.map(m => ({ role: m.role, content: m.content }))
      const result = await callApi(apiMessages, selectedAgent)
      setMessages(prev => [...prev, { role: 'assistant', content: result, timestamp: new Date().toISOString() }])
    } catch (err) {
      setError(err.message)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleLoadHistory = (entry) => {
    setText(entry.excerpt || '')
    setSelectedAgent(entry.mode === 'todos' ? 'completa' : entry.mode)
    setMessages(entry.messages || [])
    setAllResults(entry.allResults || null)
    setFileName(entry.fileName || '')
    setError('')
    setSidebarOpen(false)
  }

  const handleDeleteHistory = (id) => {
    setHistory(prev => {
      const updated = prev.filter(e => e.id !== id)
      persist(updated)
      return updated
    })
  }

  const handleClearAll = () => {
    setHistory([])
    try { localStorage.removeItem(HISTORY_KEY) } catch {}
  }

  const handleNewSession = () => {
    setText('')
    setFileName('')
    setMessages([])
    setAllResults(null)
    setError('')
    setFollowUp('')
    setCustomPrompt('')
  }

  const hasResults = messages.length > 0 || allResults !== null

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-100">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(o => !o)} />

      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-30 xl:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <HistorySidebar
          open={sidebarOpen}
          history={history}
          onLoad={handleLoadHistory}
          onDelete={handleDeleteHistory}
          onClearAll={handleClearAll}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-5">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Left: input */}
              <div className="space-y-4">
                <FileUpload
                  text={text}
                  setText={setText}
                  fileName={fileName}
                  setFileName={setFileName}
                />
                <AgentSelector selected={selectedAgent} onSelect={setSelectedAgent} />

                {/* Campo de prompt livre */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Seu Prompt</span>
                    {customPrompt && (
                      <button
                        onClick={() => setCustomPrompt('')}
                        className="ml-auto text-xs text-slate-400 hover:text-red-400 transition-colors"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <textarea
                    value={customPrompt}
                    onChange={e => setCustomPrompt(e.target.value)}
                    placeholder="Digite sua instrucao aqui... Ex: Verifique se ha pedido de tutela de urgencia para suspensao dos descontos. Foque na responsabilidade objetiva do banco pelo fortuito interno."
                    rows={3}
                    className="w-full px-4 py-3 text-sm text-slate-700 leading-relaxed resize-none focus:outline-none placeholder:text-slate-400 bg-white"
                    onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAnalyze() }}
                  />
                  <div className="px-4 py-1.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {customPrompt ? 'Sera enviado junto com a peticao como instrucao' : 'Opcional — Ctrl+Enter para analisar'}
                    </span>
                    <span className="text-xs text-slate-300">{customPrompt.length}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !text.trim()}
                    className="flex-1 py-3.5 px-5 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {loading && selectedAgent !== 'todos' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Scale size={15} />
                        {selectedAgent === 'todos' ? 'Executar Todos os Agentes' : 'Analisar Peticao'}
                      </>
                    )}
                  </button>
                  {hasResults && (
                    <button
                      onClick={handleNewSession}
                      className="px-4 py-3.5 border-2 border-slate-300 text-slate-600 hover:bg-white hover:border-slate-400 rounded-xl text-sm font-medium transition-colors bg-white"
                    >
                      + Nova
                    </button>
                  )}
                </div>

                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>

              {/* Right: results */}
              <div className="space-y-4">
                <ConversationView
                  messages={messages}
                  allResults={allResults}
                  loading={loading}
                  selectedAgent={selectedAgent}
                />
                {messages.length >= 2 && (
                  <FollowUpInput
                    value={followUp}
                    onChange={setFollowUp}
                    onSubmit={handleFollowUp}
                    loading={loading}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
