import { useState, useEffect, useRef } from 'react'

import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { MenuItem } from '@mui/material'

import CustomTextField from '@/@core/components/mui/TextField'

type KanbanDrawerProps = {
  drawerOpen: boolean
  setDrawerOpen: (value: boolean) => void
  task: any
  onEditTask: (task: any) => void
  deleteTask: (taskId: string | number) => void
}

const KanbanDrawer = (props: KanbanDrawerProps) => {
  const data = [
    {
      product: 'Product A',
      price: 10
    },
    {
      product: 'Product B',
      price: 20
    },
    {
      product: 'Product C',
      price: 30
    }
  ]

  const { drawerOpen, setDrawerOpen, task, onEditTask, deleteTask } = props
  const [product, setProduct] = useState(task.product || '')
  const [price, setPrice] = useState(task.price || '')
  const [quantity, setQuantity] = useState(task.quantity || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setProduct(task.product || '')
    setPrice(task.price || '')
    setQuantity(task.quantity || '')
  }, [task])

  const handleClose = () => {
    setDrawerOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSave = () => {
    onEditTask({
      ...task,
      product,
      price,
      quantity
    })
    setDrawerOpen(false)
  }

  const handleDelete = () => {
    deleteTask(task.id)
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
        <Typography variant='h5'>Edit Task</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='tabler-x text-2xl text-textPrimary' />
        </IconButton>
      </div>
      <div className='p-6'>
        <div className='flex flex-col gap-y-5'>
          <CustomTextField select fullWidth label='Product' value={product} onChange={e => setProduct(e.target.value)}>
            <MenuItem disabled hidden>
              --Select Product--
            </MenuItem>
            {data.map((item, index) => (
              <MenuItem key={index} value={item.product}>
                {item.product}
              </MenuItem>
            ))}
          </CustomTextField>
          <CustomTextField fullWidth label='Price' value={price} onChange={e => setPrice(e.target.value)} />
          <CustomTextField
            fullWidth
            label='Quantity'
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
          <div className='flex gap-4'>
            <Button variant='contained' color='primary' onClick={handleSave}>
              Save
            </Button>
            <Button variant='tonal' color='error' onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default KanbanDrawer
