const LEVEL_LABEL = { junior: '國中', senior: '高中' }

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function BookmarkIcon({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export default function ProgressTab({ level, stats, recentWrong, onResetWord, onToggleBookmark, isBookmarked }) {
  const pct = stats.total > 0 ? Math.round((stats.practiced / stats.total) * 100) : 0

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">進度追蹤</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{LEVEL_LABEL[level]} 學習統計</p>
      </div>

      {/* 掌握率 */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 text-center">掌握率</p>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10"
                className="text-slate-100 dark:text-slate-700" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                strokeLinecap="round"
                className="text-brand-500 transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800 dark:text-white">{pct}%</span>
            </div>
          </div>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* 統計數字 */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="已接觸單字" value={stats.practiced} sub={`共 ${stats.total} 個`} />
        <StatCard label="答對率" value={`${stats.accuracy}%`} sub={`共答 ${stats.totalAnswered} 題`} />
      </div>

      {/* 待加強單字 */}
      {recentWrong.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">待加強單字</p>
          <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
            {recentWrong.map(w => {
              const acc = w.stats.total > 0 ? Math.round(w.stats.correct / w.stats.total * 100) : 0
              return (
                <div key={w.word} className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{w.word}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{w.zh}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      acc >= 70 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {acc}%
                    </span>
                    <button
                      onClick={() => onToggleBookmark?.(w.word)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90 outline-none focus:outline-none
                        ${isBookmarked?.(w.word)
                          ? 'text-brand-500 dark:text-brand-400'
                          : 'text-slate-300 dark:text-slate-600 active:text-brand-400'
                        }`}>
                      <BookmarkIcon filled={isBookmarked?.(w.word)} />
                    </button>
                    <button
                      onClick={() => onResetWord?.(w.word)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 dark:text-slate-500
                        active:scale-90 transition-all outline-none focus:outline-none
                        active:text-slate-600 dark:active:text-slate-300">
                      <ResetIcon />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {recentWrong.length === 0 && (
        <div className="text-center py-10 text-slate-400 dark:text-slate-500">
          <p className="text-4xl mb-2">🎉</p>
          <p className="text-sm">目前沒有待加強的單字</p>
          <p className="text-xs mt-1">繼續練習來找出需要加強的地方</p>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-4 text-center">
      <p className="text-2xl font-black text-brand-500">{value}</p>
      <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">{label}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
    </div>
  )
}
