import { useState } from 'react'
import Quiz from './Quiz'

const DIRECTIONS = [
  { id: 'en-zh',  label: '英文 → 中文', desc: '看英文，選中文翻譯', emoji: '🇺🇸' },
  { id: 'zh-en',  label: '中文 → 英文', desc: '看中文，選英文單字', emoji: '🇹🇼' },
  { id: 'random', label: '雙向隨機',    desc: '兩種題型隨機混合',   emoji: '🔀' },
]

const SOURCES = [
  { id: 'all',        label: '全部隨機', desc: '從所有單字中隨機出題',   emoji: '🎲' },
  { id: 'unseen',     label: '從未學過', desc: '優先出現沒練習過的單字', emoji: '🌱' },
  { id: 'weak',       label: '待加強',   desc: '答對率較低的單字優先',   emoji: '💪' },
  { id: 'bookmarked', label: '收藏單字', desc: '你標記收藏的單字',       emoji: '⭐' },
]

function buildPool(words, source, progress, bookmarkedWords = []) {
  if (source === 'all') return words

  const seen    = words.filter(w => progress[w.word]?.total > 0)
  const unseen  = words.filter(w => !progress[w.word]?.total)

  if (source === 'unseen') {
    // Unseen first; pad with low-accuracy seen if not enough
    if (unseen.length >= 10) return unseen
    const sorted = [...seen].sort((a, b) => {
      const accA = (progress[a.word]?.correct || 0) / (progress[a.word]?.total || 1)
      const accB = (progress[b.word]?.correct || 0) / (progress[b.word]?.total || 1)
      return accA - accB
    })
    return [...unseen, ...sorted].slice(0, Math.max(unseen.length + sorted.length, 10))
  }

  if (source === 'bookmarked') {
    return bookmarkedWords.length >= 4 ? bookmarkedWords : words
  }

  if (source === 'weak') {
    const weak = seen
      .filter(w => {
        const acc = (progress[w.word]?.correct || 0) / (progress[w.word]?.total || 1)
        return acc < 0.8
      })
      .sort((a, b) => {
        const accA = (progress[a.word]?.correct || 0) / (progress[a.word]?.total || 1)
        const accB = (progress[b.word]?.correct || 0) / (progress[b.word]?.total || 1)
        return accA - accB
      })
    // Fallback to all if not enough weak words
    return weak.length >= 4 ? weak : words
  }

  return words
}

export default function QuizTab({ words, level, record, progress, bookmarkedWords = [] }) {
  const [running, setRunning] = useState(false)
  const [count,   setCount]   = useState(10)
  const [dir,     setDir]     = useState('random')
  const [source,  setSource]  = useState('all')

  const levelProgress = progress[level] || {}

  // Compute pool & fallback label
  const pool         = buildPool(words, source, levelProgress, bookmarkedWords)
  const isFallback   = source !== 'all' && pool === words
  const bookmarkedCount = source === 'bookmarked' ? bookmarkedWords.length : null
  const weakCount    = source === 'weak'
    ? words.filter(w => {
        const p = levelProgress[w.word]
        return p?.total > 0 && (p.correct / p.total) < 0.8
      }).length
    : null
  const unseenCount  = source === 'unseen'
    ? words.filter(w => !levelProgress[w.word]?.total).length
    : null

  if (running) {
    return (
      <div className="pb-24">
        <Quiz
          words={pool}
          direction={dir}
          count={Math.min(count, pool.length)}
          onBack={() => setRunning(false)}
          record={(word, correct) => record(level, word, correct)}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-5 pb-4">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">測驗</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">測試你的英文單字掌握程度</p>
      </div>

      {/* 題數 */}
      <SettingBlock title="題目數量">
        <div className="flex gap-3">
          {[10, 20].map(n => (
            <button key={n} onClick={() => setCount(n)}
              className={[
                'flex-1 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 outline-none focus:outline-none',
                count === n ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
              ].join(' ')}>
              {n} 題
              <span className={`block text-xs font-normal mt-0.5 ${count === n ? 'text-brand-100' : 'text-slate-400 dark:text-slate-500'}`}>
                約 {n === 10 ? 2 : 4} 分鐘
              </span>
            </button>
          ))}
        </div>
      </SettingBlock>

      {/* 題目方向 */}
      <SettingBlock title="題目方向">
        <div className="flex flex-col gap-2">
          {DIRECTIONS.map(d => (
            <OptionRow key={d.id} option={d} selected={dir === d.id} onSelect={() => setDir(d.id)} />
          ))}
        </div>
      </SettingBlock>

      {/* 題目來源 */}
      <SettingBlock title="題目來源">
        <div className="flex flex-col gap-2">
          {SOURCES.map(s => {
            const badge = s.id === 'unseen' && unseenCount !== null
              ? `${unseenCount} 個未學`
              : s.id === 'weak' && weakCount !== null
              ? `${weakCount} 個待加強`
              : s.id === 'bookmarked' && bookmarkedCount !== null
              ? `${bookmarkedCount} 個收藏`
              : null
            return (
              <OptionRow key={s.id} option={s} selected={source === s.id}
                onSelect={() => setSource(s.id)} badge={badge} />
            )
          })}
        </div>
        {isFallback && (
          <p className="text-xs text-amber-500 dark:text-amber-400 mt-2 text-center">
            目前資料不足，將從全部單字中出題
          </p>
        )}
      </SettingBlock>

      {/* Start */}
      <button onClick={() => setRunning(true)}
        className="w-full py-4 rounded-3xl bg-brand-500 text-white font-bold text-lg shadow-sm active:scale-[0.98] transition-transform outline-none focus:outline-none">
        開始測驗
      </button>
    </div>
  )
}

function SettingBlock({ title, children }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-5">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">{title}</p>
      {children}
    </div>
  )
}

function OptionRow({ option, selected, onSelect, badge }) {
  return (
    <button onClick={onSelect}
      className={[
        'flex items-center gap-3 p-3 rounded-2xl transition-all active:scale-[0.98] outline-none focus:outline-none text-left',
        selected
          ? 'bg-brand-50 dark:bg-brand-900/20 border border-brand-300 dark:border-brand-700'
          : 'border border-slate-200 dark:border-slate-700',
      ].join(' ')}>
      <span className="text-xl">{option.emoji}</span>
      <div className="flex-1">
        <p className={`font-semibold text-sm ${selected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-700 dark:text-slate-200'}`}>
          {option.label}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{option.desc}</p>
      </div>
      {badge && (
        <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {selected && <span className="text-brand-500 text-sm">✓</span>}
    </button>
  )
}
