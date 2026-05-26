import { useState, useCallback } from 'react'

const KEY = 'wordup_progress_v2'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  const record = useCallback((level, word, correct) => {
    setProgress(prev => {
      const levelData = prev[level] || {}
      const entry = levelData[word] || { correct: 0, total: 0 }
      const next = {
        ...prev,
        [level]: {
          ...levelData,
          [word]: { correct: entry.correct + (correct ? 1 : 0), total: entry.total + 1 }
        }
      }
      save(next)
      return next
    })
  }, [])

  const resetWord = useCallback((level, word) => {
    setProgress(prev => {
      const next = {
        ...prev,
        [level]: { ...(prev[level] || {}), [word]: { correct: 1, total: 1 } }
      }
      save(next)
      return next
    })
  }, [])

  const resetLevel = useCallback((level) => {
    setProgress(prev => {
      const next = { ...prev, [level]: {} }
      save(next)
      return next
    })
  }, [])

  const getStats = useCallback((level, words) => {
    const levelData = progress[level] || {}
    const total = words.length
    const practiced = words.filter(w => levelData[w.word]?.total > 0).length
    const totalCorrect = words.reduce((s, w) => s + (levelData[w.word]?.correct || 0), 0)
    const totalAnswered = words.reduce((s, w) => s + (levelData[w.word]?.total || 0), 0)
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    return { total, practiced, accuracy, totalAnswered }
  }, [progress])

  // 最近答錯的單字（不重複，最多 n 個）
  const getRecentWrong = useCallback((level, words, n = 5) => {
    const levelData = progress[level] || {}
    return words
      .filter(w => {
        const p = levelData[w.word]
        return p?.total > 0 && p.correct < p.total
      })
      .sort((a, b) => {
        const accA = (levelData[a.word]?.correct || 0) / (levelData[a.word]?.total || 1)
        const accB = (levelData[b.word]?.correct || 0) / (levelData[b.word]?.total || 1)
        return accA - accB  // 答對率低的排前面
      })
      .slice(0, n)
      .map(w => ({ ...w, stats: levelData[w.word] }))
  }, [progress])

  return { progress, record, resetWord, resetLevel, getStats, getRecentWrong }
}
