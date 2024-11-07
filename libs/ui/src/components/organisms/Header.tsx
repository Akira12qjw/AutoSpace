'use client'
import { BaseComponent, MenuItem, Role } from '@autospace/util/types'
import { Brand } from '../atoms/Brand'
import { Container } from '../atoms/Container'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Sidebar } from './Sidebar'
import { UserInfo } from '../molecules/UserInfo'
import { LogoutButton } from '../molecules/LogoutButton'
import { Button } from '../atoms/Button'
import { useDialogState } from '@autospace/util/hooks/dialog'
import { NavSidebar } from './NavSidebar'
import { Menus } from './Menus'
import Popover from '../molecules/Popover'
import { useTranslation } from 'react-i18next'
import { locales } from '@autospace/i18next/i18n'
export type IHeaderProps = {
  type?: Role
  menuItems: MenuItem[]
} & BaseComponent

export const Header = ({ type, menuItems }: IHeaderProps) => {
  const { i18n } = useTranslation()
  const { t } = useTranslation(['home', 'info'])
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const session = useSession()
  const uid = session?.data?.user?.uid
  let [open, setOpen] = useDialogState(false)
  const changeLanguage = (lng: 'vi' | 'en') => {
    i18n.changeLanguage(lng)
  }
  return (
    <header>
      <nav className="fixed z-40 top-0 w-full shadow-md bg-white/50 backdrop-blur-md">
        <Container className="relative   flex items-center justify-between h-16 py-2 gap-16">
          <Link href="/" aria-label="Home" className="w-auto z-50">
            <Brand type={type} className="hidden h-10 sm:block" />
            <Brand type={type} shortForm className="block sm:hidden" />
          </Link>
          <div className="flex items-center gap-2">
            {uid ? (
              <div className="flex gap-6 items-center">
                <div className="text-sm mr-6 flex gap-3">
                  <Menus menuItems={menuItems} />
                </div>

                <NavSidebar menuItems={menuItems} />
              </div>
            ) : (
              <>
                <Popover
                  className="flex cursor-pointer items-center py-1 hover:text-[#ffdd00]"
                  renderPopover={
                    <div className="relative rounded-sm border border-gray-600 bg-white shadow-md">
                      <div className="flex flex-col py-2 pr-28 pl-3">
                        <button
                          className="py-2 px-3 text-left hover:text-orange"
                          onClick={() => changeLanguage('en')}
                        >
                          English
                        </button>
                        <button
                          className="py-2 px-3 text-left hover:text-orange"
                          onClick={() => changeLanguage('vi')}
                        >
                          Tiếng Việt
                        </button>
                      </div>
                    </div>
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    />
                  </svg>
                  <span className="mx-1">{currentLanguage}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </Popover>
                <Link href="/register">
                  <Button variant="outlined" className="hidden md:block">
                    {t('aside filter.Register')}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button>{t('aside filter.Login')}</Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </nav>
      <div className="h-16" />
    </header>
  )
}
