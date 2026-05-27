import { useState } from 'react'
import junior from './data/junior'
import senior from './data/senior'
import TabBar      from './components/TabBar'
import HomeTab     from './components/HomeTab'
import FlashTab    from './components/FlashTab'
import QuizTab     from './components/QuizTab'
import ProgressTab from './components/ProgressTab'
import SettingsTab from './components/SettingsTab'
import { useLevel }     from './hooks/useLevel'
import { useProgress }  from './hooks/useProgress'
import { useTheme }     from './hooks/useTheme'
import { useBookmarks } from './hooks/useBookmarks'

const WORDS = { junior, senior }

// ── Onboarding ────────────────────────────────────────────────
function Onboarding({ onSelect }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center px-6 gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">WordUp</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">你是哪個程度的學生？</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">選好後可以在設定中隨時更改</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {[
          { id: 'junior', emoji: '📗', label: '國中生', sub: '國一 ～ 國三' },
          { id: 'senior', emoji: '📘', label: '高中生', sub: '高一 ～ 高三' },
        ].map(l => (
          <button key={l.id} onClick={() => onSelect(l.id)}
            className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700
              p-6 flex items-center gap-5 text-left active:scale-[0.98] transition-transform">
            <span className="text-5xl">{l.emoji}</span>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{l.label}</p>
              <p className="text-slate-500 dark:text-slate-400">{l.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const { dark, toggle: toggleDark } = useTheme()
  const { level, setLevel }          = useLevel()
  const { progress, record, resetWord, resetLevel, getStats, getRecentWrong } = useProgress()
  const { toggleBookmark, isBookmarked, getBookmarkedWords }       = useBookmarks()
  const [tab, setTab] = useState('home')

  // First launch — no level chosen yet
  if (!level) return <Onboarding onSelect={setLevel} />

  const words       = WORDS[level]
  const stats           = getStats(level, words)
  const recentWrong     = getRecentWrong(level, words, 5)
  const bookmarkedWords = getBookmarkedWords(level, words)

  function handleTabChange(t) {
    setTab(t)
    window.scrollTo(0, 0)
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Top bar */}
      <header className="shrink-0 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-sm mx-auto flex items-center justify-between px-4 py-3">
          <span className="text-base font-black text-brand-500 tracking-tight">WordUp</span>
          <button onClick={toggleDark}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg
              hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all">
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Tab content — only this area scrolls */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto pb-4">
          {tab === 'home' && (
            <HomeTab level={level} stats={stats} onNavigate={handleTabChange} />
          )}
          {tab === 'flash' && (
            <FlashTab
              words={words}
              level={level}
              isBookmarked={isBookmarked}
              onToggleBookmark={toggleBookmark}
              bookmarkedWords={bookmarkedWords}
            />
          )}
          {tab === 'quiz' && (
            <QuizTab
              words={words}
              level={level}
              record={record}
              progress={progress}
              bookmarkedWords={bookmarkedWords}
            />
          )}
          {tab === 'progress' && (
            <ProgressTab
              level={level}
              stats={stats}
              recentWrong={recentWrong}
              onResetWord={(word) => resetWord(level, word)}
              onToggleBookmark={(word) => toggleBookmark(level, word)}
              isBookmarked={(word) => isBookmarked(level, word)}
            />
          )}
          {tab === 'settings' && (
            <SettingsTab
              level={level}
              setLevel={setLevel}
              dark={dark}
              toggleDark={toggleDark}
              resetLevel={resetLevel}
            />
          )}
        </div>
      </main>

      <TabBar active={tab} onChange={handleTabChange} />
    </div>
  )
}
