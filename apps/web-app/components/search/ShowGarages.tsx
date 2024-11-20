import React from 'react'
import { View, Text } from 'react-native'
import { useLazyQuery } from '@apollo/client'
import { useConvertSearchFormToVariables } from '@autospace/forms/src/adapters/searchFormAdapter'
import { SearchGaragesDocument } from '@/gql/generated'
import { Panel } from '../map/Panel'
import { Loader } from '../Loader'
import { GarageMarker } from './GarageMarker'
import { IconInfoCircle } from '@tabler/icons-react'
// import { IconInfoCircle } from '@tabler/icons-react-native'; // Note: changed import

export const ShowGarages = () => {
  const [
    searchGarages,
    { loading: garagesLoading, data, previousData, error },
  ] = useLazyQuery(SearchGaragesDocument)

  const garages = data?.searchGarages || previousData?.searchGarages || []
  const loading = garagesLoading

  if (error) {
    return (
      // <Panel
      //   position="center-center"
      //   style={{
      //     backgroundColor: 'rgba(255,255,255,0.5)',
      //     shadowColor: '#000',
      //     shadowOffset: { width: 0, height: 2 },
      //     shadowOpacity: 0.1,
      //     shadowRadius: 2,
      //     elevation: 3,
      //     borderWidth: 1,
      //     borderColor: 'white',
      //   }}
      // >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <IconInfoCircle />
        <Text>{error.message}</Text>
      </View>
      // </Panel>
    )
  }

  if (!loading && garages.length === 0) {
    return (
      // <Panel
      //   position="center-center"
      //   style={{
      //     backgroundColor: 'rgba(255,255,255,0.5)',
      //     shadowColor: '#000',
      //     shadowOffset: { width: 0, height: 2 },
      //     shadowOpacity: 0.1,
      //     shadowRadius: 2,
      //     elevation: 3,
      //     borderWidth: 1,
      //     borderColor: 'white',
      //   }}
      // >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {/* <IconInfoCircle /> */}
        <Text>No parking slots found in this area.</Text>
      </View>
      // </Panel>
    )
  }

  return (
    <>
      {loading && (
        <Panel position="center-bottom">
          <Loader />
        </Panel>
      )}
      {garages.map((garage) => (
        <GarageMarker key={garage.id} marker={garage} />
      ))}
    </>
  )
}
