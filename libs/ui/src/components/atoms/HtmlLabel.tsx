import React, { HTMLProps } from 'react'
import { FormError } from './FormError'
import { useTranslation } from 'react-i18next'

export type HtmlLabelProps = HTMLProps<HTMLLabelElement> & {
  error?: string | undefined
  optional?: boolean
}

export const HtmlLabel = React.forwardRef<HTMLLabelElement, HtmlLabelProps>(
  ({ children, title, optional, error, className }, ref) => {
    const { t } = useTranslation(['garage'])
    return (
      <label ref={ref} className={` text-sm block select-none ${className}`}>
        <div className="flex items-baseline justify-between">
          <div className="mb-1 font-semibold capitalize">{title}</div>
          <div className="text-xs text-gray-600 ">
            {optional ? `${t('optional')}` : null}
          </div>
        </div>
        {children}
        <FormError error={error} />
      </label>
    )
  },
)

HtmlLabel.displayName = 'HtmlLabel'
