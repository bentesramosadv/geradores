import {
  Zap,
  BarChart3,
  FileText,
  BookOpen,
  Landmark,
  ClipboardList,
  SpellCheck,
  PenLine,
  ShieldAlert,
} from 'lucide-react'

export const AGENT_META = {
  todos: { title: 'Todos os Agentes', Icon: Zap, color: 'amber', badge: 'bg-amber-100 text-amber-800' },
  completa: { title: 'Analise Completa', Icon: BarChart3, color: 'blue', badge: 'bg-blue-100 text-blue-800' },
  fatos: { title: 'Fatos e Narrativa', Icon: FileText, color: 'purple', badge: 'bg-purple-100 text-purple-800' },
  fundamentos: { title: 'Fundamentos', Icon: BookOpen, color: 'indigo', badge: 'bg-indigo-100 text-indigo-800' },
  jurisprudencia: { title: 'Jurisprudencia', Icon: Landmark, color: 'teal', badge: 'bg-teal-100 text-teal-800' },
  pedidos: { title: 'Pedidos', Icon: ClipboardList, color: 'green', badge: 'bg-green-100 text-green-800' },
  ortografia: { title: 'Ortografia', Icon: SpellCheck, color: 'orange', badge: 'bg-orange-100 text-orange-800' },
  redacao: { title: 'Redacao', Icon: PenLine, color: 'rose', badge: 'bg-rose-100 text-rose-800' },
  qa_bancario: { title: 'QA Bancario', Icon: ShieldAlert, color: 'red', badge: 'bg-red-100 text-red-800' },
}

const AGENTS = [
  {
    id: 'todos',
    title: 'Todos os Agentes',
    description: 'Executa todos os 8 agentes em paralelo',
    Icon: Zap,
    special: true,
    ring: 'ring-amber-400',
    bg: 'bg-amber-50 border-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'qa_bancario',
    title: 'QA Bancario',
    description: 'Auditoria tecnica: fraudes PIX, emprestimos e direito bancario',
    Icon: ShieldAlert,
    ring: 'ring-red-400',
    bg: 'bg-red-50 border-red-400',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
    badge: 'bg-red-100 text-red-800',
  },
  {
    id: 'completa',
    title: 'Analise Completa',
    description: 'Analise geral de toda a peticao',
    Icon: BarChart3,
    ring: 'ring-blue-400',
    bg: 'bg-blue-50 border-blue-400',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    id: 'fatos',
    title: 'Fatos e Narrativa',
    description: 'Clareza e relevancia dos fatos',
    Icon: FileText,
    ring: 'ring-purple-400',
    bg: 'bg-purple-50 border-purple-400',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    badge: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'fundamentos',
    title: 'Fundamentos Juridicos',
    description: 'Normas, argumentacao e doutrina',
    Icon: BookOpen,
    ring: 'ring-indigo-400',
    bg: 'bg-indigo-50 border-indigo-400',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    badge: 'bg-indigo-100 text-indigo-800',
  },
  {
    id: 'jurisprudencia',
    title: 'Jurisprudencia',
    description: 'STF, STJ, sumulas e precedentes',
    Icon: Landmark,
    ring: 'ring-teal-400',
    bg: 'bg-teal-50 border-teal-400',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-700',
    badge: 'bg-teal-100 text-teal-800',
  },
  {
    id: 'pedidos',
    title: 'Pedidos',
    description: 'Clareza e completude dos requerimentos',
    Icon: ClipboardList,
    ring: 'ring-green-400',
    bg: 'bg-green-50 border-green-400',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    badge: 'bg-green-100 text-green-800',
  },
  {
    id: 'ortografia',
    title: 'Ortografia',
    description: 'Revisao gramatical e ortografica',
    Icon: SpellCheck,
    ring: 'ring-orange-400',
    bg: 'bg-orange-50 border-orange-400',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
    badge: 'bg-orange-100 text-orange-800',
  },
  {
    id: 'redacao',
    title: 'Melhoria da Redacao',
    description: 'Clareza, coesao e estilo juridico',
    Icon: PenLine,
    ring: 'ring-rose-400',
    bg: 'bg-rose-50 border-rose-400',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-800',
  },
]

export default function AgentSelector({ selected, onSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Agente de Analise</p>
      <div className="grid grid-cols-3 gap-2">
        {AGENTS.map((agent) => {
          const isSelected = selected === agent.id
          return (
            <button
              key={agent.id}
              onClick={() => onSelect(agent.id)}
              className={`text-left p-2.5 rounded-xl border-2 transition-all duration-150 group ${
                isSelected
                  ? `${agent.bg} shadow-sm`
                  : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
              } ${agent.special && !isSelected ? 'border-dashed border-amber-300' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 ${isSelected ? agent.iconBg : 'bg-slate-200 group-hover:' + agent.iconBg}`}>
                <agent.Icon size={14} className={isSelected ? agent.iconColor : 'text-slate-500'} />
              </div>
              <p className={`text-xs font-semibold leading-tight ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                {agent.title}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
