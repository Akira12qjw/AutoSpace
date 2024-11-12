import {
  BookingsForCustomerQuery,
  BookingTimeline,
} from '@autospace/network/src/gql/generated'
import { StartEndDateCard } from './DateCard'
import { MapLink } from '../molecules/MapLink'
import { StaticMapSimple } from './map/StaticMapSimple'
import { TitleStrongValue, TitleValue } from '../atoms/TitleValue'
import { Reveal } from '../molecules/Reveal'
import { Accordion } from '../atoms/Accordion'
import { format } from 'date-fns'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableContainer,
} from '@mui/material'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import CallIcon from '@mui/icons-material/Call'

export interface IBookingCardProps {
  booking: NonNullable<BookingsForCustomerQuery['bookingsForCustomer']>[number]
}

export const CustomerBookingCard = ({ booking }: IBookingCardProps) => {
  const lat = booking.slot.garage.address?.lat || 0
  const lng = booking.slot.garage.address?.lng || 0
  const [bookings, setBookings] = useState<BookingTimeline[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const getValetInfo = () => {
    const { status, valetAssignment } = booking

    // If no valet assignment, return null
    if (!valetAssignment) return null

    // For check-in related statuses, show pickup valet
    if (
      status === 'BOOKED' ||
      status === 'CHECKED_IN' ||
      status === 'VALET_ASSIGNED_FOR_CHECK_IN' ||
      status === 'VALET_PICKED_UP'
    ) {
      return valetAssignment.pickupValet
    }

    // For check-out related status, show return valet
    if (
      status === 'CHECKED_OUT' ||
      status === 'VALET_ASSIGNED_FOR_CHECK_OUT' ||
      status === 'VALET_RETURNED'
    ) {
      return valetAssignment.returnValet
    }

    return null
  }
  const valetInfo = getValetInfo()

  return (
    <>
      {!valetInfo ? (
        <div className="shadow-lg bg-white p-2">
          <div className="flex flex-col gap-2">
            <StartEndDateCard
              startTime={booking.startTime}
              endTime={booking.endTime}
            />
            <MapLink waypoints={[{ lat, lng }]}>
              <StaticMapSimple
                position={{
                  lat,
                  lng,
                }}
                className="h-full w-full"
              />
            </MapLink>
          </div>
          <div className="grid grid-cols-2 w-full gap-2 mt-2  ">
            <TitleStrongValue title={'Slot'}>
              {booking.slot.displayName}
            </TitleStrongValue>
            <TitleStrongValue title={'Vehicle number'}>
              {booking.vehicleNumber}
            </TitleStrongValue>

            <TitleStrongValue title={'Address'}>
              <div>
                {booking.slot.garage.address?.address}
                <div className="text-gray text-xs">
                  {lat.toFixed(2)} {lng.toFixed(2)}
                </div>
              </div>
            </TitleStrongValue>
            <TitleStrongValue title={'Code'}>
              <Reveal secret={booking.passcode || ''} />
            </TitleStrongValue>
          </div>
          <Accordion
            defaultOpen={false}
            title={
              <TitleStrongValue title={'Status'}>
                <div className="font-bold">
                  {booking.status.split('_').join(' ')}
                </div>
              </TitleStrongValue>
            }
          >
            <div className="flex flex-col gap-2">
              {booking.bookingTimeline.map((timeline) => (
                <div key={timeline.timestamp}>
                  <TitleValue title={timeline.status}>
                    {format(new Date(timeline.timestamp), 'PPp')}
                  </TitleValue>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      ) : (
        <>
          <div className="shadow-lg bg-white p-2">
            <div className="flex flex-col gap-2">
              <StartEndDateCard
                startTime={booking.startTime}
                endTime={booking.endTime}
              />
              <MapLink waypoints={[{ lat, lng }]}>
                <StaticMapSimple
                  position={{
                    lat,
                    lng,
                  }}
                  className="h-full w-full"
                />
              </MapLink>
            </div>
            <div className="grid grid-cols-2 w-full gap-2 mt-2  ">
              <TitleStrongValue title={'Slot'}>
                {booking.slot.displayName}
              </TitleStrongValue>
              <TitleStrongValue title={'Vehicle number'}>
                {booking.vehicleNumber}
              </TitleStrongValue>

              <TitleStrongValue title={'Address'}>
                <div>
                  {booking.slot.garage.address?.address}
                  <div className="text-gray text-xs">
                    {lat.toFixed(2)} {lng.toFixed(2)}
                  </div>
                </div>
              </TitleStrongValue>
              <TitleStrongValue title={'Code'}>
                <Reveal secret={booking.passcode || ''} />
              </TitleStrongValue>
            </div>
            <Accordion
              defaultOpen={false}
              title={
                <TitleStrongValue title={'Status'}>
                  <div className="font-bold">
                    {booking.status.split('_').join(' ')}
                  </div>
                </TitleStrongValue>
              }
            >
              <div className="flex flex-col gap-2">
                {booking.bookingTimeline.map((timeline) => (
                  <div key={timeline.timestamp}>
                    <TitleValue title={timeline.status}>
                      {format(new Date(timeline.timestamp), 'PPp')}
                    </TitleValue>
                  </div>
                ))}
              </div>
            </Accordion>

            <Button
              className="bg-[#ffdd00] w-full  text-black"
              onClick={() => setIsOpen(true)}
            >
              {isOpen ? 'Ẩn chi tiết' : 'Xem chi tiết nhân viên'}
            </Button>
          </div>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="text-center">
              Thông tin của nhân viên
            </DialogTitle>
            <DialogContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <CircularProgress />
                </div>
              ) : error ? (
                <div className="text-red-500 p-4 text-center">{error}</div>
              ) : (
                <div className="flex flex-col items-center p-4">
                  <Image
                    className="object-cover rounded-full"
                    width={100}
                    height={100}
                    src={
                      booking.valetAssignment?.pickupValet?.image ||
                      '/valet.jpeg'
                    }
                    alt={`Valet ${booking.valetAssignment?.pickupValet?.displayName}`}
                  />
                  <div className="mt-4 text-center">
                    <div className="mb-2">
                      Tên nhân viên: {valetInfo.displayName}
                    </div>
                    <div className="mb-2">Trạng thái: {booking.status}</div>
                    <div className="mb-2">
                      Số điện thoại: {valetInfo.phoneNumber}
                    </div>
                  </div>

                  <a
                    href={`tel:${valetInfo.phoneNumber}`}
                    className="bg-[#ffdd00] text-black p-4 rounded-md w-full text-center hover:bg-[#efd426]"
                  >
                    <CallIcon /> Liên hệ
                  </a>
                </div>
              )}
            </DialogContent>
            <DialogActions className="justify-center">
              <Button onClick={() => setIsOpen(false)} color="primary">
                Đóng
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  )
}
