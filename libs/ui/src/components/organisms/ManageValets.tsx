import { SearchGaragesQuery } from '@autospace/network/src/gql/generated'
import { useState } from 'react'
import { toast } from '../molecules/Toast'
import { useFormContext, useWatch } from 'react-hook-form'
import { FormTypeBookSlot } from '@autospace/forms/src/bookSlot'
import { Switch } from '../atoms/Switch'
import { dividerClasses } from '@mui/material'
import { Marker } from './map/MapMarker'
import { Map } from './map/Map'
import { ParkingIcon } from '../atoms/ParkingIcon'
import { IconUser } from '@tabler/icons-react'
import { Directions } from './Directions'
import { Panel } from './map/Panel'
import { DefaultZoomControls } from './map/ZoomControls'

export const ManageValets = ({
  garage,
}: {
  garage: SearchGaragesQuery['searchGarages'][number]
}) => {
  const [showValet, setShowValet] = useState(false)

  const { setValue } = useFormContext<FormTypeBookSlot>()
  const { valet } = useWatch<FormTypeBookSlot>()

  const lat = garage.address?.lat
  const lng = garage.address?.lng
  if (!lat || !lng) {
    toast('Vị trí gara chưa được thiết lập.')
    return <div>Có gì đó sai.</div>
  }

  return (
    <div className="p-2 space-y-3 bg-gray-25">
      <div className="text-xl font-bold">Valet</div>
      <p className="text-sm text-gray">
        Nhân viên phục vụ của chúng tôi sẽ đưa xe của bạn đến nơi đã đặt trước
        và mang xe trở lại khi bạn đã sẵn sàng. Giống như phép thuật, nhưng với
        xe hơi!
      </p>

      <Switch
        checked={showValet}
        onChange={(e) => {
          setShowValet(e)

          if (!e) {
            setValue('valet', undefined, {
              shouldValidate: true,
            })
            setValue('valet.differentLocations', false)
          } else {
            setValue('valet.pickupInfo', {
              lat,
              lng,
            })
            setValue('valet.dropoffInfo', {
              lat,
              lng,
            })
          }
        }}
        label={'Need valet?'}
      />

      {showValet ? (
        <div>
          <div className="mb-6 space-y-3">
            <p className="text-sm text-gray">
              Bạn muốn xe của mình được giao đến nơi khác? Không vấn đề gì! Hãy
              chọn một điểm trả xe khác và chúng tôi sẽ đảm bảo xe của bạn đang
              ở đó.
            </p>
            <Switch
              checked={valet?.differentLocations || false}
              onChange={(e) => {
                setValue('valet.differentLocations', e)
                if (!e) {
                  setValue('valet.dropoffInfo', {
                    lat: valet?.pickupInfo?.lat || lat,
                    lng: valet?.pickupInfo?.lng || lat,
                  })
                } else {
                  setValue('valet.dropoffInfo', {
                    lat,
                    lng,
                  })
                }
              }}
              label={'Chọn điểm trả xe ở nơi khác?'}
            />
          </div>
          <Map
            initialViewState={{
              latitude: lat,
              longitude: lng,
              zoom: 13,
            }}
            height="50vh"
          >
            <Panel position="right-center">
              <DefaultZoomControls />
            </Panel>
            <Marker latitude={lat} longitude={lng}>
              <ParkingIcon />
            </Marker>
            {valet?.pickupInfo?.lng && valet?.pickupInfo?.lat ? (
              <>
                <Marker
                  pitchAlignment="auto"
                  longitude={valet?.pickupInfo?.lng}
                  latitude={valet?.pickupInfo?.lat}
                  draggable
                  onDragEnd={({ lngLat }) => {
                    const { lat, lng } = lngLat
                    setValue('valet.pickupInfo.lat', lat || 0)
                    setValue('valet.pickupInfo.lng', lng || 0)
                    if (!valet.differentLocations) {
                      setValue('valet.dropoffInfo.lat', lat || 0)
                      setValue('valet.dropoffInfo.lng', lng || 0)
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <IconUser />
                    <span>
                      Pickup {!valet.differentLocations ? '& drop off' : null}
                    </span>
                  </div>
                </Marker>
                <Directions
                  sourceId={'pickup_route'}
                  origin={{ lat, lng }}
                  destination={{
                    lat: valet.pickupInfo.lat,
                    lng: valet.pickupInfo.lng,
                  }}
                  setDistance={(distance) => {
                    setValue('valet.pickupInfo.distance', distance)
                  }}
                />
              </>
            ) : null}

            {valet?.differentLocations &&
            valet?.dropoffInfo?.lng &&
            valet?.dropoffInfo?.lat ? (
              <>
                <Marker
                  pitchAlignment="auto"
                  longitude={valet.dropoffInfo.lng}
                  latitude={valet.dropoffInfo.lat}
                  draggable
                  onDragEnd={({ lngLat }) => {
                    const { lat, lng } = lngLat
                    setValue('valet.dropoffInfo.lat', lat || 0)
                    setValue('valet.dropoffInfo.lng', lng || 0)
                  }}
                >
                  <div className="flex flex-col items-center">
                    <IconUser />
                    <span>Drop off</span>
                  </div>
                </Marker>
                <Directions
                  sourceId={'dropoff_route'}
                  origin={{ lat, lng }}
                  destination={{
                    lat: valet.dropoffInfo.lat,
                    lng: valet.dropoffInfo.lng,
                  }}
                  setDistance={(distance) => {
                    setValue('valet.dropoffInfo.distance', distance)
                  }}
                />
              </>
            ) : null}
          </Map>
        </div>
      ) : null}
    </div>
  )
}
