import { Suspense } from 'react'
import { DesignPage } from '@/lab/DesignPage'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return (
    <Suspense>
      <DesignPage slug={slug} />
    </Suspense>
  )
}
