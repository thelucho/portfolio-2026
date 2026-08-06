/**
 * Generates favicon.ico, apple-icon.png, and PWA icons from the asterisk mark.
 * Run: node scripts/generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const FOREST = '#2B4625'
const OLIVE = '#ABC337'

/** Eight-ray asterisk paths from AsteriskMark (viewBox 0 0 306 306). */
function asteriskGroup(fill = OLIVE) {
  return `
    <rect x="153" width="15.3" height="306" fill="${fill}"/>
    <rect x="306" y="145.351" width="15.3" height="306" transform="rotate(90 306 145.351)" fill="${fill}"/>
    <rect x="261.187" y="44.813" width="15.3" height="306" transform="rotate(45 261.187 44.813)" fill="${fill}"/>
    <rect x="266.596" y="255.779" width="15.3" height="306" transform="rotate(135 266.596 255.779)" fill="${fill}"/>
  `
}

/**
 * Square brand icon with olive asterisk.
 * @param {number} size
 * @param {{ markRatio?: number, background?: string | null }} [options]
 *   markRatio — fraction of the canvas the mark occupies (0–1). Use 1 for edge-to-edge.
 *   background — solid fill, or null/omit for transparent.
 */
function brandIconSvg(size, { markRatio = 0.62, background = FOREST } = {}) {
  const pad = Number((((1 - markRatio) / 2) * size).toFixed(4))
  const markSize = size * markRatio
  const scale = Number((markSize / 306).toFixed(6))
  const bg =
    background != null
      ? `<rect width="${size}" height="${size}" fill="${background}"/>`
      : ''
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">
  ${bg}
  <g transform="translate(${pad} ${pad}) scale(${scale})">
    ${asteriskGroup(OLIVE)}
  </g>
</svg>`
}

/**
 * Pack PNG buffers into a multi-size .ico (PNG-compressed entries).
 * @param {{ size: number, png: Buffer }[]} images
 */
function pngsToIco(images) {
  const count = images.length
  const headerSize = 6
  const dirEntrySize = 16
  const dirSize = headerSize + dirEntrySize * count

  let offset = dirSize
  const entries = images.map(({ size, png }) => {
    const entry = { size, png, offset, byteLength: png.length }
    offset += png.length
    return entry
  })

  const buf = Buffer.alloc(offset)
  // ICONDIR
  buf.writeUInt16LE(0, 0) // reserved
  buf.writeUInt16LE(1, 2) // type: icon
  buf.writeUInt16LE(count, 4)

  entries.forEach((entry, i) => {
    const o = headerSize + i * dirEntrySize
    // 0 means 256 in the ICO width/height bytes
    const dim = entry.size >= 256 ? 0 : entry.size
    buf.writeUInt8(dim, o) // width
    buf.writeUInt8(dim, o + 1) // height
    buf.writeUInt8(0, o + 2) // color palette
    buf.writeUInt8(0, o + 3) // reserved
    buf.writeUInt16LE(1, o + 4) // color planes
    buf.writeUInt16LE(32, o + 6) // bits per pixel
    buf.writeUInt32LE(entry.byteLength, o + 8)
    buf.writeUInt32LE(entry.offset, o + 12)
    entry.png.copy(buf, entry.offset)
  })

  return buf
}

async function renderPng(size, options) {
  const svg = Buffer.from(brandIconSvg(size, options))
  return sharp(svg).png().ensureAlpha().toBuffer()
}

async function main() {
  const publicIcons = join(root, 'public', 'icons')
  mkdirSync(publicIcons, { recursive: true })

  // Favicon — transparent, mark fills the canvas edge-to-edge
  const faviconOpts = { markRatio: 1, background: null }
  writeFileSync(join(root, 'app', 'icon.svg'), brandIconSvg(32, faviconOpts))

  // Apple touch icon (iOS home screen) — opaque forest field required
  const apple = await renderPng(180, { markRatio: 0.58 })
  writeFileSync(join(root, 'app', 'apple-icon.png'), apple)

  // PWA / Android
  writeFileSync(
    join(publicIcons, 'icon-192.png'),
    await renderPng(192, { markRatio: 0.58 }),
  )
  writeFileSync(
    join(publicIcons, 'icon-512.png'),
    await renderPng(512, { markRatio: 0.58 }),
  )
  // Maskable: more padding so the mark stays in the safe zone
  writeFileSync(
    join(publicIcons, 'icon-512-maskable.png'),
    await renderPng(512, { markRatio: 0.48 }),
  )

  // favicon.ico — 16, 32, 48 (transparent)
  const icoImages = await Promise.all(
    [16, 32, 48].map(async (size) => ({
      size,
      png: await renderPng(size, faviconOpts),
    })),
  )
  writeFileSync(join(root, 'app', 'favicon.ico'), pngsToIco(icoImages))

  console.log('Generated:')
  console.log('  app/icon.svg')
  console.log('  app/favicon.ico')
  console.log('  app/apple-icon.png')
  console.log('  public/icons/icon-192.png')
  console.log('  public/icons/icon-512.png')
  console.log('  public/icons/icon-512-maskable.png')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
