import { useOutletContext } from 'react-router-dom';
import AuditLogs from '../components/AuditLogs';

export default function Logs() {
  const { logs, analyzed } = useOutletContext();

  return (
    <>
      <header className="mb-10 slide-in">
        <h1 className="text-4xl font-extrabold text-white mb-2">System Audit Logs</h1>
        <p className="text-slate-400">A transparent, auditable trail of multi-agent decisions and actions.</p>
      </header>

      {analyzed && logs.length > 0 ? (
        <div className="xl:col-span-3">
          <AuditLogs logs={logs} />
        </div>
      ) : (
        <div className="glass rounded-2xl flex flex-col items-center justify-center py-24 px-8 text-center border border-slate-700/50">
          <p className="text-slate-200 mb-2 font-medium">No audit logs available yet.</p>
          <p className="text-sm text-slate-500">Run an analysis workflow from the Dashboard to trigger multi-agent actions and securely track their decisions here.</p>
        </div>
      )}
    </>
  );
}
