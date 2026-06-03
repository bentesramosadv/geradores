import { Trash2 } from 'lucide-react'

export default function TextInput({ text, setText }) {
  const charCount = text.length
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Texto da Peticao
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">
            {charCount.toLocaleString('pt-BR')} caracteres &middot; {wordCount.toLocaleString('pt-BR')} palavras
          </span>
          {text && (
            <button
              onClick={() => setText('')}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={13} />
              Limpar
            </button>
          )}
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole o texto da sua peticao aqui para analise..."
        className="w-full h-72 p-4 text-slate-700 text-sm leading-relaxed border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400 transition-all duration-200"
        spellCheck={false}
      />
    </div>
  )
}
