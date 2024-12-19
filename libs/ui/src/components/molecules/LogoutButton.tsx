'use client'
import { IconDoorExit } from '@tabler/icons-react'
import { signOut } from 'next-auth/react'
import { Button } from '../atoms/Button'
import { locales } from '@autospace/i18next/i18n'
import { useTranslation } from 'react-i18next'
export const LogoutButton = () => {
  const { t } = useTranslation(['home'])
  return (
    <Button
      variant="outlined"
      onClick={() => {
        signOut()
      }}
      className="flex gap-2"
    >
      <IconDoorExit /> {t('aside filter.Logout')}
    </Button>
  )
}
