import { useEffect } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'

import { MenuItem } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

type TcakeData = {
  id: number
  cake: string
  price: number
  description: string
}

export default function CakeDrawer({
  open,
  onClose,
  onSubmit,
  defaultValues,
  cakesData
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  defaultValues?: any
  cakesData?: TcakeData[]
}) {
  const cakes = Array.isArray(cakesData) ? cakesData : []

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isLoading, isSubmitting }
  } = useForm({
    defaultValues: defaultValues || {
      name: '',
      cake_weight: 1,
      writing_on_cake: '',
      cake_per_kg: 0,
      cake_amount: 0
    }
  })

  // Update per_kg_price and total_amount when cake_name or cake_weight changes
  const cakeId = watch('name')
  const cakeWeight = watch('cake_weight')

  useEffect(() => {
    if (!Array.isArray(cakes)) {
      setValue('cake_per_kg', 0)
      setValue('cake_amount', 0)

      return
    }

    const selectedCake = cakes.find(c => c.id === cakeId)

    if (selectedCake) {
      const price = Number(selectedCake.price) || 0
      const weight = Number(cakeWeight) || 1

      setValue('cake_per_kg', price)
      setValue('cake_amount', price * weight)
    } else {
      setValue('cake_per_kg', 0)
      setValue('cake_amount', 0)
    }
  }, [cakeId, cakeWeight, cakes, setValue])

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
          <Typography variant='h6'>{defaultValues ? 'Edit Cake' : 'Add Cake'}</Typography>
          <IconButton onClick={onClose}>
            <i className='tabler-x' />
          </IconButton>
        </div>
        <div className='flex flex-col gap-4'>
          <Controller
            name='name'
            control={control}
            rules={{ required: 'Cake name required' }}
            render={({ field }) => (
              <CustomTextField
                select
                label='Cake Name'
                {...field}
                error={!!errors.name}
                helperText={errors.name?.message as string}
              >
                <MenuItem value=''>-- Select Cake --</MenuItem>

                {cakes.map(cake => (
                  <MenuItem key={cake.id} value={cake.id}>
                    <div className='flex flex-col'>
                      <span className='font-medium'>{cake.cake}</span>
                      <span className='text-sm text-gray-500'>
                        ₹{cake.price}/kg • {cake.description}
                      </span>
                    </div>
                  </MenuItem>
                ))}
              </CustomTextField>
            )}
          />

          <Controller
            name='cake_weight'
            control={control}
            rules={{ required: 'Weight required', min: 0.5 }}
            render={({ field }) => (
              <CustomTextField
                label='Weight (kg)'
                type='number'
                {...field}
                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!errors.cake_weight}
                helperText={typeof errors.cake_weight?.message === 'string' ? errors.cake_weight?.message : undefined}
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
            name='writing_on_cake'
            control={control}
            render={({ field }) => <CustomTextField label='Writing on Cake' {...field} />}
          />
          <Controller
            name='cake_per_kg'
            control={control}
            render={({ field }) => <CustomTextField label='Per Kg Price' {...field} InputProps={{ readOnly: true }} />}
          />
          <Controller
            name='cake_amount'
            control={control}
            render={({ field }) => <CustomTextField label='Total Amount' {...field} InputProps={{ readOnly: true }} />}
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
            <Button variant='tonal' color='secondary' onClick={handleReset}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
