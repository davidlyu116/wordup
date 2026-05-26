import { useState, useEffect } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function FlashCard({ words, onBack }) {
  const [deck, setDeck] = useState(() => shuffle(words))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())
  const [unsure, setUnsure] = useState(new Set())
  const [done, setDone] = useState(false)
  const [animKey, setAnimKey] = useState(0)

  const card = deck[index]

  function next(mark) {
    if (mark === 'known') setKnown(s => new Set([...s, card.word]))
    if (mark === 'unsure') setUnsure(s => new Set([...s, card.word]))
    if (index >= deck.length - 1) {
      setDone(true)
    } else {
      setIndex(i => i + 1)
      setFlipped(false)
      setAnimKey(k => k + 1)
    }
  }

  function restart() {
    setDeck(shuffle(words))
    setIndex(0)
    setFlipped(false)
    setKnown(new Set())
    setUnsure(new Set())
    setDone(false)
    setAnimKey(k => k + 1)
  }

  function reviewUnsure() {
    const unsureWords = words.filter(w => unsure.has(w.word))
    setDeck(shuffle(unsureWords.length > 0 ? unsureWords : words))
    setIndex(0)
    setFlipped(false)
    setKnown(new Set())
    setUnsure(new Set())
    setDone(false)
    setAnimKey(k => k + 1)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">這輪完成！</h2>
        <div className="flex gap-6 text-center">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl px-6 py-4">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{known.size}</div>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">已記住</div>
          </div>
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl px-6 py-4">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{unsure.size}</div>
            <div className="text-sm text-amber-700 dark:text-amber-300 mt-1">不確定</div>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {unsure.size > 0 && (
            <button onClick={reviewUnsure}
              className="w-full py-3 rounded-2xl bg-brand-500 text-white font-semibold text-lg active:scale-95 transition-transform">
              複習不確定的 ({unsure.size})
            </button>
          )}
          <button onClick={restart}
            className="w-full py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-lg active:scale-95 transition-transform">
            重新洗牌
          </button>
          <button onClick={onBack}
            className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold text-lg active:scale-95 transition-transform">
            返回主選單
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4">
      {/* Progress bar */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
          <span>{index + 1} / {deck.length}</span>
          <span>{card.pos}</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / deck.length) * 100}%` }} />
        </div>
      </div>

      {/* Card */}
      <div key={animKey}
        className="w-full max-w-sm cursor-pointer animate-flipIn"
        onClick={() => setFlipped(f => !f)}>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700
          min-h-[240px] flex flex-col items-center justify-center p-8 gap-4 select-none">
          {!flipped ? (
            <>
              <p className="text-4xl font-bold text-slate-800 dark:text-white tracking-wide">{card.word}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">點擊查看中文</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-semibold text-brand-600 dark:text-brand-400">{card.zh}</p>
              <p className="text-lg text-slate-500 dark:text-slate-400">{card.word}</p>
            </>
          )}
        </div>
      </div>

      {/* Hint before flip */}
      {!flipped && (
        <p className="text-slate-400 dark:text-slate-500 text-sm">點擊卡片翻面</p>
      )}

      {/* Action buttons — only shown after flip */}
      {flipped && (
        <div className="flex gap-4 w-full max-w-sm animate-slideUp">
          <button onClick={() => next('unsure')}
            className="flex-1 py-4 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold text-base active:scale-95 transition-transform">
            🤔 不確定
          </button>
          <button onClick={() => next('known')}
            className="flex-1 py-4 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold text-base active:scale-95 transition-transform">
            ✓ 記住了
          </button>
        </div>
      )}

      {/* Skip (without marking) */}
      {flipped && (
        <button onClick={() => next(null)}
          className="text-slate-400 dark:text-slate-500 text-sm underline underline-offset-2">
          略過
        </button>
      )}
    </div>
  )
}
