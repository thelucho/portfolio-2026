import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const

export const OG_CONTENT_TYPE = 'image/png'

type OgImageOptions = {
  eyebrow?: string
  title: string
  description?: string
  imageSrc?: string
}

async function loadFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`
    const css = await fetch(cssUrl, {
      headers: {
        // Older Safari UA so Google Fonts serves TTF/OTF (Satori cannot use woff2).
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    }).then((res) => res.text())

    const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
    if (!match?.[1]) return null

    const fontRes = await fetch(match[1])
    if (!fontRes.ok) return null
    return fontRes.arrayBuffer()
  } catch {
    return null
  }
}

export async function publicImageDataUrl(
  publicPath: string,
): Promise<string | null> {
  const relative = publicPath.replace(/^\//, '')
  const ext = relative.split('.').pop()?.toLowerCase()
  const mime =
    ext === 'jpg' || ext === 'jpeg'
      ? 'image/jpeg'
      : ext === 'png'
        ? 'image/png'
        : ext === 'webp'
          ? 'image/webp'
          : null
  if (!mime) return null

  try {
    const buffer = await readFile(join(process.cwd(), 'public', relative))
    return `data:${mime};base64,${buffer.toString('base64')}`
  } catch {
    return null
  }
}

function AsteriskMark() {
  const arm = {
    position: 'absolute' as const,
    backgroundColor: '#ABC337',
    width: 8,
    height: 72,
    top: 4,
    left: 36,
  }

  return (
    <div
      style={{
        display: 'flex',
        width: 80,
        height: 80,
        position: 'relative',
      }}
    >
      <div style={arm} />
      <div style={{ ...arm, transform: 'rotate(90deg)' }} />
      <div style={{ ...arm, transform: 'rotate(45deg)' }} />
      <div style={{ ...arm, transform: 'rotate(135deg)' }} />
    </div>
  )
}

export async function generateOgImage({
  eyebrow = SITE.tagline,
  title,
  description,
  imageSrc,
}: OgImageOptions) {
  const [serif, sans, photo] = await Promise.all([
    loadFont('Averia Serif Libre', 400),
    loadFont('Manrope', 600),
    imageSrc ? publicImageDataUrl(imageSrc) : Promise.resolve(null),
  ])

  const fonts = [
    serif
      ? { name: 'Averia Serif Libre', data: serif, weight: 400 as const }
      : null,
    sans ? { name: 'Manrope', data: sans, weight: 600 as const } : null,
  ].filter(Boolean) as Array<{
    name: string
    data: ArrayBuffer
    weight: 400 | 600
  }>

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#2B4625',
          color: '#FDFDEA',
          fontFamily: sans ? 'Manrope' : 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: 520,
            backgroundColor: '#516B4C',
            opacity: 0.55,
            top: -160,
            left: -80,
          }}
        />

        {photo ? (
          <div
            style={{
              display: 'flex',
              width: 480,
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              width={480}
              height={630}
              style={{ objectFit: 'cover', width: 480, height: 630 }}
            />
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: photo ? '56px 56px 48px 56px' : '64px 72px 56px 72px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: serif ? 'Averia Serif Libre' : 'serif',
                  fontSize: 36,
                  letterSpacing: -1,
                }}
              >
                THELUCHO
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: '#ABC337',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}
              >
                {eyebrow}
              </div>
            </div>
            <AsteriskMark />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                fontFamily: serif ? 'Averia Serif Libre' : 'serif',
                fontSize: title.length > 28 ? 56 : 72,
                lineHeight: 1.05,
                letterSpacing: -2,
                maxWidth: 760,
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.4,
                  color: 'rgba(253, 253, 234, 0.78)',
                  maxWidth: 680,
                }}
              >
                {description}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 20,
              color: 'rgba(253, 253, 234, 0.7)',
              letterSpacing: 0.4,
            }}
          >
            {new URL(SITE.url).host}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: fonts.length > 0 ? fonts : undefined,
    },
  )
}
