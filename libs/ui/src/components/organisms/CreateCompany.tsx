'use client'
import { useFormCreateCompany } from '@autospace/forms/src/createCompany'
import { Button } from '../atoms/Button'
import { Dialog } from '../atoms/Dialog'
import { useEffect, useState } from 'react'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlInput } from '../atoms/HtmlInput'
import { Form } from '../atoms/Form'
import { HtmlTextArea } from '../atoms/HtmlTextArea'
import { useSession } from 'next-auth/react'
import { useMutation } from '@apollo/client'
import {
  CreateCompanyDocument,
  namedOperations,
} from '@autospace/network/src/gql/generated'

export const CreateCompany = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useFormCreateCompany()

  const session = useSession()
  const uid = session.data?.user?.uid
  const managerName = session.data?.user?.name

  const [createCompany, { loading, data }] = useMutation(CreateCompanyDocument)

  useEffect(() => {
    if (uid) {
      setValue('managerId', uid)
    }
    setValue('managerName', managerName)
  }, [uid])

  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Đăng kí công ty</Button>
      <Dialog open={open} setOpen={setOpen} title="Đăng kí công ty">
        <Form
          onSubmit={handleSubmit(async (data) => {
            await createCompany({
              variables: {
                createCompanyInput: data,
              },
              awaitRefetchQueries: true,
              refetchQueries: [namedOperations.Query.myCompany],
            })
          })}
        >
          <HtmlLabel title="Tên công ty" error={errors.displayName?.message}>
            <HtmlInput
              placeholder="Công ty của bạn"
              {...register('displayName')}
            />
          </HtmlLabel>
          <HtmlLabel title="Mô tả công ty" error={errors.displayName?.message}>
            <HtmlTextArea
              placeholder="Mô tả công ty"
              {...register('description')}
            />
          </HtmlLabel>
          <HtmlLabel title="Manager ID" error={errors.managerId?.message}>
            <HtmlInput
              placeholder="Manager ID"
              {...register('managerId')}
              readOnly
            />
          </HtmlLabel>
          <HtmlLabel title="Tên quản lý" error={errors.managerName?.message}>
            <HtmlInput placeholder="Tên quản lý" {...register('managerName')} />
          </HtmlLabel>
          <Button loading={loading} type="submit">
            Đăng kí
          </Button>
        </Form>
      </Dialog>
    </div>
  )
}
