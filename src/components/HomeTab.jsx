const LEVEL_INFO = {
  junior: { label: '國中程度', sub: '適合國一至國三學生', emoji: '📗' },
  senior: { label: '高中程度', sub: '適合高一至高三學生', emoji: '📘' },
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

function todayString() {
  const d = new Date()
  return `${d.getMonth() + 1}月${d.getDate()}日 星期${WEEKDAYS[d.getDay()]}`
}

export default function HomeTab({ level, stats, onNavigate }) {
  const info = LEVEL_INFO[level]
  const pct  = stats.total > 0 ? Math.round((stats.practiced / stats.total) * 100) : 0

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">WordUp</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{todayString()}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
          bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400">
          {info.emoji} {info.label}
        </span>
      </div>

      {/* Progress card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">學習進度</p>
        <div className="flex items-end justify-between mb-2">
          <p className="text-slate-500 dark:text-slate-400 text-sm">{stats.practiced} / {stats.total} 單字已接觸</p>
          <p className="text-brand-500 font-bold text-sm">{pct}%</p>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-4 mt-4">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800 dark:text-white">{stats.accuracy}%</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">答對率</p>
          </div>
          <div className="w-px bg-slate-100 dark:bg-slate-700" />
          <div className="text-center">
            <p className="text-xl font-bold text-slate-800 dark:text-white">{stats.totalAnswered}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">作答次數</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-3">
        <button onClick={() => onNavigate('flash')}
          className="w-full bg-brand-500 text-white rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform shadow-sm">
          <span className="text-2xl">🃏</span>
          <div className="text-left">
            <p className="font-bold text-base">單字卡練習</p>
            <p className="text-brand-100 text-sm">翻牌記憶單字</p>
          </div>
          <span className="ml-auto text-brand-200 text-lg">›</span>
        </button>

        <button onClick={() => onNavigate('quiz')}
          className="w-full bg-white dark:bg-slate-800 rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform border border-slate-200 dark:border-slate-700">
          <span className="text-2xl">✏️</span>
          <div className="text-left">
            <p className="font-bold text-base text-slate-800 dark:text-white">開始測驗</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">4 選 1 雙向測驗</p>
          </div>
          <span className="ml-auto text-slate-300 dark:text-slate-600 text-lg">›</span>
        </button>
      </div>
    </div>
  )
}
