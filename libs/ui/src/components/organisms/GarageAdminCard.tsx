import { GaragesQuery } from '@autospace/network/src/gql/generated'
import { ReactNode, useState } from 'react'
import { MapLink } from '../molecules/MapLink'
import { IconTypes } from '../molecules/IconTypes'
import { gql, useMutation } from '@apollo/client'

// Mutation để xóa garage
const DELETE_GARAGE = gql`
  mutation RemoveGarage($where: GarageWhereUniqueInput!) {
    removeGarage(where: $where) {
      id
      displayName
    }
  }
`

export const GarageAdminCard = ({
  children,
  garage,
}: {
  children: ReactNode
  garage: GaragesQuery['garages'][0]
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const [deleteGarage, { loading: isDeleting }] = useMutation(DELETE_GARAGE, {
    update(cache, { data: { removeGarage } }) {
      // Cập nhật cache sau khi xóa
      cache.modify({
        fields: {
          garages(existingGarages = [], { readField }) {
            return existingGarages.filter(
              (garageRef: any) =>
                readField('id', garageRef) !== removeGarage.id,
            )
          },
        },
      })
    },
    onError: (error) => {
      console.error('Failed to delete garage:', error)
      // Có thể thêm thông báo lỗi ở đây
    },
  })

  const handleDelete = async () => {
    try {
      await deleteGarage({
        variables: {
          where: {
            id: Number(garage.id),
          },
        },
      })
      setShowConfirmDelete(false)
    } catch (error) {
      console.error('Failed to delete garage:', error)
    }
  }
  return (
    <div className="p-2 bg-white flex flex-col gap-2">
      <p className="text-xs ">#{garage.id}</p>
      <div className="flex items-start gap-2">
        <h2 className="mb-1 font-semibold">{garage.displayName}</h2>
        <div>
          {garage.verification?.verified ? (
            <span className="px-1 py-0.5 shadow text-xs bg-green-50 ">
              Verified
            </span>
          ) : (
            <span className="px-1 py-0.5 shadow text-xs bg-red-50 ">
              Not Verified
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {garage.address ? (
          <MapLink
            waypoints={[garage.address]}
            className="hover:underline underline-offset-4"
          >
            <p className="text-xs text-gray-700 ">{garage.address?.address}</p>
          </MapLink>
        ) : null}
      </div>
      <div className="mt-2 mb-4 flex gap-3 ">
        {garage.slotCounts.length === 0 ? (
          <div className="text-sm ">No slots.</div>
        ) : null}
        {garage.slotCounts.map((slot, index) => (
          <div key={index} className="py-2 flex gap-1 ">
            {IconTypes[slot.type]}
            <span className="text-gray-500">{slot.count}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">{children}</div>
      {/* Thêm nút Delete */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setShowConfirmDelete(true)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
      {/* Modal xác nhận xóa */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
            Bạn có chắc chắn muốn xóa {garage.displayName} ?
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 
                  ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
