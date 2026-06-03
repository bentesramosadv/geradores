import { useState } from 'react'
import { FileSearch, Copy, Check, Download, ChevronDown, ChevronRight, Loader2, AlertCircle } from 'lucide-react'
import { downloadAsWord, downloadAllAsWord } from '../utils/wordExport'
import { AGENT_META } from './AgentSelector'

function renderInline(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold text-slate-800">{part}</strong> : part
  )
}

function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let key = 0

  for (const line of lines) {
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-sm font-bold text-blue-900 mt-5 mb-2 pb-1.5 border-b border-blue-100 first:mt-0">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xs font-semibold text-blue-800 mt-3 mb-1 uppercase tracking-wide">
          {line.slice(4)}
        </h3>
      )
    } else if (line.match(/^[-*•] /)) {
      elements.push(
        <div key={key++} className="flex gap-2 mb-1 ml-1">
          <span className="text-blue-300 mt-1.5 flex-shrink-0 text-xs">&#8226;</span>
          <p className="text-sm text-slate-700 leading-relaxed">{renderInline(line.slice(2))}</p>
        </div>
      )
    } else if (line.match(/^\d+\. /)) {
      const match = line.match(/^(\d+)\. (.*)/)
      if (match) {
        elements.push(
          <div key={key++} className="flex gap-2 mb-1 ml-1">
            <span className="text-blue-500 font-semibold text-xs mt-1 flex-shrink-0 w-4">{match[1]}.</span>
            <p className="text-sm text-slate-700 leading-relaxed">{renderInline(match[2])}</p>
          </div>
        )
      }
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-1.5" />)
    } else {
      elements.push(
        <p key={key++} className="text-sm text-slate-700 mb-1.5 leading-relaxed">
          {renderInline(line)}
        </p>
      )
    }
  }
  return elements
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handle} className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
      {copied ? 'Copiado' : 'Copiar'}
    </button>
  )
}

function AssistantMessage({ content, mode, onDownload }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          {mode && AGENT_META[mode] && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${AGENT_META[mode].badge}`}>
              {AGENT_META[mode].title}
            </span>
          )}
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
        </div>
        <div className="flex items-center gap-1">
          <CopyButton text={content} />
          <button
            onClick={onDownload}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
          >
            <Download size={12} />
            Word
          </button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto" style={{ maxHeight: '65vh' }}>
        {renderMarkdown(content)}
      </div>
    </div>
  )
}

function AllResultsView({ allResults }) {
  const [expanded, setExpanded] = useState(() => {
    const initial = {}
    Object.keys(allResults).forEach(k => { initial[k] = false })
    // auto-expand first completed
    const first = Object.entries(allResults).find(([, v]) => v.result && !v.loading)
    if (first) initial[first[0]] = true
    return initial
  })

  const agentTitles = {}
  Object.keys(allResults).forEach(k => {
    agentTitles[k] = AGENT_META[k]?.title || k
  })

  const completedCount = Object.values(allResults).filter(v => !v.loading).length
  const total = Object.keys(allResults).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {completedCount}/{total} agentes concluidos
        </p>
        {completedCount === total && (
          <button
            onClick={() => downloadAllAsWord(allResults, agentTitles)}
            className="flex items-center gap-1.5 text-xs bg-blue-900 text-white px-3 py-1.5 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Download size={12} />
            Baixar Relatorio Completo (.doc)
          </button>
        )}
      </div>
      {Object.entries(allResults).map(([mode, state]) => {
        const meta = AGENT_META[mode]
        const isOpen = expanded[mode]
        return (
          <div key={mode} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(p => ({ ...p, [mode]: !p[mode] }))}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {state.loading ? (
                  <Loader2 size={14} className="text-blue-500 animate-spin" />
                ) : state.error ? (
                  <AlertCircle size={14} className="text-red-500" />
                ) : (
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                )}
                {meta && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                    {meta.title}
                  </span>
                )}
                {state.loading && <span className="text-xs text-slate-400">Analisando...</span>}
                {state.error && <span className="text-xs text-red-500">Erro</span>}
              </div>
              {!state.loading && (isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />)}
            </button>
            {isOpen && state.result && (
              <div className="border-t border-slate-100">
                <div className="flex items-center justify-end gap-1 px-4 py-1.5 bg-slate-50 border-b border-slate-100">
                  <CopyButton text={state.result} />
                  <button
                    onClick={() => downloadAsWord(state.result, `analise-${mode}`)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                  >
                    <Download size={12} />
                    Word
                  </button>
                </div>
                <div className="p-4 max-h-80 overflow-y-auto">
                  {renderMarkdown(state.result)}
                </div>
              </div>
            )}
            {isOpen && state.error && (
              <div className="border-t border-red-100 p-4">
                <p className="text-xs text-red-600">{state.error}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ConversationView({ messages, allResults, loading, selectedAgent }) {
  const assistantMessages = messages.filter(m => m.role === 'assistant')

  if (allResults) {
    return (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Resultados</p>
        <AllResultsView allResults={allResults} />
      </div>
    )
  }

  if (!messages.length && !loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 flex flex-col items-center justify-center text-center min-h-72">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
          <FileSearch size={26} className="text-blue-300" />
        </div>
        <h3 className="text-slate-600 font-semibold text-sm mb-1.5">Pronto para analisar</h3>
        <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
          Cole o texto ou envie um arquivo PDF/DOCX, escolha o agente e clique em Analisar
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((msg, i) => {
        if (msg.role === 'user') {
          const isFirst = i === 0
          if (isFirst) return null // don't show the full petition text as a message
          return (
            <div key={i} className="flex justify-end">
              <div className="bg-blue-900 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%]">
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          )
        }
        return (
          <AssistantMessage
            key={i}
            content={msg.content}
            mode={selectedAgent}
            onDownload={() => downloadAsWord(msg.content, `analise-${selectedAgent}`)}
          />
        )
      })}

      {loading && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex items-center gap-3">
          <Loader2 size={18} className="text-blue-600 animate-spin flex-shrink-0" />
          <p className="text-sm text-slate-500">Claude esta analisando...</p>
        </div>
      )}
    </div>
  )
}
