'use client'
import { RegisterForm } from '@autospace/ui/src/components/templates/RegisterForm'
import { AuthLayout } from '@autospace/ui/src/components/molecules/AuthLayout'
import { useTranslation } from 'react-i18next'

export default function Page() {
  const { t } = useTranslation('register')
  return (
    <AuthLayout title={t('Register')}>
      <RegisterForm />
    </AuthLayout>
  )
}
