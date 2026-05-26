import { useState, useCallback } from 'react'

const KEY = 'wordup_progress'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function useProgress() {
  const [progress, setProgress] = useState(load)

  const record = useCallback((word, correct) => {
    setProgress(prev => {
      const entry = prev[word] || { correct: 0, total: 0 }
      const next = {
        ...prev,
        [word]: { correct: entry.correct + (correct ? 1 : 0), total: entry.total + 1 }
      }
      save(next)
      return next
    })
  }, [])

  const reset = useCallback((level) => {
    setProgress(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(k => { if (next[k].level === level) delete next[k] })
      save(next)
      return next
    })
  }, [])

  const getStats = useCallback((words) => {
    const total = words.length
    const practiced = words.filter(w => progress[w.word]?.total > 0).length
    const totalCorrect = words.reduce((s, w) => s + (progress[w.word]?.correct || 0), 0)
    const totalAnswered = words.reduce((s, w) => s + (progress[w.word]?.total || 0), 0)
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0
    return { total, practiced, accuracy, totalAnswered }
  }, [progress])

  return { progress, record, reset, getStats }
}
