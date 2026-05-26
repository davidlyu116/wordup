import { useState, useEffect } from 'react'

const BATCH_SIZE = 20

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function loadSession(key) {
  try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null }
}

function saveSession(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data))
}

function buildBatch(words, batchIndex) {
  const shuffled = shuffle(words)
  const start = (batchIndex * BATCH_SIZE) % words.length
  return shuffled.slice(start, start + BATCH_SIZE).length === BATCH_SIZE
    ? shuffled.slice(start, start + BATCH_SIZE)
    : shuffle(words).slice(0, BATCH_SIZE)
}

function getInitial(words, key) {
  const s = loadSession(key)
  const wordSet = new Set(words.map(w => w.word))
  if (s?.deck && s.deck.every(c => wordSet.has(c.word))) {
    return { deck: s.deck, index: s.index || 0, batchIndex: s.batchIndex || 0 }
  }
  return { deck: shuffle(words).slice(0, BATCH_SIZE), index: 0, batchIndex: 0 }
}

function StarIcon({ filled }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function FlashCard({ words, isBookmarked, onToggleBookmark, sessionKey = 'all' }) {
  const storageKey   = `wordup_flash_${sessionKey}`
  const [init]       = useState(() => getInitial(words, storageKey))
  const [deck,       setDeck]       = useState(init.deck)
  const [index,      setIndex]      = useState(init.index)
  const [batchIndex, setBatchIndex] = useState(init.batchIndex)
  const [flipped,    setFlipped]    = useState(false)
  const [animKey,    setAnimKey]    = useState(0)
  const [batchDone,  setBatchDone]  = useState(false)

  const card  = deck[index]
  const total = deck.length
  const bookmarked = isBookmarked?.(card?.word) ?? false

  useEffect(() => {
    saveSession(storageKey, { deck, index, batchIndex })
  }, [deck, index, batchIndex, storageKey])

  function goTo(next) {
    setIndex(next)
    setFlipped(false)
    setAnimKey(k => k + 1)
  }

  function prev() { if (index > 0) goTo(index - 1) }

  function next() {
    if (index < total - 1) {
      goTo(index + 1)
    } else {
      setBatchDone(true)
    }
  }

  function flip() { setFlipped(f => !f) }

  function nextBatch() {
    const nb = batchIndex + 1
    const newDeck = buildBatch(words, nb)
    setBatchIndex(nb)
    setDeck(newDeck)
    setIndex(0)
    setFlipped(false)
    setBatchDone(false)
    setAnimKey(k => k + 1)
  }

  if (batchDone) {
    const isSmallPool = words.length <= BATCH_SIZE
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-6xl">🎉</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">這批完成！</h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            {isSmallPool ? '繼續練習同一批單字' : '繼續下一批隨機單字'}
          </p>
        </div>
        <button onClick={nextBatch}
          className="w-full max-w-xs py-4 rounded-2xl bg-brand-500 text-white font-semibold text-lg active:scale-95 transition-transform outline-none focus:outline-none">
          {isSmallPool ? '再練一遍 →' : `繼續下 ${BATCH_SIZE} 個單字 →`}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 pt-2">

      {/* Progress */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-slate-500 dark:text-slate-400">{index + 1} / {total}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">{card.pos}</span>
          <button
            onClick={() => onToggleBookmark?.(card.word)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90 outline-none focus:outline-none
              ${bookmarked ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}>
            <StarIcon filled={bookmarked} />
          </button>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <div key={animKey}
        onClick={flip}
        className="w-full max-w-sm cursor-pointer animate-flipIn select-none">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-100 dark:border-slate-700
          min-h-[280px] flex flex-col items-center justify-center p-8 gap-3">
          {!flipped ? (
            <>
              <p className="text-xs font-medium tracking-widest text-slate-400 dark:text-slate-500 uppercase">英文</p>
              <p className="text-4xl font-bold text-slate-800 dark:text-white tracking-wide text-center">{card.word}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{card.pos}</p>
            </>
          ) : (
            <>
              <p className="text-xs font-medium tracking-widest text-brand-500 uppercase">中文</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white text-center">{card.zh}</p>
              {card.example && (
                <div className="mt-3 w-full bg-slate-50 dark:bg-slate-700/50 rounded-2xl px-4 py-3">
                  <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">例句</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{card.example}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        {flipped ? '點擊卡片查看英文' : '點擊卡片或按翻轉查看中文'}
      </p>

      {/* Controls */}
      <div className="flex gap-3 w-full max-w-sm">
        <button onClick={prev}
          disabled={index === 0}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold
            bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600
            text-slate-600 dark:text-slate-300
            disabled:opacity-30 active:scale-95 transition-all outline-none focus:outline-none">
          ←
        </button>
        <button onClick={flip}
          className="flex-1 h-14 rounded-2xl font-bold text-base
            bg-brand-500 text-white active:scale-95 transition-all shadow-sm outline-none focus:outline-none">
          翻轉
        </button>
        <button onClick={next}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold
            bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600
            text-slate-600 dark:text-slate-300
            active:scale-95 transition-all outline-none focus:outline-none">
          →
        </button>
      </div>
    </div>
  )
}
