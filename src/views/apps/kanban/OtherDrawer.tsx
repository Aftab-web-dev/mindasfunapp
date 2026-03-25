import { useEffect } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { useForm, Controller } from 'react-hook-form'

import CustomTextField from '@/@core/components/mui/TextField'

export default function OtherDrawer({
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
    reset,
    formState: { errors, isLoading, isSubmitting }
  } = useForm({
    defaultValues: defaultValues || {
      arrangement: '',
      amount: ''
    }
  })

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
            name='arrangement'
            control={control}
            rules={{ required: 'Arrangement required' }}
            render={({ field }) => (
              <CustomTextField
                label='Arrangement'
                type='text'
                {...field}
                error={!!errors.arrangement}
                helperText={typeof errors.arrangement?.message === 'string' ? errors.arrangement?.message : undefined}
              />
            )}
          />
          <Controller
            name='amount'
            control={control}
            rules={{ required: 'Amount required', min: 0.5 }}
            render={({ field }) => (
              <CustomTextField
                label='Amount'
                type='number'
                {...field}
                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                error={!!errors.amount}
                helperText={typeof errors.amount?.message === 'string' ? errors.amount?.message : undefined}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  onWheel: e => (e.currentTarget as HTMLInputElement).blur(),
                  className: 'no-spinner' // custom class to remove spinners
                }}
              />
            )}
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
