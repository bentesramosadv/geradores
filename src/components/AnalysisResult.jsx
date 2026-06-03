import { useState } from 'react'
import { FileSearch, Copy, Check, AlertCircle } from 'lucide-react'

function renderInline(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-slate-800">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function renderMarkdown(text) {
  if (!text) return null
  const lines = text.split('\n')
  const elements = []
  let key = 0
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('## ')) {
      if (inList) { elements.push(<div key={key++} className="mb-2" />); inList = false }
      elements.push(
        <h2 key={key++} className="text-base font-bold text-blue-900 mt-6 mb-2 pb-2 border-b border-blue-100 first:mt-0">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      if (inList) { elements.push(<div key={key++} className="mb-2" />); inList = false }
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-blue-800 mt-4 mb-1">
          {line.slice(4)}
        </h3>
      )
    } else if (line.match(/^[-*•] /)) {
      inList = true
      elements.push(
        <div key={key++} className="flex items-start gap-2 mb-1 ml-1">
          <span className="text-blue-400 mt-1.5 flex-shrink-0">&#8226;</span>
          <p className="text-sm text-slate-700 leading-relaxed">{renderInline(line.slice(2))}</p>
        </div>
      )
    } else if (line.match(/^\d+\. /)) {
      inList = true
      const match = line.match(/^(\d+)\. (.*)/)
      if (match) {
        elements.push(
          <div key={key++} className="flex items-start gap-2 mb-1 ml-1">
            <span className="text-blue-500 font-semibold text-xs mt-1 flex-shrink-0 w-5">{match[1]}.</span>
            <p className="text-sm text-slate-700 leading-relaxed">{renderInline(match[2])}</p>
          </div>
        )
      }
    } else if (line.trim() === '') {
      if (inList) inList = false
      elements.push(<div key={key++} className="h-2" />)
    } else {
      inList = false
      elements.push(
        <p key={key++} className="text-sm text-slate-700 mb-2 leading-relaxed">
          {renderInline(line)}
        </p>
      )
    }
  }

  return elements
}

export default function AnalysisResult({ result, loading, error }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result && !loading && !error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 min-h-96 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
          <FileSearch size={30} className="text-blue-300" />
        </div>
        <h3 className="text-slate-600 font-semibold text-base mb-2">Pronto para analisar</h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          Cole o texto da peticao, escolha o tipo de analise e clique em{' '}
          <span className="font-medium text-blue-600">Analisar Peticao</span>
        </p>
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-xs">
          {['Fatos', 'Fundamentos', 'Pedidos'].map((item) => (
            <div key={item} className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="w-8 h-1 bg-slate-200 rounded mx-auto mb-2" />
              <div className="w-full h-1 bg-slate-200 rounded mb-1" />
              <div className="w-3/4 h-1 bg-slate-200 rounded mx-auto" />
              <p className="text-xs text-slate-400 mt-2">{item}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10 min-h-96 flex flex-col items-center justify-center">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        </div>
        <h3 className="text-slate-700 font-semibold text-base mb-2">Analisando peticao...</h3>
        <p className="text-slate-400 text-sm text-center max-w-xs leading-relaxed">
          O Claude esta processando seu documento juridico
        </p>
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6 min-h-96">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-100">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 text-sm">Erro na analise</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-4 leading-relaxed">
          Verifique se a variavel <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">ANTHROPIC_API_KEY</code> esta configurada no Cloudflare Pages e tente novamente.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-96 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <h2 className="font-semibold text-slate-700 text-sm">Resultado da Analise</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
          {copied ? 'Copiado!' : 'Copiar tudo'}
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(100vh - 280px)' }}>
        {renderMarkdown(result)}
      </div>
    </div>
  )
}
