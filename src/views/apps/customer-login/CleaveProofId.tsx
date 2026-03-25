import React from 'react'
import type { ForwardedRef } from 'react'

import Cleave from 'cleave.js/react'

const CleaveProofId = React.forwardRef(function CleavePhone(props: any, ref: ForwardedRef<HTMLInputElement>) {
  const { onChange, onBlur, value } = props

  return (
    <Cleave
      {...props}
      value={value}
      onBlur={onBlur}
      onChange={(e: any) => {
        onChange({ target: { value: e.target.rawValue } }) // raw numeric value
      }}
      options={{
        delimiters: ['-'],
        blocks: [4, 4, 4],
        numericOnly: true

        // uppercase: true
      }}
      htmlRef={ref}
    />
  )
})

export default CleaveProofId
