import {
  BarChart3,
  FileText,
  BookOpen,
  Landmark,
  ClipboardList,
  SpellCheck,
  PenLine,
} from 'lucide-react'

const AGENTS = [
  {
    id: 'completa',
    title: 'Analise Completa',
    description: 'Analise geral: estrutura, fatos, fundamentos, pedidos e redacao',
    Icon: BarChart3,
    selectedBorder: 'border-blue-500',
    selectedBg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'fatos',
    title: 'Fatos e Narrativa',
    description: 'Clareza, cronologia e relevancia juridica dos fatos narrados',
    Icon: FileText,
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'fundamentos',
    title: 'Fundamentos Juridicos',
    description: 'Analise das normas, argumentacao e embasamento legal',
    Icon: BookOpen,
    selectedBorder: 'border-indigo-500',
    selectedBg: 'bg-indigo-50',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'jurisprudencia',
    title: 'Jurisprudencia',
    description: 'Avaliacao e sugestao de precedentes do STF, STJ e tribunais',
    Icon: Landmark,
    selectedBorder: 'border-teal-500',
    selectedBg: 'bg-teal-50',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    badge: 'bg-teal-100 text-teal-800',
  },
  {
    id: 'pedidos',
    title: 'Pedidos',
    description: 'Clareza, completude e adequacao tecnica dos requerimentos',
    Icon: ClipboardList,
    selectedBorder: 'border-green-500',
    selectedBg: 'bg-green-50',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
  },
  {
    id: 'ortografia',
    title: 'Correcao Ortografica',
    description: 'Revisao completa de ortografia, gramatica e pontuacao',
    Icon: SpellCheck,
    selectedBorder: 'border-orange-500',
    selectedBg: 'bg-orange-50',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'redacao',
    title: 'Melhoria da Redacao',
    description: 'Clareza, coesao, persuasividade e estilo juridico',
    Icon: PenLine,
    selectedBorder: 'border-rose-500',
    selectedBg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-800',
  },
]

export default function AgentSelector({ selected, onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Tipo de Analise
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AGENTS.map((agent) => {
          const isSelected = selected === agent.id
          return (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? `${agent.selectedBorder} ${agent.selectedBg} shadow-sm`
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${agent.iconBg}`}>
                  <agent.Icon size={18} className={agent.iconColor} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">{agent.title}</span>
                    {isSelected && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.badge}`}>
                        Ativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{agent.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
