'use client'
import { Role } from '@autospace/util/types'
import { BrandIcon } from './BrandIcon'
import { useTranslation } from 'react-i18next'
import { locales } from '@autospace/i18next/i18n'
export interface IBrandProps {
  className?: string
  shortForm?: boolean
  type?: Role
}

export const Brand = ({
  shortForm = false,
  className,
  type = undefined,
}: IBrandProps) => {
  const { i18n } = useTranslation()
  const { t } = useTranslation(['home'])
  return (
    <div className={`grid place-items-center z-50 ${className}`}>
      <div className="text-xl ">
        {shortForm ? (
          <div className="flex gap-1">
            <BrandIcon /> A.
          </div>
        ) : (
          <div className="flex items-center gap-2 font-medium tracking-tighter font-playfair">
            <BrandIcon />
            <div>
              <div className="flex gap-1">
                <div>Autospace</div>
                {type ? <span className="text-xs">{type}</span> : null}
              </div>
              <div className="text-xs text-gray">
                {t('aside filter.Smart parking')}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
