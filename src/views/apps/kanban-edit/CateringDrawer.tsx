import { useEffect } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'

export default function CateringDrawer({
  open,
  onClose,
  onSubmit,
  defaultValues
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  defaultValues?: any
}) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isLoading, isSubmitting }
  } = useForm({
    defaultValues: defaultValues || {
      menu: '',
      no_of_plates: 0,
      food_cost_per_plate: 100,
      food_amount: 0
    }
  })

  const numberOfPlate = watch('no_of_plates')
  const foodCostPlate = watch('food_cost_per_plate')

  useEffect(() => {
    if (numberOfPlate) {
      setValue('food_amount', numberOfPlate * foodCostPlate)
    }
  }, [numberOfPlate, foodCostPlate, setValue])

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  const handleReset = () => {
    onClose()
  }

  return (
    <Drawer open={open} anchor='right' onClose={onClose}>
      <div className='p-6 w-[350px]'>
        <div className='flex justify-between items-center mb-4'>
          <Typography variant='h6'>Catering Food</Typography>
          <IconButton onClick={onClose}>
            <i className='tabler-x' />
          </IconButton>
        </div>
        <div className='flex flex-col gap-4'>
          <Controller
            name='menu'
            control={control}
            rules={{ required: 'Cake name required' }}
            render={({ field }) => (
              <CustomTextField
                label='Menu'
                type='text'
                {...field}
                error={!!errors.menu}
                helperText={typeof errors.menu?.message === 'string' ? errors.menu?.message : undefined}
              />
            )}
          />
          <Controller
            name='no_of_plates'
            control={control}
            rules={{ required: 'Number of plates required', min: 1 }}
            render={({ field }) => (
              <CustomTextField
                label='No of Plates'
                type='number'
                {...field}
                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!errors.no_of_plates}
                helperText={typeof errors.no_of_plates?.message === 'string' ? errors.no_of_plates?.message : undefined}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                  className: 'no-spinner' // custom class to remove spinners
                }}
              />
            )}
          />

          <Controller
            name='food_cost_per_plate'
            control={control}
            render={({ field }) => <CustomTextField label='Food Cost Per Plate' {...field} />}
          />
          <Controller
            name='food_amount'
            control={control}
            render={({ field }) => <CustomTextField label='Total Amount' {...field} />}
          />
          <div className='flex gap-4'>
            <Button
              variant='contained'
              color='primary'
              disabled={isSubmitting || isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
            <Button variant='tonal' color='secondary' type='reset' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
