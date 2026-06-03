import { Trash2, Clock, FileText, Trash } from 'lucide-react'
import { AGENT_META } from './AgentSelector'

function groupByDate(history) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)

  const groups = { Hoje: [], Ontem: [], 'Esta semana': [], Anteriores: [] }
  history.forEach(entry => {
    const d = new Date(entry.timestamp)
    if (d >= today) groups['Hoje'].push(entry)
    else if (d >= yesterday) groups['Ontem'].push(entry)
    else if (d >= weekAgo) groups['Esta semana'].push(entry)
    else groups['Anteriores'].push(entry)
  })
  return groups
}

export default function HistorySidebar({ open, history, onLoad, onDelete, onClearAll }) {
  const groups = groupByDate(history)

  return (
    <>
      <aside
        className={`fixed xl:relative z-40 inset-y-0 left-0 xl:inset-auto flex-shrink-0 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? 'w-72' : 'w-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Historico</span>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash size={11} />
              Limpar
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
              <FileText size={28} className="text-slate-200 mb-3" />
              <p className="text-xs text-slate-400">Nenhuma analise ainda</p>
            </div>
          ) : (
            <div className="p-2 space-y-4">
              {Object.entries(groups).map(([group, items]) => {
                if (!items.length) return null
                return (
                  <div key={group}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-2 py-1">{group}</p>
                    <div className="space-y-1">
                      {items.map(entry => {
                        const meta = AGENT_META[entry.mode]
                        const time = new Date(entry.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                        return (
                          <div
                            key={entry.id}
                            className="group flex items-start gap-2 px-2 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={() => onLoad(entry)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {meta && (
                                  <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${meta.badge} text-[10px]`}>
                                    {meta.title}
                                  </span>
                                )}
                                <span className="text-[10px] text-slate-400">{time}</span>
                              </div>
                              {entry.fileName && (
                                <p className="text-xs text-blue-600 truncate">{entry.fileName}</p>
                              )}
                              <p className="text-xs text-slate-500 truncate leading-snug">{entry.excerpt}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); onDelete(entry.id) }}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all flex-shrink-0 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
