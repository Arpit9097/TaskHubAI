import { useOutletContext } from 'react-router-dom';
import { Brain, Cpu, Workflow, ChartBar, Activity } from 'lucide-react';
import InputBox from '../components/InputBox';
import TaskTable from '../components/TaskTable';
import Alerts from '../components/Alerts';

const statCards = [
  { label: 'Agents Active',     value: '4',       icon: Cpu,      color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { label: 'Tasks Extracted',   value: '0',       icon: Workflow, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Automation Rate',   value: '100%',    icon: ChartBar, color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { label: 'System Status',     value: 'Online',  icon: Activity, color: 'text-green-400',  bg: 'bg-green-500/10' },
]

export default function Dashboard() {
  const { tasks, analyzed, isLoading, handleAnalyze, handleToggleStatus } = useOutletContext();

  const dynamicStats = statCards.map(s =>
    s.label === 'Tasks Extracted' ? { ...s, value: String(tasks?.length || 0) } : s
  )

  return (
    <>
      <header className="mb-10 slide-in">
        <h1 className="text-4xl font-extrabold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Monitor and orchestrate your autonomous AI agents.</p>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {dynamicStats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="glass rounded-xl p-4 border border-slate-700/50">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2 mx-auto`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className={`text-xl font-bold ${stat.color} text-center`}>{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5 text-center">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <InputBox onAnalyze={handleAnalyze} isLoading={isLoading} />
          
          <div className="glass rounded-2xl p-5 slide-in border border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              How it works
            </h3>
            <ol className="space-y-2.5 flex flex-col items-start text-left">
              {[
                ['Extraction Agent', 'Parses transcript for action items'],
                ['Assignment Agent', 'Maps tasks to team members'],
                ['Deadline Agent',   'Estimates realistic deadlines'],
                ['Monitor Agent',    'Tracks delays & sends alerts'],
              ].map(([name, desc], i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <div>
                    <span className="text-xs font-medium text-slate-300 block">{name}</span>
                    <span className="text-xs text-slate-500 leading-tight block">{desc}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          {analyzed ? (
            <>
              <Alerts tasks={tasks} />
              <TaskTable tasks={tasks} onToggleStatus={handleToggleStatus} />
            </>
          ) : (
            <div className="glass rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center border border-slate-700/50 h-full">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-5 border border-indigo-500/20">
                <Brain className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">Ready to Analyze</h3>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                Paste a meeting transcript and click <span className="text-indigo-400 font-medium">Analyze Meeting</span> to instantly extract tasks and see the system populate them.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
