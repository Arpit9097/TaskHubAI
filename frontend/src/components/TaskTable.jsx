import { CheckCircle2, Clock, AlertTriangle, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const priorityConfig = {
  High:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    dot: 'bg-red-400' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  Low:    { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  dot: 'bg-green-400' },
}

const statusConfig = {
  Pending:   { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: Clock },
  Completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle2 },
  Delayed:   { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: AlertTriangle },
}

function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority] || priorityConfig.Low
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      {priority}
    </span>
  )
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Pending
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  )
}

function getStatus(task) {
  if (task.status === 'Completed') return 'Completed'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(task.deadline)
  if (deadline < today) return 'Delayed'
  return 'Pending'
}

export default function TaskTable({ tasks, onToggleStatus }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const enriched = tasks.map(t => ({ ...t, computedStatus: getStatus(t) }))

  return (
    <div className="glass rounded-2xl p-6 card-hover slide-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Task Dashboard</h2>
          <p className="text-xs text-slate-400">{tasks.length} tasks extracted by AI agents</p>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            ✅ {enriched.filter(t => t.computedStatus === 'Completed').length} Done
          </span>
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            ⏳ {enriched.filter(t => t.computedStatus === 'Pending').length} Pending
          </span>
          <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            🚨 {enriched.filter(t => t.computedStatus === 'Delayed').length} Delayed
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              {['Task Title', 'Assignee', 'Deadline', 'Priority', 'Status', 'Action'].map(col => (
                <th key={col} className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-4">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {enriched.map((task, idx) => {
              const isDelayed = task.computedStatus === 'Delayed'
              return (
                <tr
                  key={idx}
                  className={`transition-colors duration-200 ${isDelayed ? 'bg-red-500/5' : 'hover:bg-slate-800/40'}`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isDelayed && <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                      <span className={`font-medium ${isDelayed ? 'text-red-300' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                        {task.assignee.charAt(0)}
                      </div>
                      <span className="text-slate-300">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono text-xs ${isDelayed ? 'text-red-400' : 'text-slate-300'}`}>
                      {new Date(task.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={task.computedStatus} />
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleStatus(idx)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-indigo-500/10"
                    >
                      {task.status === 'Completed' ? 'Reopen' : 'Complete'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
