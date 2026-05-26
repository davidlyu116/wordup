import { useState } from 'react'
import FlashCard from './FlashCard'

export default function FlashTab({ words, level, isBookmarked, onToggleBookmark, bookmarkedWords }) {
  const [mode, setMode] = useState('all')

  const isBm     = (word) => isBookmarked(level, word)
  const toggleBm = (word) => onToggleBookmark(level, word)
  const count    = bookmarkedWords.length

  return (
    <div className="pb-24 pt-4">
      {/* 全部 / 收藏 切換 */}
      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mx-4 mb-4">
        <button
          onClick={() => setMode('all')}
          className={[
            'flex-1 py-2 rounded-xl text-sm font-semibold transition-all outline-none focus:outline-none',
            mode === 'all'
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400',
          ].join(' ')}>
          全部單字
        </button>
        <button
          onClick={() => setMode('bookmarked')}
          className={[
            'flex-1 py-2 rounded-xl text-sm font-semibold transition-all outline-none focus:outline-none',
            mode === 'bookmarked'
              ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400',
          ].join(' ')}>
          ⭐ 收藏{count > 0 ? ` (${count})` : ''}
        </button>
      </div>

      {/* 收藏模式且無收藏 */}
      {mode === 'bookmarked' && count === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 px-4 text-center">
          <div className="text-5xl">⭐</div>
          <div>
            <p className="font-bold text-slate-700 dark:text-slate-200">還沒有收藏的單字</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              在單字卡右上角點 ☆ 來收藏不熟悉的單字
            </p>
          </div>
        </div>
      ) : (
        <FlashCard
          key={mode}
          words={mode === 'bookmarked' ? bookmarkedWords : words}
          isBookmarked={isBm}
          onToggleBookmark={toggleBm}
          sessionKey={mode}
        />
      )}
    </div>
  )
}
