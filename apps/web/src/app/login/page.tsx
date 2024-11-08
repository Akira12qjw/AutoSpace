'use client'
import { LoginForm } from '@autospace/ui/src/components/templates/LoginForm'
import { AuthLayout } from '@autospace/ui/src/components/molecules/AuthLayout'
import { useTranslation } from 'react-i18next'
export default function Page() {
  const { t } = useTranslation('login')
  return (
    <AuthLayout title={t('Login')}>
      <LoginForm />
    </AuthLayout>
  )
}
