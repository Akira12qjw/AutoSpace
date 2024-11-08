import { useFormCreateManySlots } from '@autospace/forms/src/createSlots'
import { useMutation } from '@apollo/client'
import {
  CreateManySlotsDocument,
  SlotType,
  namedOperations,
} from '@autospace/network/src/gql/generated'
import { useState } from 'react'
import { Button } from '../atoms/Button'
import { Dialog } from '../atoms/Dialog'
import { HtmlLabel } from '../atoms/HtmlLabel'
import { HtmlSelect } from '../atoms/HtmlSelect'
import { HtmlInput } from '../atoms/HtmlInput'
import { Form } from '../atoms/Form'
import { toast } from '../molecules/Toast'
import { useTranslation } from 'react-i18next'
export const CreateManySlotsDialog = ({ garageId }: { garageId: number }) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation(['garage'])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormCreateManySlots()

  const [createManySlots, { loading, data, error }] = useMutation(
    CreateManySlotsDocument,
    {
      awaitRefetchQueries: true,
      refetchQueries: [namedOperations.Query.Garages],
      onCompleted(data, clientOptions) {
        setOpen(false)
        toast('Slots created successfully.')
      },
      onError(error, clientOptions) {
        toast('Action failed.')
      },
    },
  )

  return (
    <>
      <Button
        variant="text"
        size="none"
        onClick={() => setOpen(true)}
        className="w-16 h-10 border-2 group border-primary"
      >
        <div className="transition-transform duration-300 group-hover:scale-150">
          +
        </div>
      </Button>
      <Dialog open={open} setOpen={setOpen} title={t('createSlot')}>
        <Form
          onSubmit={handleSubmit(async ({ count, ...data }) => {
            await createManySlots({
              variables: { count, createSlotInput: { ...data, garageId } },
            })
          })}
        >
          <div className="grid grid-cols-2 gap-2">
            <HtmlLabel title={t('VehicleType')} error={errors.type?.toString()}>
              <HtmlSelect placeholder="Slot type" {...register(`type`)}>
                {Object.values(SlotType).map((type) => (
                  <option key={type} value={type}>
                    {t(`${type}`)}
                  </option>
                ))}
              </HtmlSelect>
            </HtmlLabel>
            <HtmlLabel
              title={t('Price/Hr')}
              error={errors.pricePerHour?.message}
            >
              <HtmlInput
                type="number"
                placeholder="Giá thuê mỗi giờ"
                {...register(`pricePerHour`, {
                  valueAsNumber: true,
                })}
              />
            </HtmlLabel>
            <HtmlLabel title={t('NumberSlot')} error={errors.count?.message}>
              <HtmlInput
                type="number"
                placeholder="Số lượng chỗ"
                {...register(`count`, {
                  valueAsNumber: true,
                })}
              />
            </HtmlLabel>
            <HtmlLabel title={t('Length')} error={errors.length?.message}>
              <HtmlInput
                type="number"
                placeholder="Chiều dài"
                {...register('length', {
                  valueAsNumber: true,
                })}
              />
            </HtmlLabel>
            <HtmlLabel title={t('Width')} error={errors.width?.message}>
              <HtmlInput
                type="number"
                placeholder="Chiều rộng"
                {...register(`width`, {
                  valueAsNumber: true,
                })}
              />
            </HtmlLabel>
            <HtmlLabel title={t('Height')} error={errors.height?.message}>
              <HtmlInput
                type="number"
                placeholder="Chiều cao"
                {...register(`height`, {
                  valueAsNumber: true,
                })}
              />
            </HtmlLabel>
            <Button type="submit" loading={loading}>
              {t('Submit')}
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  )
}
