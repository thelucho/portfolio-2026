'use client'

import { forwardRef, type SVGProps } from 'react'

type AsteriskMarkProps = SVGProps<SVGSVGElement> & {
  /** Fill color for the eight rays. Default: brand olive. */
  color?: string
}

/** Eight-ray asterisk mark used in the footer and page heroes. */
const AsteriskMark = forwardRef<SVGSVGElement, AsteriskMarkProps>(
  function AsteriskMark({ color = '#ABC337', className, ...props }, ref) {
    return (
      <svg
        ref={ref}
        aria-hidden
        viewBox="0 0 306 306"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
      >
        <rect x="153" width="15.3" height="306" fill={color} />
        <rect
          x="306"
          y="145.351"
          width="15.3"
          height="306"
          transform="rotate(90 306 145.351)"
          fill={color}
        />
        <rect
          x="261.187"
          y="44.813"
          width="15.3"
          height="306"
          transform="rotate(45 261.187 44.813)"
          fill={color}
        />
        <rect
          x="266.596"
          y="255.779"
          width="15.3"
          height="306"
          transform="rotate(135 266.596 255.779)"
          fill={color}
        />
      </svg>
    )
  },
)

export default AsteriskMark
