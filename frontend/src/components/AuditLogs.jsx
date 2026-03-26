import { ScrollText, Bot, User, Clock, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'

const logTypeConfig = {
  extract:  { icon: Bot,           color: 'text-indigo-400', bg: 'bg-indigo-500/20', line: 'bg-indigo-500' },
  assign:   { icon: User,          color: 'text-purple-400', bg: 'bg-purple-500/20',  line: 'bg-purple-500' },
  deadline: { icon: Clock,         color: 'text-blue-400',   bg: 'bg-blue-500/20',    line: 'bg-blue-500' },
  delay:    { icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/20',     line: 'bg-red-500' },
  complete: { icon: CheckCircle2,  color: 'text-green-400',  bg: 'bg-green-500/20',   line: 'bg-green-500' },
}

export default function AuditLogs({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 card-hover slide-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Audit Logs</h2>
            <p className="text-xs text-slate-400">System activity timeline</p>
          </div>
        </div>
        <div className="text-center py-8 text-slate-500">
          <ScrollText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No activity yet. Analyze a meeting to see logs.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6 card-hover slide-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <ScrollText className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Audit Logs</h2>
            <p className="text-xs text-slate-400">AI agent activity timeline</p>
          </div>
        </div>
        <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full">
          {logs.length} events
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-700/50"></div>

        <div className="space-y-1">
          {logs.map((log, idx) => {
            const cfg = logTypeConfig[log.type] || logTypeConfig.extract
            const Icon = cfg.icon
            return (
              <div
                key={idx}
                className="flex items-start gap-4 pl-2 fade-in group"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {/* Icon dot on timeline */}
                <div className={`relative z-10 w-6 h-6 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-2 border border-slate-700 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-3 h-3 ${cfg.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl px-4 py-3 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 cursor-default mb-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${cfg.color}`}>{log.message}</p>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 font-mono">{log.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border border-current/20`}>
                      {log.agent}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-slate-700/50 pt-3 flex items-center gap-2">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs text-slate-400">All agent actions are immutably recorded</span>
      </div>
    </div>
  )
}
