// import { LocationInfo, ViewState } from '@autospace/util/types'
// import { useMap } from 'react-map-gl'
// import { Autocomplete } from '../../atoms/Autocomplete'
// import { useSearchLocation } from '@autospace/util/hooks/location'
// import { majorCitiesLocationInfo } from '@autospace/util/constants'

// export const SearchPlaceBox = ({
//   onLocationChange,
// }: {
//   onLocationChange?: (location: ViewState) => void
// }) => {
//   const { current: map } = useMap()
//   const { loading, locationInfo, searchText, setLoading, setSearchText } =
//     useSearchLocation()

//   return (
//     <Autocomplete<LocationInfo>
//       options={locationInfo?.length ? locationInfo : majorCitiesLocationInfo}
//       isOptionEqualToValue={(option, value) =>
//         option.placeName === value.placeName
//       }
//       noOptionsText={searchText ? 'No options.' : 'Type something...'}
//       getOptionLabel={(x) => x.placeName}
//       onInputChange={(_, v) => {
//         setLoading(true)
//         setSearchText(v)
//       }}
//       loading={loading}
//       onChange={async (_, v) => {
//         if (v) {
//           const { latLng, placeName } = v
//           await map?.flyTo({
//             center: { lat: latLng[0], lng: latLng[1] },
//             zoom: 12,
//             // essential: true,
//           })
//           if (onLocationChange) {
//             onLocationChange({ latitude: latLng[0], longitude: latLng[1] })
//           }
//         }
//       }}
//     />
//   )
// }
import { LocationInfo, ViewState } from '@autospace/util/types'
import { useMap } from 'react-map-gl'
import { Autocomplete } from '../../atoms/Autocomplete'
import { useSearchLocation } from '@autospace/util/hooks/location'
import { majorCitiesLocationInfo } from '@autospace/util/constants'

export const SearchPlaceBox = ({
  onLocationChange,
}: {
  onLocationChange?: (location: ViewState) => void
}) => {
  const { current: map } = useMap()
  const { loading, locationInfo, searchText, setLoading, setSearchText } =
    useSearchLocation()

  // Kết hợp danh sách thành phố chính với kết quả tìm kiếm khi có
  const options = searchText ? locationInfo : majorCitiesLocationInfo

  return (
    <Autocomplete<LocationInfo>
      options={options}
      isOptionEqualToValue={(option, value) =>
        option.placeName === value.placeName
      }
      noOptionsText={
        searchText ? 'Không tìm thấy địa điểm' : 'Nhập để tìm kiếm địa điểm...'
      }
      getOptionLabel={(x) => x.placeName}
      onInputChange={(_, newValue) => {
        setLoading(true)
        setSearchText(newValue)
      }}
      loading={loading}
      onChange={async (_, selectedValue) => {
        if (selectedValue) {
          const { latLng, placeName } = selectedValue
          await map?.flyTo({
            center: { lat: latLng[0], lng: latLng[1] },
            zoom: 12,
          })
          if (onLocationChange) {
            onLocationChange({ latitude: latLng[0], longitude: latLng[1] })
          }
        }
      }}
      renderOption={(props, option) => (
        <li {...props} className="px-3 py-2 hover:bg-gray-100">
          {option.placeName}
        </li>
      )}
      filterOptions={(options) => options}
    />
  )
}
