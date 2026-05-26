export default function Stats({ stats, level, onReset }) {
  const pct = stats.total > 0 ? Math.round((stats.practiced / stats.total) * 100) : 0

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
          {level === 'junior' ? '國中' : '高中'} 學習進度
        </h3>
        <div className="flex gap-4 justify-around mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-brand-500">{stats.practiced}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">已練習</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-200">{stats.total}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">總單字</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-500">{stats.accuracy}%</div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">答對率</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 text-right mt-1">{pct}% 已接觸</p>
      </div>
    </div>
  )
}
