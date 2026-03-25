import { useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import classnames from 'classnames'

import ProductSelectionModal from './ProductSelectionModal'
import styles from './styles.module.css'

type TaskCardProps = {
  task: any
  deleteTask: (taskId: string | number) => void
  updateTask: (task: any) => void
  products: any[]
  productType: 'food' | 'card' | 'gift'
}

const TaskCard = (props: TaskCardProps) => {
  const { task, deleteTask, updateTask, products, productType } = props

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = (e: any) => {
    e.stopPropagation()
    setMenuOpen(true)
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setMenuOpen(false)
  }

  const handleTaskClick = () => {
    setModalOpen(true)
  }

  const handleDelete = () => {
    handleClose()
    deleteTask(task.id)
  }

  return (
    <>
      <Card className={classnames('overflow-visible mbe-4', styles.card)} onClick={handleTaskClick}>
        <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
          <div className='absolute block-start-4 inline-end-3' onClick={e => e.stopPropagation()}>
            <IconButton
              aria-label='more'
              size='small'
              className={classnames(styles.menu, {
                [styles.menuOpen]: menuOpen
              })}
              onClick={handleClick}
            >
              <i className='tabler-dots-vertical' />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </div>

          <Typography
            color='text.primary'
            className='break-words text-base sm:text-base xs:text-sm'
            style={{ wordBreak: 'break-word' }}
          >
            {task.product}
          </Typography>

          <div className='flex flex-wrap justify-between items-center gap-4 is-full'>
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-1'>
                <p className='text-base text-textSecondary'>Qty: </p>
                <Typography color='text.secondary' className='text-sm sm:text-sm xs:text-xs'>
                  {task.quantity}
                </Typography>
              </div>

              <div className='flex items-center gap-1'>
                <i className='tabler-cash text-xl text-textSecondary' />
                <Typography color='text.secondary' className='text-sm sm:text-sm xs:text-xs'>
                  ₹{task.price}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProductSelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={updateTask}
        productType={productType}
        products={products || []}
        defaultValues={task}
      />
    </>
  )
}

export default TaskCard
