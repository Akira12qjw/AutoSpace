// ListValets.tsx
'use client'
import { useQuery } from '@apollo/client'
import { CompanyValetsDocument } from '@autospace/network/src/gql/generated'
import { useTakeSkip } from '@autospace/util/hooks/pagination'
import { useState } from 'react'
import { ShowData } from './ShowData'
import { ValetCard } from './ValetCard'

export const ListValets = () => {
  const { take, skip, setSkip, setTake } = useTakeSkip()
  const { data, loading } = useQuery(CompanyValetsDocument)
  const [selectedValetId, setSelectedValetId] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap gap-4 mt-2">
      <ShowData
        loading={loading}
        pagination={{
          resultCount: data?.companyValets.length,
          totalCount: data?.companyValetsTotal,
          take,
          skip,
          setSkip,
          setTake,
        }}
      >
        {data?.companyValets.map((valet) => (
          <ValetCard
            key={valet.uid}
            valet={valet}
            selectedValetId={selectedValetId}
            setSelectedValetId={setSelectedValetId}
          />
        ))}
      </ShowData>
    </div>
  )
}
