import { useEffect } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'

import { MenuItem } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

export default function CateringDrawer({
  open,
  onClose,
  onSubmit,
  defaultValues,
  foodsData
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  defaultValues?: any
  foodsData?: any[]
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
      food_cost_per_plate: 0,
      food_amount: 0
    }
  })

  const numberOfPlate = watch('no_of_plates')
  const foodCostPlate = watch('food_cost_per_plate')

  const foods = Array.isArray(foodsData) ? foodsData : []

  useEffect(() => {
    const plates = Number(numberOfPlate) || 0
    const cost = Number(foodCostPlate) || 0

    if (plates || cost) {
      setValue('food_amount', plates * cost)
    } else {
      setValue('food_amount', 0)
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
            rules={{ required: !!(foods.length > 0) ? 'Menu required' : false }}
            render={({ field }) =>
              foods.length > 0 ? (
                <CustomTextField
                  select
                  label='Menu'
                  {...field}
                  value={field.value || ''}
                  onChange={e => {
                    field.onChange(e)

                    const selected = foods.find((f: any) => {
                      const name = f.description ?? f.product ?? f.cake

                      return name === e.target.value
                    })

                    const price = selected ? Number(selected.srate ?? selected.mrp ?? selected.price ?? 0) : 0

                    setValue('food_cost_per_plate', price)
                  }}
                  error={!!errors.menu}
                  helperText={typeof errors.menu?.message === 'string' ? errors.menu?.message : undefined}
                >
                  <MenuItem value=''>-- Select Menu --</MenuItem>
                  {foods.map((f: any) => {
                    const name = f.description ?? f.product ?? f.cake ?? ''
                    const price = f.srate ?? f.mrp ?? f.price ?? f.suggestedPrice ?? 0

                    return (
                      <MenuItem key={name || Math.random()} value={name}>
                        {name} - ₹{price}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              ) : (
                <CustomTextField
                  label='Menu'
                  type='text'
                  {...field}
                  error={!!errors.menu}
                  helperText={typeof errors.menu?.message === 'string' ? errors.menu?.message : undefined}
                />
              )
            }
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
                value={field.value ?? ''}
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
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isLoading}
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
