import * as React from "react"

import type { SVGProps } from "react"

const MidasLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.48rem"
    height="19.52px"
    fill="none"
    {...props}
  >
    <path
      fill="#523F99"
      d="m4.323.035 10.979.062s1.154.867 1.555 2.053c.395 1.17 1.221 2.802 1.221 2.802s-1.98-1.074-3.582-.512v15.076H9.53V4.597H4.922v14.918H0V4.335a4.3 4.3 0 0 1 4.323-4.3Z"
    />
    <path
      fill="#7743DB"
      d="M16.778.011s7.227-.519 6.89 5.544c0 0-.684.13-1.722-.18a5.452 5.452 0 0 1-3.207-2.622c-.585-1.068-1.476-2.57-1.96-2.742ZM18.434 5.582s.827 1.338 5.246 1.315v12.618h-5.246V5.582Z"
    />
  </svg>
)

export default MidasLogo
