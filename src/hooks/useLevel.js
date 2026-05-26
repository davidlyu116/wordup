import { useState } from 'react'

const KEY = 'wordup_level'

export function useLevel() {
  const [level, setLevelState] = useState(() => localStorage.getItem(KEY) || null)

  function setLevel(l) {
    localStorage.setItem(KEY, l)
    setLevelState(l)
  }

  return { level, setLevel }
}
