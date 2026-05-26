import { useState, useCallback } from 'react'

const KEY = 'wordup_bookmarks_v1'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load)

  const toggleBookmark = useCallback((level, word) => {
    setBookmarks(prev => {
      const arr = prev[level] || []
      const next = {
        ...prev,
        [level]: arr.includes(word) ? arr.filter(w => w !== word) : [...arr, word]
      }
      save(next)
      return next
    })
  }, [])

  const isBookmarked = useCallback((level, word) => {
    return (bookmarks[level] || []).includes(word)
  }, [bookmarks])

  const getBookmarkedWords = useCallback((level, words) => {
    const arr = bookmarks[level] || []
    return words.filter(w => arr.includes(w.word))
  }, [bookmarks])

  return { toggleBookmark, isBookmarked, getBookmarkedWords }
}
