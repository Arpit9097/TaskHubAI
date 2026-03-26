import { AlertTriangle, X, ShieldAlert } from 'lucide-react'

export default function Alerts({ tasks }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const delayed = tasks.filter(task => {
    if (task.status === 'Completed') return false
    const deadline = new Date(task.deadline)
    return deadline < today
  })

  if (delayed.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 card-hover slide-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Alerts</h2>
            <p className="text-xs text-slate-400">System monitoring active</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <p className="text-green-400 text-sm font-medium">All tasks are on track — no delays detected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 card-hover slide-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Alerts
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full font-bold">
              {delayed.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">Deadline violations detected</p>
        </div>
      </div>

      <div className="space-y-3">
        {delayed.map((task, idx) => {
          const deadline = new Date(task.deadline)
          const daysLate = Math.floor((today - deadline) / (1000 * 60 * 60 * 24))
          return (
            <div
              key={idx}
              className="flex items-start gap-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-red-300 font-semibold text-sm">
                  ⚠️ Task <span className="font-bold">'{task.title}'</span> is delayed
                </p>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="text-xs text-slate-400">
                    Assigned to: <span className="text-slate-300">{task.assignee}</span>
                  </span>
                  <span className="text-xs text-red-400 font-medium">
                    {daysLate === 0 ? 'Due today' : `${daysLate} day${daysLate > 1 ? 's' : ''} overdue`}
                  </span>
                  <span className="text-xs text-slate-500">
                    Deadline: {deadline.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-1 rounded-full font-medium flex-shrink-0">
                {task.priority}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 border-t border-slate-700/50 pt-3">
        <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping"></div>
        Monitoring {tasks.length} active tasks in real-time
      </div>
    </div>
  )
}
