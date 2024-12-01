import { IsLoggedIn } from '@autospace/ui/src/components/organisms/IsLoggedIn'
import { ShowProfile } from '@autospace/ui/src/components/organisms/ShowProfile'

import React from 'react'

export default function Page() {
  return (
    <IsLoggedIn>
      <ShowProfile />
    </IsLoggedIn>
  )
}
