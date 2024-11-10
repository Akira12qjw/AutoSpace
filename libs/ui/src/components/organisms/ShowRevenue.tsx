'use client'

import { FaEllipsisV, FaRegCalendarMinus } from 'react-icons/fa'
import { ImSpinner11 } from 'react-icons/im'
import { format } from 'date-fns'
import { useQuery } from '@apollo/client'
import Card from '@mui/material/Card'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useState } from 'react'
import {
  BookingsForGarageDocument,
  QueryMode,
} from '@autospace/network/src/gql/generated'
import { useTakeSkip } from '@autospace/util/hooks/pagination'
import { log } from 'console'
import { PiChartLineDownBold, PiChartLineUpBold } from 'react-icons/pi'
export default function ShowRevenue({ garageId }: { garageId: number }) {
  const [searchTerm, setSearchTerm] = useState('')
  const { take, setTake, skip, setSkip } = useTakeSkip()

  const { data, loading, error, refetch } = useQuery(
    BookingsForGarageDocument,
    {
      variables: {
        skip,
        take,
        where: {
          Slot: {
            is: {
              garageId: { equals: garageId },
            },
          },
          ...(searchTerm && {
            vehicleNumber: {
              contains: searchTerm,
              mode: QueryMode.Insensitive,
            },
          }),
        },
      },
    },
  )

  console.log(data)

  // Thêm state để quản lý trạng thái loading của nút refresh
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Hàm xử lý refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }
  const [earningsData, setEarningsData] = useState({
    total: '0',
    yearly: '0',
    monthly: '0',
    daily: '0',
  })
  const [percent, setPercent] = useState<{
    yearly: string | React.ReactNode
    monthly: string | React.ReactNode
    daily: string | React.ReactNode
  }>({
    yearly: '',
    monthly: '',
    daily: '',
  })

  useEffect(() => {
    if (
      data?.bookingsCount?.count &&
      data?.bookingsCount.count > 0 &&
      data?.bookingsForGarage
    ) {
      let total = 0
      let yearly = 0
      let monthly = 0
      let daily = 0
      // Tạo các biến để lưu trữ giá trị của năm, tháng, ngày trước
      let prevYearlyTotal = 0
      let prevMonthlyTotal = 0
      let prevDailyTotal = 0

      // Lọc các đơn hàng của năm, tháng, ngày trước
      const prevYearOrders = data.bookingsForGarage.filter(
        (item) =>
          new Date(item.startTime).getFullYear() ===
          new Date().getFullYear() - 1,
      )
      const prevMonthOrders = data.bookingsForGarage.filter(
        (item) =>
          new Date(item.startTime).getMonth() === new Date().getMonth() - 1 &&
          new Date(item.startTime).getFullYear() === new Date().getFullYear(),
      )
      const prevDayOrders = data.bookingsForGarage.filter(
        (item) =>
          new Date(item.startTime).getDate() === new Date().getDate() - 1 &&
          new Date(item.startTime).getMonth() === new Date().getMonth() &&
          new Date(item.startTime).getFullYear() === new Date().getFullYear(),
      )

      // Tính tổng doanh thu của năm, tháng, ngày trước
      prevYearlyTotal = prevYearOrders.reduce(
        (acc, item) => acc + Number(item.totalPrice),
        0,
      )
      prevMonthlyTotal = prevMonthOrders.reduce(
        (acc, item) => acc + Number(item.totalPrice),
        0,
      )
      prevDailyTotal = prevDayOrders.reduce(
        (acc, item) => acc + Number(item.totalPrice),
        0,
      )
      // console.log(prevYearlyTotal, prevMonthlyTotal, prevDailyTotal);

      data.bookingsForGarage.forEach((item) => {
        total += Number(item.totalPrice)

        // Tính toán theo năm
        const orderDate = new Date(item.startTime)
        const currentYear = orderDate.getFullYear()
        yearly +=
          currentYear === new Date().getFullYear() ? Number(item.totalPrice) : 0

        // Tính toán theo tháng
        const currentMonth = orderDate.getMonth() + 1
        monthly +=
          currentMonth === new Date().getMonth() + 1
            ? Number(item.totalPrice)
            : 0

        // Tính toán theo ngày
        const currentDay = orderDate.getDate()
        daily +=
          currentDay === new Date().getDate() ? Number(item.totalPrice) : 0
      })
      //
      const yearlyPercentChange = calculatePercentChange(
        yearly,
        prevYearlyTotal,
      )
      const monthlyPercentChange = calculatePercentChange(
        monthly,
        prevMonthlyTotal,
      )
      const dailyPercentChange = calculatePercentChange(daily, prevDailyTotal)

      setPercent({
        yearly: yearlyPercentChange,
        monthly: monthlyPercentChange,
        daily: dailyPercentChange,
      })
      setEarningsData({
        total: total.toLocaleString(),
        yearly: yearly.toLocaleString(),
        monthly: monthly.toLocaleString(),
        daily: daily.toLocaleString(),
      })
    }
  }, [data]) // console.log(order);
  const calculatePercentChange = (currentValue: number, prevValue: number) => {
    if (prevValue === 0) {
      return currentValue === 0 ? (
        '0%'
      ) : (
        <span className="text-green-500 font-bold flex items-center gap-3">
          100% <PiChartLineUpBold />
        </span>
      )
    }
    const percentChange = Number(((currentValue - prevValue) / prevValue) * 100)
    const formattedPercentChange = `${Math.floor(percentChange)}%`
    return percentChange >= 0 ? (
      <span className="text-green-500 flex items-center gap-3">
        {`+${formattedPercentChange}`} <PiChartLineUpBold />
      </span>
    ) : (
      <span className="text-red-500 flex items-center gap-3">
        {`${formattedPercentChange}`} <PiChartLineDownBold />
      </span>
    )
  }

  const [displayMode, setDisplayMode] = useState('monthly')
  const generateData = () => {
    if (displayMode === 'monthly') {
      return generateMonthlyData()
    } else {
      return generateWeeklyData()
    }
  }

  const generateMonthlyData = () => {
    if (!data?.bookingsForGarage) return []

    const bookings = data?.bookingsForGarage

    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const monthIndex = index + 1

      const monthlyBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime)
        return bookingDate.getMonth() + 1 === monthIndex
      })

      const totalPrice = monthlyBookings.reduce(
        (acc, booking) => acc + (booking.totalPrice || 0),
        0,
      )

      return {
        name: `Tháng ${monthIndex}`,
        totalPrice: totalPrice,
      }
    })

    return monthlyData
  }
  const generateWeeklyData = () => {
    if (!data?.bookingsForGarage) return []

    const bookings = data.bookingsForGarage

    const weekdays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]

    return weekdays.map((weekday, index) => {
      const dayIndex = index === 6 ? 0 : index + 1

      const dailyBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.startTime)
        return bookingDate.getDay() === dayIndex
      })

      const totalPrice = dailyBookings.reduce(
        (acc, booking) => acc + (booking.totalPrice || 0),
        0,
      )

      return {
        name: weekday,
        totalPrice: totalPrice,
      }
    })
  }
  return (
    <div>
      <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
            Dashboard
          </h1>
          <div className="flex gap-2">
            <button
              className="group hidden w-fit xl:flex items-center gap-2 font-heading font-semibold
                  text-header text-sm"
              onClick={() => handleRefresh()}
            >
              Data Refresh
              <ImSpinner11 />
            </button>
            <div
              className="h-11 bg-[#f9f9f9] flex items-center justify-center rounded-md px-9 font-heading font-bold
              text-header text-sm border-solid border-[1px] lg:w-[310px]"
            >
              {format(new Date(), 'MMMM d, yyyy hh:mm:ss')}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]">
          <Card
            className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
            loading={loading}
          >
            <div>
              <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
                EARNINGS (ANNUAL)
              </h2>
              <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
                {earningsData.yearly} đ
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <FaRegCalendarMinus fontSize={28} />{' '}
              <span className="text-xl">{percent.yearly}</span>
            </div>
          </Card>
          <Card
            className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
            loading={loading}
          >
            <div>
              <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">
                EARNINGS (MONTHLY)
              </h2>
              <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
                {earningsData.monthly} đ
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <FaRegCalendarMinus fontSize={28} />{' '}
              <span className="text-xl">{percent.monthly}</span>
            </div>
          </Card>
          <Card
            className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
            loading={loading}
          >
            <div>
              <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
                EARNINGS (DAILY)
              </h2>
              <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
                {earningsData.daily} đ
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <FaRegCalendarMinus fontSize={28} />{' '}
              <span className="text-xl">{percent.daily}</span>
            </div>
          </Card>
          <Card
            className=" h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out"
            loading={loading}
          >
            <div>
              <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
                TOTAL
              </h2>
              <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
                {earningsData.total} đ
              </h1>
            </div>
            <FaRegCalendarMinus fontSize={28} />
          </Card>
        </div>
        <div className=" mt-[22px]">
          <div className=" border bg-white shadow-md cursor-pointer rounded-[4px]">
            <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]">
              <h2 className="text-[#4e73df] text-[16px] leading-[19px] font-bold">
                Earnings Overview
              </h2>
              <FaEllipsisV color="gray" className="cursor-pointer" />
            </div>
            <div className="p-[20px]">
              <label className="mr-2">
                <input
                  type="radio"
                  name="displayMode"
                  value="monthly"
                  checked={displayMode === 'monthly'}
                  onChange={() => setDisplayMode('monthly')}
                />
                Monthly
              </label>
              <label>
                <input
                  type="radio"
                  name="displayMode"
                  value="weekly"
                  checked={displayMode === 'weekly'}
                  onChange={() => setDisplayMode('weekly')}
                />
                Weekly
              </label>
            </div>
            <div className="w-full">
              {/* <canvas id="myAreaChart"></canvas> */}
              {/* <Line options={options} data={data} /> */}
              <LineChart
                width={1300}
                height={500}
                data={generateData()}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  name="Total Price"
                  dataKey="totalPrice"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </div>
          </div>
        </div>
        <div className="border bg-white shadow-md cursor-pointer rounded-[4px] py-5">
          <div className="bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED]">
            <h2 className="text-[#4e73df] text-[16px] leading-[19px] font-bold">
              Revenue Resources
            </h2>
            <FaEllipsisV color="gray" className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}
