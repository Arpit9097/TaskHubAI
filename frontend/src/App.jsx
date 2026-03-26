import { useState } from 'react'
import InputBox from './components/InputBox'
import TaskTable from './components/TaskTable'
import Alerts from './components/Alerts'
import AuditLogs from './components/AuditLogs'
import { Brain, Workflow, Cpu, ChartBar, Activity } from 'lucide-react'

const DUMMY_TASKS = [
  { title: 'Fix login bug',           assignee: 'Dev Team',  deadline: '2026-03-25', priority: 'High',   status: 'Pending' },
  { title: 'Design landing page',     assignee: 'Arpit',     deadline: '2026-03-28', priority: 'Medium', status: 'Pending' },
  { title: 'Write quarterly report',  assignee: 'Meera',     deadline: '2026-03-30', priority: 'Medium', status: 'Pending' },
  { title: 'Security audit review',   assignee: 'Dev Team',  deadline: '2026-04-02', priority: 'High',   status: 'Pending' },
  { title: 'AI integration demo',     assignee: 'Arpit',     deadline: '2026-03-31', priority: 'High',   status: 'Pending' },
  { title: 'Update API documentation',assignee: 'Sarah',     deadline: '2026-03-24', priority: 'Low',    status: 'Pending' },
]

function generateLogs(tasks) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const base = [
    { type: 'extract',  message: `Extraction Agent parsed transcript — found ${tasks.length} action items`, time: timeStr, agent: 'Extraction Agent' },
    { type: 'assign',   message: `Assignment Agent allocated tasks to ${[...new Set(tasks.map(t => t.assignee))].join(', ')}`, time: timeStr, agent: 'Assignment Agent' },
    { type: 'deadline', message: `Deadline Agent generated deadlines based on task priority & capacity`, time: timeStr, agent: 'Deadline Agent' },
    { type: 'extract',  message: `Priority Agent scored ${tasks.length} tasks (High/Medium/Low)`, time: timeStr, agent: 'Priority Agent' },
  ]

  const delayed = tasks.filter(t => t.status !== 'Completed' && new Date(t.deadline) < today)
  delayed.forEach(t => {
    base.push({ type: 'delay', message: `Delay detected for task '${t.title}' — assigned to ${t.assignee}`, time: timeStr, agent: 'Monitor Agent' })
  })

  base.push({ type: 'complete', message: `Workflow pipeline complete — dashboard updated`, time: timeStr, agent: 'System' })
  return base
}

const statCards = [
  { label: 'Agents Active',     value: '4',       icon: Cpu,      color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { label: 'Tasks Extracted',   value: '0',       icon: Workflow, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Automation Rate',   value: '100%',    icon: ChartBar, color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { label: 'System Status',     value: 'Online',  icon: Activity, color: 'text-green-400',  bg: 'bg-green-500/10' },
]

export default function App() {
  const [tasks, setTasks]     = useState([])
  const [logs, setLogs]       = useState([])
  const [isLoading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 2200))
    setTasks(DUMMY_TASKS)
    setLogs(generateLogs(DUMMY_TASKS))
    setAnalyzed(true)
    setLoading(false)
  }

  const handleToggleStatus = (idx) => {
    setTasks(prev => {
      const updated = prev.map((t, i) => {
        if (i !== idx) return t
        const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed'
        return { ...t, status: newStatus }
      })
      // Append log entry
      const t = prev[idx]
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed'
      setLogs(l => [...l, {
        type: newStatus === 'Completed' ? 'complete' : 'assign',
        message: `Task '${t.title}' marked as ${newStatus}`,
        time: timeStr,
        agent: 'User Action'
      }])
      return updated
    })
  }

  const dynamicStats = statCards.map(s =>
    s.label === 'Tasks Extracted' ? { ...s, value: String(tasks.length) } : s
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0e0c1f] to-slate-900">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── HEADER ── */}
        <header className="text-center mb-10 slide-in">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-4 py-2 rounded-full mb-5">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
            Multi-Agent AI System · Live
          </div>

          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent glow-text tracking-tight">
              AutoFlow AI
            </h1>
          </div>

          <p className="text-slate-400 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            AI-powered workflow automation using{' '}
            <span className="text-indigo-400 font-medium">multi-agent systems</span>
          </p>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto">
            {dynamicStats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <div key={i} className={`glass rounded-xl p-4 card-hover border border-slate-700/50`}>
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2 mx-auto`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </header>

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left column — Input */}
          <div className="xl:col-span-1 space-y-6">
            <InputBox onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* How it works */}
            <div className="glass rounded-2xl p-5 slide-in">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                How it works
              </h3>
              <ol className="space-y-2.5">
                {[
                  ['Extraction Agent', 'Parses transcript for action items'],
                  ['Assignment Agent', 'Maps tasks to team members'],
                  ['Deadline Agent',   'Estimates realistic deadlines'],
                  ['Monitor Agent',    'Tracks delays & sends alerts'],
                ].map(([name, desc], i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div>
                      <span className="text-xs font-medium text-slate-300">{name}</span>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right column — Dashboard */}
          <div className="xl:col-span-2 space-y-6">
            {analyzed ? (
              <>
                <Alerts tasks={tasks} />
                <TaskTable tasks={tasks} onToggleStatus={handleToggleStatus} />
                <AuditLogs logs={logs} />
              </>
            ) : (
              /* Empty state */
              <div className="glass rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center slide-in border border-slate-700/30">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-5 border border-indigo-500/20">
                  <Brain className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Ready to Analyze</h3>
                <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                  Paste a meeting transcript and click <span className="text-indigo-400 font-medium">Analyze Meeting</span> to instantly extract tasks, assign owners, and detect deadlines using AI agents.
                </p>
                <div className="flex gap-3 mt-6">
                  {['Extract Tasks', 'Auto-Assign', 'Set Deadlines', 'Alert Delays'].map(feature => (
                    <span key={feature} className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1.5 rounded-full">
                      ✦ {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-600 border-t border-slate-800 pt-6">
          <p>AutoFlow AI · Built for Hackathon · Powered by Multi-Agent Architecture</p>
        </footer>
      </div>
    </div>
  )
}
