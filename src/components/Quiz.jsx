import { useState, useCallback, useEffect } from 'react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildQuestion(word, allWords, direction) {
  const dir = direction === 'random'
    ? (Math.random() < 0.5 ? 'en-zh' : 'zh-en')
    : direction

  // 4 distractors from pool (exclude current word)
  const pool = allWords.filter(w => w.word !== word.word)
  const distractors = shuffle(pool).slice(0, 3)

  if (dir === 'en-zh') {
    return {
      prompt: word.word,
      promptSub: word.pos,
      answer: word.zh,
      options: shuffle([word.zh, ...distractors.map(w => w.zh)]),
      dir,
    }
  } else {
    return {
      prompt: word.zh,
      promptSub: null,
      answer: word.word,
      options: shuffle([word.word, ...distractors.map(w => w.word)]),
      dir,
    }
  }
}

export default function Quiz({ words, direction, count = 20, onBack, record }) {
  const [batch] = useState(() => shuffle(words).slice(0, count))
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState(null)
  const [selected, setSelected] = useState(null)
  const [shakeKey, setShakeKey] = useState(0)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [wrongList, setWrongList] = useState([])

  const buildQ = useCallback((idx) => {
    setQuestion(buildQuestion(batch[idx], words, direction))
    setSelected(null)
  }, [batch, words, direction])

  useEffect(() => { buildQ(0) }, [buildQ])

  function choose(opt) {
    if (selected !== null) return
    // 移除 iOS focus 殘留，防止 focus 狀態轉移到下一題同位置的按鈕
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    setSelected(opt)
    const correct = opt === question.answer
    if (correct) {
      setScore(s => s + 1)
    } else {
      setShakeKey(k => k + 1)
      setWrongList(list => [...list, { word: batch[index], question }])
    }
    record(batch[index].word, correct)

    setTimeout(() => {
      if (index >= batch.length - 1) {
        setDone(true)
      } else {
        setIndex(i => i + 1)
        buildQ(index + 1)
      }
    }, 900)
  }

  if (!question) return null

  if (done) {
    return (
      <div className="flex flex-col items-center px-4 pt-6 gap-6">
        <div className="text-5xl">{score === batch.length ? '🏆' : score >= batch.length * 0.8 ? '🌟' : '💪'}</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">測驗結果</h2>
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700 w-full max-w-sm p-6 flex justify-around">
          <div className="text-center">
            <div className="text-4xl font-bold text-brand-500">{score}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">答對</div>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-4xl font-bold text-rose-500">{batch.length - score}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">答錯</div>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-4xl font-bold text-slate-700 dark:text-slate-200">{Math.round(score / batch.length * 100)}%</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">答對率</div>
          </div>
        </div>

        {wrongList.length > 0 && (
          <div className="w-full max-w-sm">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">答錯的單字：</p>
            <div className="flex flex-col gap-2">
              {wrongList.map(({ word }) => (
                <div key={word.word} className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl px-4 py-3 flex justify-between items-center">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{word.word}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{word.zh}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-sm pb-6">
          <button onClick={onBack}
            className="w-full py-3 rounded-2xl bg-brand-500 text-white font-semibold text-lg active:scale-95 transition-transform">
            返回主選單
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 pt-4">
      {/* Progress */}
      <div className="w-full max-w-sm">
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
          <span>{index + 1} / {batch.length}</span>
          <span className="text-brand-500 font-medium">{score} 答對</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${((index) / batch.length) * 100}%` }} />
        </div>
      </div>

      {/* Direction badge */}
      <div className="self-start">
        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">
          {question.dir === 'en-zh' ? '英文 → 中文' : '中文 → 英文'}
        </span>
      </div>

      {/* Question card */}
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow border border-slate-100 dark:border-slate-700 p-8 flex flex-col items-center gap-2">
        <p className="text-3xl font-bold text-slate-800 dark:text-white text-center">{question.prompt}</p>
        {question.promptSub && (
          <p className="text-sm text-slate-400 dark:text-slate-500">{question.promptSub}</p>
        )}
      </div>

      {/* Options */}
      <div key={shakeKey} className="flex flex-col gap-3 w-full max-w-sm">
        {question.options.map(opt => {
          const isSelected = selected === opt
          const isAnswer = selected !== null && opt === question.answer
          const isWrong = isSelected && opt !== question.answer

          return (
            <button key={opt} onClick={() => choose(opt)}
              className={[
                'w-full py-4 px-5 rounded-2xl text-left font-medium text-base transition-all duration-150 outline-none focus:outline-none active:scale-[0.98]',
                isAnswer ? 'bg-green-500 text-white shadow-md' : '',
                isWrong  ? 'bg-rose-500 text-white animate-shake' : '',
                !isSelected && selected !== null && !isAnswer ? 'opacity-40' : '',
                selected === null ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 active:bg-slate-100 dark:active:bg-slate-700' : '',
              ].filter(Boolean).join(' ')}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
