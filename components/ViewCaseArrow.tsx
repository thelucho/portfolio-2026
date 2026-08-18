/** Arrow next to view-case / CTA links. SVG so mobile never falls back to the emoji glyph. */
export default function ViewCaseArrow() {
  return (
    <span aria-hidden className="view-case-arrow text-lg leading-none">
      <ArrowIcon />
      <ArrowIcon />
    </span>
  )
}

function ArrowIcon() {
  return (
    <svg
      className="view-case-arrow-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  )
}
