import { useState } from 'react'

const LEVELS = {
  junior: { label: '國中程度', sub: '適合國一至國三學生', emoji: '📗' },
  senior: { label: '高中程度', sub: '適合高一至高三學生', emoji: '📘' },
}

export default function SettingsTab({ level, setLevel, dark, toggleDark, resetLevel }) {
  const [confirmReset, setConfirmReset] = useState(false)
  const other = level === 'junior' ? 'senior' : 'junior'

  function handleSwitch() {
    setLevel(other)
  }

  function handleReset() {
    if (confirmReset) {
      resetLevel(level)
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 pt-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">設定</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">自訂學習偏好</p>
      </div>

      {/* 學習程度 */}
      <Section title="學習程度">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 mb-3">
          <span className="text-2xl">{LEVELS[level].emoji}</span>
          <div>
            <p className="font-semibold text-brand-700 dark:text-brand-300 text-sm">{LEVELS[level].label}</p>
            <p className="text-xs text-brand-500 dark:text-brand-400">{LEVELS[level].sub}</p>
          </div>
          <span className="ml-auto text-xs text-brand-500 font-medium bg-brand-100 dark:bg-brand-900/40 px-2 py-0.5 rounded-full">使用中</span>
        </div>
        <button onClick={handleSwitch}
          className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm active:scale-[0.98] transition-transform outline-none focus:outline-none">
          切換至 {LEVELS[other].emoji} {LEVELS[other].label}
        </button>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center">切換後，兩個程度的學習進度分開保存</p>
      </Section>

      {/* 顯示設定 */}
      <Section title="顯示設定">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-200 text-sm">深色模式</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{dark ? '目前：深色' : '目前：淺色'}</p>
          </div>
          <button onClick={toggleDark}
            className={[
              'relative w-12 h-6 rounded-full transition-all duration-200 outline-none focus:outline-none',
              dark ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700',
            ].join(' ')}>
            <span className={[
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200',
              dark ? 'left-6' : 'left-0.5',
            ].join(' ')} />
          </button>
        </div>
      </Section>

      {/* 資料管理 */}
      <Section title="資料管理">
        <button onClick={handleReset}
          className={[
            'w-full py-3 rounded-2xl font-semibold text-sm active:scale-[0.98] transition-all outline-none focus:outline-none',
            confirmReset
              ? 'bg-rose-500 text-white'
              : 'border border-rose-300 dark:border-rose-800 text-rose-500',
          ].join(' ')}>
          {confirmReset ? '確定重置目前程度進度？' : '🔄 重置學習進度'}
        </button>
        {confirmReset && (
          <button onClick={() => setConfirmReset(false)}
            className="w-full py-2 text-sm text-slate-400 dark:text-slate-500 outline-none focus:outline-none">
            取消
          </button>
        )}
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-center">只會重置目前程度的進度，另一個程度不受影響</p>
      </Section>

      {/* 關於 */}
      <Section title="關於">
        <Row label="應用名稱" value="WordUp" />
        <Row label="版本" value="1.0.0" />
        <Row label="單字來源" value="教育部課綱字表" />
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-1">{title}</p>
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-4 flex flex-col gap-2">
        {children}
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1">
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  )
}
