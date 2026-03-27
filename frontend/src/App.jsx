import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';

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
    base.push({ type: 'delay', message: `System Escalation: Delay detected for task '${t.title}'. Priority auto-escalated to High.`, time: timeStr, agent: 'Health Monitor Agent' })
  })

  base.push({ type: 'complete', message: `Workflow pipeline complete — data synchronized`, time: timeStr, agent: 'Local System' })
  return base
}

export default function App() {
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const handleAnalyze = async () => {
    setLoading(true)
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
      
      const t = prev[idx]
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      const newStatus = t.status === 'Completed' ? 'Pending' : 'Completed'
      
      setLogs(l => [...l, {
        type: newStatus === 'Completed' ? 'complete' : 'assign',
        message: `Verification Agent formally verified constraints: Task '${t.title}' status shifted to ${newStatus}`,
        time: timeStr,
        agent: 'Verification Agent'
      }])
      return updated
    })
  }

  const contextVal = { tasks, logs, isLoading, analyzed, handleAnalyze, handleToggleStatus };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout contextVal={contextVal} />}>
          <Route index element={<Dashboard />} />
          <Route path="logs" element={<Logs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
