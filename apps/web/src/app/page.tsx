'use client'
import { CarScene } from '@autospace/3d/src/scenes/CarScene'
import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
export default function Home() {
  const { t } = useTranslation(['home'])
  const { i18n } = useTranslation()
  const maxWidthClass = i18n.language === 'en' ? 'max-w-md' : 'max-w-2xl'
  return (
    <main className="h-[calc(100vh-4rem)] ">
      <div className="absolute top-16 bottom-0 left-0 right-0">
        <CarScene />
      </div>
      <div className="flex flex-col items-start space-y-2 font-black text-8xl">
        <div className="z-10 inline-block px-3 bg-primary mt-2">
          {t('aside filter.Need')}
        </div>{' '}
        <div
          className={`z-10 inline-block w-full ${maxWidthClass} px-3 bg-primary`}
        >
          {t('aside filter.parking')}
        </div>
        <Link
          href="/search"
          className="z-10 flex items-center gap-2 px-3 py-2 text-xl font-medium text-black
           underline underline-offset-4 bg-primary"
        >
          <IconSearch /> {t('aside filter.Search now')}
        </Link>
      </div>
    </main>
  )
}
