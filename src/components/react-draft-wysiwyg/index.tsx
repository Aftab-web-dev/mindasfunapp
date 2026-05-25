'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import type { EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// Load editor only on client
const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

// Suppress the harmless react-draft-wysiwyg setState warning in development/StrictMode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      args[0].includes("Can't call setState on a component that is not yet mounted") &&
      (args[0].includes("in the i component") || args[0].includes("i component"))
    ) {
      return
    }
    originalError(...args)
  }
}

export default function SafeDraftEditor(props: EditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Ensures the editor loads AFTER hydration
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div style={{ height: 120 }} /> // placeholder to avoid layout shift
  }

  return <Editor {...props} />
}
