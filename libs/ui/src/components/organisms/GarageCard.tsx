import { GaragesQuery } from '@autospace/network/src/gql/generated'
import { AutoImageChanger } from './AutoImageChanger'
import Link from 'next/link'
import { IconTypes } from '../molecules/IconTypes'
import { CreateManySlotsDialog } from './CreateManySlotsDialog'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

const UPDATE_GARAGE = gql`
  mutation UpdateGarage($updateGarageInput: UpdateGarageInput!) {
    updateGarage(updateGarageInput: $updateGarageInput) {
      id
      displayName
    }
  }
`

interface EditNameModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (newName: string) => void
  currentName: string
}

const EditNameModal = ({
  isOpen,
  onClose,
  onSave,
  currentName,
}: EditNameModalProps) => {
  const [newName, setNewName] = useState(currentName)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-semibold mb-4">Đổi tên gara</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          placeholder="Nhập tên mới"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onSave(newName)
              onClose()
            }}
            className="px-4 py-2 text-sm bg-primary rounded hover:bg-primary/80"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

export interface IGarageCardProps {
  garage: GaragesQuery['garages'][number]
}

export const GarageCard = ({ garage }: IGarageCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [updateGarage] = useMutation(UPDATE_GARAGE, {
    onCompleted: () => setIsModalOpen(false),
  })

  const handleSave = async (newName: string) => {
    try {
      await updateGarage({
        variables: {
          updateGarageInput: {
            id: garage.id,
            displayName: newName,
          },
        },
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to update garage name:', error)
    }
  }

  return (
    <div className="overflow-hidden bg-white shadow-lg flex flex-col">
      <AutoImageChanger images={garage.images || []} durationPerImage={5000} />

      <div className="p-2 flex-grow flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <h3 className="font-semibold">{garage.displayName}</h3>
            </div>
            <Link
              className="text-sm underline underline-offset-4"
              href={{ pathname: 'bookings', query: { garageId: garage.id } }}
            >
              Bookings
            </Link>
          </div>
          <p className="text-gray-500 text-sm my-2 line-clamp-2">
            {garage.description}
          </p>
          <p className="text-sm text-gray-400">
            Address: {garage.address?.address}
          </p>
        </div>
        <div className="flex gap-2 mt-auto">
          <>
            {garage.slotCounts.map((slotType) => (
              <div
                key={slotType.type}
                className="flex items-center justify-center w-16 h-10 gap-1 border-2 border-primary"
              >
                <div>{IconTypes[slotType.type]}</div>
                <div className="text-sm">{slotType.count}</div>
              </div>
            ))}
            <CreateManySlotsDialog garageId={garage.id} />
          </>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 text-md bg-primary rounded hover:bg-primary/80 font-medium"
        >
          {isModalOpen ? ' ✏️Hủy đổi tên' : ' ✏️Đổi tên'}
        </button>
      </div>

      <EditNameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        currentName={garage.displayName as string}
      />
    </div>
  )
}
