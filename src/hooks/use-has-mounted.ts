// src/hooks/use-has-mounted.ts
import { useState, useEffect } from 'react'

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}