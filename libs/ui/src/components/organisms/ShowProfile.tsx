'use client'
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { gql, useMutation, useQuery } from '@apollo/client'
import { LoginDocument } from '@autospace/network/src/gql/generated'
import { useTranslation } from 'react-i18next'
const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      uid
      name
      image
    }
  }
`

export const ShowProfile = () => {
  const { t } = useTranslation(['home', 'info'])
  const { data: session } = useSession()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
  })

  const [updateUser] = useMutation(UPDATE_USER)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.uid) return

    try {
      await updateUser({
        variables: {
          updateUserInput: {
            uid: session.user.uid,
            name: formData.name,
          },
        },
      })
      setIsEditing(false)
      setShowLogoutModal(true) // Hiển thị modal sau khi cập nhật thành công
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (!session?.user) {
    return <div>Please sign in to view profile</div>
  }

  // Thêm component Modal thông báo
  const LogoutModal = ({ onClose }: { onClose: () => void }) => {
    const handleLogout = () => {
      signOut({ callbackUrl: '/login' }) // Đăng xuất và chuyển về trang login
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-medium mb-4">
            {' '}
            {t('aside filter.Update sucessfull')}
          </h3>
          <p className="mb-6">
            {t('aside filter.Please log out and log in to update information')}
          </p>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            >
              {t('aside filter.Later')}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-primary rounded-md hover:bg-primary-300 text-white"
            >
              {t('aside filter.Logout')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-[9%]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{t('aside filter.Profile')} </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 text-sm bg-primary rounded-md hover:bg-primary-300"
          >
            {isEditing ? t('aside filter.Cancel') : t('aside filter.Edit')}
          </button>
        </div>

        <div className="flex items-center mb-6">
          {session.user.image && (
            <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6">
              <Image
                src={session.user.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary rounded-md hover:bg-primary-300"
            >
              {t('aside filter.Save')}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">UID</h3>
              <p className="mt-1 text-sm text-gray-900">{session.user.uid}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-sm text-gray-900">{session.user.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1 text-sm text-gray-900">{session.user.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Thêm Modal */}
      {showLogoutModal && (
        <LogoutModal onClose={() => setShowLogoutModal(false)} />
      )}
    </>
  )
}
