import Mapbox from '@rnmapbox/maps'

type MarkerProps = {
  latitude: number
  longitude: number
  children?: React.ReactNode
}

export const Marker = ({ latitude, longitude, children }: MarkerProps) => {
  return (
    <Mapbox.PointAnnotation
      id={`marker-${latitude}-${longitude}`}
      coordinate={[longitude, latitude]}
    >
      {children}
    </Mapbox.PointAnnotation>
  )
}
