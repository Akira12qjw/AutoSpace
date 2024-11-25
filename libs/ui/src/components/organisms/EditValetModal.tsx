// components/EditValetModal.tsx
import { Dialog } from '@mui/material'
import { useState } from 'react'

interface EditValetModalProps {
  isOpen: boolean
  onClose: () => void
  valet: {
    uid: string
    displayName: string
    phoneNumber: string
  }
  onSave: (data: { displayName: string; phoneNumber: string }) => void
}

export const EditValetModal = ({
  isOpen,
  onClose,
  valet,
  onSave,
}: EditValetModalProps) => {
  const [formData, setFormData] = useState({
    displayName: valet.displayName,
    phoneNumber: valet.phoneNumber,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Chỉnh sửa thông tin nhân viên
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Tên nhân viên"
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="Số điện thoại"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-primary rounded">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
