/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { CompanyValetsQuery } from '@autospace/network/src/gql/generated'
import { format } from 'date-fns'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { gql, useApolloClient, useMutation } from '@apollo/client'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material'
import { EditValetModal } from './EditValetModal'

export interface IValetCardProps {
  valet: CompanyValetsQuery['companyValets'][0]
  selectedValetId: string | null
  setSelectedValetId: (valetId: string | null) => void
}

interface BookingTimeline {
  bookingId: string
  valetId: string
  status: string
  timestamp: string
}

const UPDATE_VALET = gql`
  mutation UpdateValet($updateValetInput: UpdateValetInput!) {
    updateValet(updateValetInput: $updateValetInput) {
      uid
      displayName
      phoneNumber
    }
  }
`
export const ValetCard = ({
  valet,
  selectedValetId,
  setSelectedValetId,
}: IValetCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [bookings, setBookings] = useState<BookingTimeline[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSelected = selectedValetId === valet.uid
  const [updateValet] = useMutation(UPDATE_VALET)

  const fetchBookingTimelineData = async () => {
    if (!isSelected) return

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3000/booking-timelines')
      if (!response.ok) {
        throw new Error('Failed to fetch booking data')
      }
      const data = await response.json()
      const filteredData = data.filter(
        (booking: BookingTimeline) => booking.valetId === valet.uid,
      )

      setBookings(filteredData)
      setError(null)
    } catch (err) {
      setError('Error loading booking data. Please try again.')
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSelected) {
      fetchBookingTimelineData()
    }
  }, [isSelected, valet.uid])

  const handleToggleDialog = () => {
    setSelectedValetId(isSelected ? null : valet.uid)
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleSave = async (data: {
    displayName: string
    phoneNumber: string
  }) => {
    try {
      await updateValet({
        variables: {
          updateValetInput: {
            uid: valet.uid,
            ...data,
          },
        },
      })
      setIsEditModalOpen(false)
    } catch (error) {
      console.error('Failed to update valet:', error)
    }
  }

  // const handleCancel = () => {
  //   setNewDisplayName(valet.displayName)
  //   setNewPhoneNumber(valet.phoneNumber)
  //   setIsEditMode(false)
  // }

  return (
    <>
      <div className="w-64 space-y-2 flex-row justify-between">
        <div className="p-1 border-2 shadow-lg border-primary rounded-lg">
          <Image
            className="object-cover w-full aspect-square rounded"
            width={200}
            height={300}
            src={valet.image || '/valet.jpeg'}
            alt={`Valet ${valet.displayName}`}
          />
        </div>
        <div className="p-2">
          <div className="font-semibold">
            Tên nhân viên: {valet.displayName}
          </div>
          <div className="mb-1 text-lg text-gray-600">{valet.uid}</div>
          <div className="mb-1 text-lg text-gray-600">
            Bằng lái: {valet.licenceID}
          </div>
          <div className="mb-1 text-lg text-gray-600">
            Số điện thoại: {valet.phoneNumber}
          </div>
          <div className="text-lg text-gray-500">
            {format(new Date(valet.createdAt), 'PP')}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            {isEditModalOpen ? 'Hủy sửa' : ' Sửa thông tin'}
          </button>
          <button
            onClick={() => setSelectedValetId(isSelected ? null : valet.uid)}
            className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
          >
            {isSelected ? 'Ẩn chi tiết' : 'Xem chi tiết hoạt động'}
          </button>
        </div>
      </div>

      <Dialog
        open={isSelected}
        onClose={() => setSelectedValetId(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Thông tin chi tiết hoạt động của nhân viên {valet.displayName}
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Không có dữ liệu hoạt động
            </div>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Booking ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.bookingId}>
                      <TableCell>{booking.bookingId}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                        {new Date(booking.timestamp).toLocaleString('vi-VN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedValetId(null)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <EditValetModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        valet={valet}
        onSave={handleSave}
      />
    </>
  )
}
