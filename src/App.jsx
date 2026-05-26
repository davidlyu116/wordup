import { useState } from 'react'
import junior from './data/junior'
import senior from './data/senior'
import FlashCard from './components/FlashCard'
import Quiz from './components/Quiz'
import Stats from './components/Stats'
import { useProgress } from './hooks/useProgress'
import { useTheme } from './hooks/useTheme'

const LEVELS = {
  junior: { label: '國中', sub: '2000 核心字彙', words: junior, emoji: '📗' },
  senior: { label: '高中', sub: '7000 常考字彙', words: senior, emoji: '📘' },
}

const QUIZ_DIRECTIONS = [
  { id: 'en-zh', label: '英文 → 中文', desc: '看英文，選中文翻譯' },
  { id: 'zh-en', label: '中文 → 英文', desc: '看中文，選英文單字' },
  { id: 'random', label: '雙向隨機',   desc: '兩種題型隨機混合' },
]

export default function App() {
  const { dark, toggle } = useTheme()
  const { progress, record, getStats } = useProgress()

  const [level, setLevel] = useState(null)      // 'junior' | 'senior'
  const [mode, setMode] = useState(null)         // 'flash' | 'quiz'
  const [quizDir, setQuizDir] = useState(null)   // 'en-zh' | 'zh-en' | 'random'
  const [quizCount, setQuizCount] = useState(10) // 10 | 20

  const words = level ? LEVELS[level].words : []
  const stats = level ? getStats(words) : null

  // ── Screen: Home ─────────────────────────────────────────────
  if (!level) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Header dark={dark} onToggle={toggle} />
        <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-10 gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">選擇程度</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">從哪個等級開始練習？</p>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {Object.entries(LEVELS).map(([key, lvl]) => (
              <button key={key} onClick={() => setLevel(key)}
                className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700
                  p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:border-brand-400">
                <span className="text-4xl">{lvl.emoji}</span>
                <div>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{lvl.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{lvl.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    )
  }

  // ── Screen: Mode select ───────────────────────────────────────
  if (!mode) {
    const lvl = LEVELS[level]
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Header dark={dark} onToggle={toggle}
          back={() => setLevel(null)}
          title={`${lvl.emoji} ${lvl.label}`} />
        <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-10 gap-6">
          <Stats stats={stats} level={level} />

          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">選擇模式</h2>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button onClick={() => setMode('flash')}
              className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700
                p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:border-brand-400">
              <span className="text-3xl">🃏</span>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-white">單字卡</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">翻牌記憶，標記已會 / 不確定</p>
              </div>
            </button>

            <button onClick={() => setMode('quiz-pick')}
              className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700
                p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:border-brand-400">
              <span className="text-3xl">✏️</span>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-white">測驗模式</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">4 選 1 測驗，立即看對錯</p>
              </div>
            </button>
          </div>
        </main>
      </div>
    )
  }

  // ── Screen: Quiz direction picker ─────────────────────────────
  if (mode === 'quiz-pick') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Header dark={dark} onToggle={toggle}
          back={() => setMode(null)}
          title="測驗設定" />
        <main className="flex-1 flex flex-col items-center px-4 pt-6 pb-10 gap-6">

          {/* Question count toggle */}
          <div className="w-full max-w-sm">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">題數</p>
            <div className="flex gap-3">
              {[10, 20].map(n => (
                <button key={n} onClick={() => setQuizCount(n)}
                  className={[
                    'flex-1 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95',
                    quizCount === n
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300',
                  ].join(' ')}>
                  {n} 題
                  {n === 10 && <span className="block text-xs font-normal opacity-75 mt-0.5">約 2 分鐘</span>}
                  {n === 20 && <span className="block text-xs font-normal opacity-75 mt-0.5">約 4 分鐘</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="w-full max-w-sm">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">題目方向</p>
            <div className="flex flex-col gap-3">
              {QUIZ_DIRECTIONS.map(d => (
                <button key={d.id} onClick={() => { setQuizDir(d.id); setMode('quiz') }}
                  className="w-full bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700
                    p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:border-brand-400">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center text-xl">
                    {d.id === 'en-zh' ? '🇺🇸' : d.id === 'zh-en' ? '🇹🇼' : '🔀'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{d.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{d.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </main>
      </div>
    )
  }

  // ── Screen: Flash card ────────────────────────────────────────
  if (mode === 'flash') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Header dark={dark} onToggle={toggle}
          back={() => setMode(null)}
          title={`${LEVELS[level].emoji} 單字卡`} />
        <main className="flex-1 pt-4 pb-10">
          <FlashCard words={words} onBack={() => setMode(null)} />
        </main>
      </div>
    )
  }

  // ── Screen: Quiz ──────────────────────────────────────────────
  if (mode === 'quiz') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        <Header dark={dark} onToggle={toggle}
          back={() => setMode('quiz-pick')}
          title={`${LEVELS[level].emoji} 測驗`} />
        <main className="flex-1 pt-2 pb-10">
          <Quiz
            words={words}
            direction={quizDir}
            count={quizCount}
            onBack={() => { setMode(null); setQuizDir(null) }}
            record={record}
          />
        </main>
      </div>
    )
  }
}

// ── Shared Header ─────────────────────────────────────────────
function Header({ dark, onToggle, back, title }) {
  return (
    <header className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-sm mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {back ? (
            <button onClick={back}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300
                hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all">
              ←
            </button>
          ) : (
            <span className="text-xl font-black text-brand-500 tracking-tight">WordUp</span>
          )}
          {title && <span className="font-semibold text-slate-700 dark:text-slate-200">{title}</span>}
        </div>
        <button onClick={onToggle}
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg
            hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all">
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}
