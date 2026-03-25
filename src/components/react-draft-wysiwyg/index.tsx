'use client'

import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

import type { EditorProps } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// Load editor only on client
const Editor = dynamic<EditorProps>(() => import('react-draft-wysiwyg').then(mod => mod.Editor), { ssr: false })

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
