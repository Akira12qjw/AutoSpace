'use client'
import { useState } from 'react'
import { Tab, TabPanel, Tabs } from '../molecules/Tabs'
import { ShowGarageBookings } from '../organisms/ShowGarageBookings'
import { BookingStatus } from '@autospace/network/src/gql/generated'
import ShowRevenue from '../organisms/ShowRevenue'

export interface IListBookingsProps {
  garageId: number
}
export const ListGarageBookings = ({ garageId }: IListBookingsProps) => {
  const [value, setValue] = useState<0 | 1 | 2 | 3>(0) // Cập nhật thêm giá trị cho tab mới

  return (
    <div>
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        aria-label="bookings"
      >
        <Tab label={'IN'} />
        <Tab label={'OUT'} />
        <Tab label={'RESOLVED'} />
        <Tab label={'REVENUE'} /> {/* Tab mới cho doanh thu */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <ShowGarageBookings
          garageId={garageId}
          statuses={[
            BookingStatus.Booked,
            BookingStatus.ValetPickedUp,
            BookingStatus.ValetAssignedForCheckIn,
          ]}
          showCheckIn
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ShowGarageBookings
          garageId={garageId}
          statuses={[
            BookingStatus.CheckedIn,
            BookingStatus.ValetAssignedForCheckOut,
          ]}
          showCheckOut
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ShowGarageBookings
          garageId={garageId}
          statuses={[BookingStatus.CheckedOut]}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        {' '}
        {/* TabPanel mới cho doanh thu */}
        <ShowRevenue garageId={garageId} />
      </TabPanel>
    </div>
  )
}
