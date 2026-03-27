import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout({ contextVal }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-[#0e0c1f] to-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-8 relative">
        {/* Ambient glow blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <Outlet context={contextVal} />
        </div>
      </main>
    </div>
  );
}
