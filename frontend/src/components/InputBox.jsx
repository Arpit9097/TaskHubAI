import { useState } from 'react'
import { BotMessageSquare, Zap, Activity } from 'lucide-react'

export default function InputBox({ onAnalyze, isLoading }) {
  const [transcript, setTranscript] = useState('')

  const sampleTranscript = `Team Meeting - March 26, 2026

John: Alright team, let's discuss the Q1 deliverables. Dev team needs to fix the login bug ASAP, it's been blocking users since yesterday.

Sarah: I can assign that to the dev team with a high priority. We should aim to resolve it by EOD today.

John: Also, Arpit — can you take ownership of the landing page redesign? It needs to be ready by the 28th.

Arpit: Sure! I'll start on it today.

John: Great. Also, we need the quarterly report drafted by the 30th. Meera, can you do that?

Meera: Yes, I'll have a draft ready. Will mark it as medium priority.

John: One last thing — security audit review needs to be done by April 2nd. Dev team again on this one, high priority.

Sarah: Got it. We'll schedule that in.

John: Perfect. Let's also make sure the AI integration demo is prepped by the 31st — Arpit, this one's yours too.`

  return (
    <div className="glass rounded-2xl p-6 card-hover gradient-border slide-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
          <BotMessageSquare className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Meeting Transcript</h2>
          <p className="text-xs text-slate-400">Paste your meeting notes below</p>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste your meeting transcript here... (or click 'Load Sample' to try a demo)"
        className="w-full h-44 bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-500 resize-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
      />

      {/* Character count */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <span className="text-xs text-slate-500">{transcript.length} characters</span>
        <button
          onClick={() => setTranscript(sampleTranscript)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-2"
        >
          Load Sample Transcript
        </button>
      </div>

      {/* Analyze Button */}
      <button
        onClick={() => onAnalyze(transcript)}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-900/40 hover:shadow-indigo-900/60 active:scale-95 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing with AI Agents...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Analyze Meeting
          </>
        )}
      </button>

      {/* Agent info pills */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {['Extraction Agent', 'Assignment Agent', 'Deadline Agent', 'Priority Agent'].map(agent => (
          <span key={agent} className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-400" />
            {agent}
          </span>
        ))}
      </div>
    </div>
  )
}
