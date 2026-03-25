// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { minLength, nonEmpty, object, pipe, string } from 'valibot'
import type { InferInput } from 'valibot'

import { MenuItem } from '@mui/material'

// Type Imports
import type { TaskType } from '@/types/apps/kanbanTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

type KanbanDrawerProps = {
  drawerOpen: boolean
  setDrawerOpen: (value: boolean) => void
  task: TaskType
  onEditTask: (task: TaskType) => void
  deleteTask: (taskId: string | number) => void
  products?: any[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  product: pipe(string(), nonEmpty('Product is required'), minLength(1)),
  price: pipe(string(), nonEmpty('price is required'), minLength(1)),
  quantity: pipe(string(), nonEmpty('Quantity is required'), minLength(1))
})

const KanbanDrawer = (props: KanbanDrawerProps) => {
  const { drawerOpen, setDrawerOpen, task, onEditTask, deleteTask, products } = props

  const data = products ?? [
    { product: 'Product A', price: 10 },
    { product: 'Product B', price: 20 },
    { product: 'Product C', price: 30 }
  ]

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hooks
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isLoading, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      product: task.product || '',
      price: task.price ? String(task.price) : '',
      quantity: task.quantity ? String(task.quantity) : ''
    },
    resolver: valibotResolver(schema)
  })

  // Close Drawer
  const handleClose = () => {
    setDrawerOpen(false)
    reset({ product: task.product })

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = () => {
    deleteTask(task.id)
    setDrawerOpen(false)
  }

  // To set the initial values according to the task
  useEffect(() => {
    reset({
      product: task.product || task.product || '',
      price: task.price ? String(task.price) : '',
      quantity: task.quantity ? String(task.quantity) : ''
    })
  }, [task, reset])

  const onSubmit = (data: FormData) => {
    // Keep the original id
    onEditTask({
      ...task,
      ...data,
      price: Number(data.price),
      quantity: Number(data.quantity)
    })
  }

  return (
    <div>
      <Drawer
        open={drawerOpen}
        anchor='right'
        variant='temporary'
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        onClose={handleClose}
      >
        <div className='flex justify-between items-center pli-6 plb-5 border-be'>
          <Typography variant='h5'>Edit Task</Typography>
          <IconButton size='small' onClick={handleClose}>
            <i className='tabler-x text-2xl text-textPrimary' />
          </IconButton>
        </div>
        <div className='p-6'>
          <div className='flex flex-col gap-y-5'>
            <Controller
              name='product'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  select
                  fullWidth
                  label='Product'
                  {...field}
                  value={field.value || ''}
                  onChange={e => {
                    field.onChange(e)

                    const selectedProduct = data.find(item => {
                      const name = item.product ?? item.description ?? item.cake

                      return name === e.target.value
                    })

                    if (selectedProduct) {
                      const price =
                        selectedProduct.price ??
                        selectedProduct.srate ??
                        selectedProduct.mrp ??
                        selectedProduct.suggestedPrice ??
                        0

                      setValue('price', String(price))
                    }
                  }}
                  error={Boolean(errors.product)}
                  helperText={errors.product?.message}
                >
                  <MenuItem disabled hidden>
                    --Select Product--
                  </MenuItem>
                  {data.map((item, index) => {
                    const name = item.product ?? item.description ?? item.cake ?? ''
                    const price = item.price ?? item.srate ?? item.mrp ?? item.suggestedPrice ?? 0
                    const qoh = item.qoh ?? undefined
                    const details: string[] = []

                    if (price) details.push(`₹${price}`)
                    if (qoh !== undefined) details.push(`Stock: ${qoh}`)
                    if (item.description && item.description !== name) details.push(item.description)

                    return (
                      <MenuItem key={index} value={name} className='flex flex-col items-start'>
                        <div className='font-medium'>{name}</div>
                        {details.length > 0 && <div className='text-sm text-gray-500'>{details.join(' • ')}</div>}
                      </MenuItem>
                    )
                  })}
                </CustomTextField>
              )}
            />
            <Controller
              name='price'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  label='Price'
                  {...field}
                  error={Boolean(errors.price)}
                  helperText={errors.price?.message}
                />
              )}
            />
            <Controller
              name='quantity'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  fullWidth
                  label='Quantity'
                  {...field}
                  error={Boolean(errors.quantity)}
                  helperText={errors.quantity?.message}
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
                Save
              </Button>
              <Button variant='tonal' color='error' onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default KanbanDrawer
