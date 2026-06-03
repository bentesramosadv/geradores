import { Send, Loader2 } from 'lucide-react'

export default function FollowUpInput({ value, onChange, onSubmit, loading }) {
  const handleKey = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3">
      <p className="text-xs text-slate-400 mb-2 px-1">Pergunta de acompanhamento <span className="text-slate-300">(Ctrl+Enter para enviar)</span></p>
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ex: Elabore mais sobre os pedidos... / Sugira como melhorar a introducao..."
          rows={2}
          className="flex-1 text-sm text-slate-700 border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-slate-50 placeholder:text-slate-400 leading-relaxed"
        />
        <button
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="px-4 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center flex-shrink-0 self-stretch"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}
