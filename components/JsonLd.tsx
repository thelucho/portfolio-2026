import { serializeJsonLd, type JsonLd as JsonLdData } from '@/lib/seo'

type JsonLdProps = {
  data: JsonLdData | JsonLdData[]
}

/** Server-rendered JSON-LD. Native script — not next/script — per Next.js docs. */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
