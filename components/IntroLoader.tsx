'use client'

import dynamic from 'next/dynamic'

const Intro = dynamic(() => import('@/components/Intro'), { ssr: false })

export default function IntroLoader() {
    return <Intro />
}