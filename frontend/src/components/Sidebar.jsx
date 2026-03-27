import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Brain } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 border-r border-slate-800/50 bg-slate-900/50 flex flex-col min-h-screen pt-6 sticky top-0">
      <div className="flex items-center gap-3 px-6 mb-10">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">AutoFlow AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>

        <NavLink 
          to="/logs" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          System Logs
        </NavLink>
      </nav>
    </div>
  );
}
