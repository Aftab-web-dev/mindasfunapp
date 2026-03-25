// React Imports
import { useRef } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { MenuItem } from '@mui/material'
import Button from '@mui/material/Button'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { minLength, nonEmpty, number, object, pipe, string, minValue } from 'valibot'
import type { InferInput } from 'valibot'

import CustomTextField from '@/@core/components/mui/TextField'

type KanbanDrawerProps = {
  drawerOpen: boolean
  setDrawerOpen: (value: boolean) => void
  setDisplayNewItem: (value: boolean) => void
  addTask: any
  products?: any[]
}

type FormData = InferInput<typeof schema>

const schema = object({
  product: pipe(string(), nonEmpty('Product is required'), minLength(1)),
  price: pipe(number(), minValue(1, 'Price is required')),
  quantity: pipe(number(), minValue(1, 'Quantity is required'))
})

const KanbanDrawerAdd = (props: KanbanDrawerProps) => {
  const { drawerOpen, setDrawerOpen, setDisplayNewItem, addTask, products } = props

  const data = products ?? [
    { product: 'Product Aaaa', price: 10 },
    { product: 'Product B', price: 20 },
    { product: 'Product C', price: 30 }
  ]

  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isLoading, isSubmitting }
  } = useForm<FormData>({
    resolver: valibotResolver(schema)
  })

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

  const handleClose = () => {
    setDrawerOpen(false)
    setDisplayNewItem(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = (data: FormData) => {
    const itemWithId = { ...data, id: generateId() }

    addTask(itemWithId)
    setDrawerOpen(false)
  }

  return (
    <Drawer
      open={drawerOpen}
      anchor='right'
      variant='temporary'
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
      onClose={handleClose}
    >
      <div className='flex justify-between items-center pli-6 plb-5 border-be'>
        <Typography variant='h5'>Add</Typography>
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

                    setValue('price', price)
                  }
                }}
                error={Boolean(errors.product)}
                helperText={errors.product?.message}
              >
                <MenuItem disabled hidden>
                  --Select Product--
                </MenuItem>
                {data.map((item, index) => {
                  const name = item.product ?? item.description ?? item.cake

                  return (
                    <MenuItem key={index} value={name}>
                      {name}
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
                type='number'
                {...field}
                value={field.value ?? ''}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
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
            name='quantity'
            control={control}
            render={({ field }) => (
              <CustomTextField
                fullWidth
                label='Quantity'
                type='number'
                {...field}
                value={field.value ?? ''}
                onChange={e => {
                  const value = e.target.value === '' ? '' : Number(e.target.value)

                  field.onChange(value)
                }}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity?.message}
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
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default KanbanDrawerAdd
