'use client'

import React, { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  locale?: string
  className?: string
  style?: React.CSSProperties
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

const AnimatedNumber = ({
  value,
  duration = 800,
  prefix = '',
  suffix = '',
  decimals = 0,
  locale = 'en-IN',
  className,
  style
}: Props) => {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const targetRef = useRef(value)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const displayRef = useRef(value)

  useEffect(() => {
    displayRef.current = display
  }, [display])

  useEffect(() => {
    if (value === targetRef.current) return

    fromRef.current = displayRef.current
    targetRef.current = value
    startRef.current = null

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = duration <= 0 ? 1 : Math.min(1, elapsed / duration)
      const eased = easeOutCubic(t)
      const next = fromRef.current + (targetRef.current - fromRef.current) * eased

      setDisplay(next)

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        rafRef.current = null
        setDisplay(targetRef.current)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [value, duration])

  const formatted = display.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}

export default AnimatedNumber
