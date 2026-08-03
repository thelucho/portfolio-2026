type NoiseLayerProps = {
  className?: string
}

/** Tiled noise for background surfaces — place below text/images in the stacking order. */
export default function NoiseLayer({ className = '' }: NoiseLayerProps) {
  return (
    <div
      aria-hidden
      className={['pointer-events-none absolute inset-0 bg-repeat opacity-80', className]
        .filter(Boolean)
        .join(' ')}
      style={{
        backgroundImage: "url('/images/background/background-noise.png')",
        backgroundSize: '128px 128px',
      }}
    />
  )
}
