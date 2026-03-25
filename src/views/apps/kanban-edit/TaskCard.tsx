// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

// Third-Party Imports
import classnames from 'classnames'

// Type Imports
import type {} from '@/types/apps/kanbanTypes'

// Styles Imports
import styles from './styles.module.css'

type TaskCardProps = {
  task: any
  setDrawerOpen: (value: boolean) => void
  setCurrentTask: (task: any) => void
  deleteTask: (taskId: string | number) => void
}

const TaskCard = (props: TaskCardProps) => {
  // Props
  const { task, setDrawerOpen, setCurrentTask, deleteTask } = props

  // States
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  // Handle menu click
  const handleClick = (e: any) => {
    setMenuOpen(true)
    setAnchorEl(e.currentTarget)
  }

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null)
    setMenuOpen(false)
  }

  // Handle Task Click
  const handleTaskClick = () => {
    setCurrentTask(task) // Set the clicked task as current
    setDrawerOpen(true)
  }

  // Delete Task
  const handleDeleteTask = () => {
    deleteTask(task.id)
  }

  // Handle Delete
  const handleDelete = () => {
    handleClose()
    handleDeleteTask()
  }

  return (
    <>
      <Card className={classnames('  overflow-visible mbe-4', styles.card)} onClick={() => handleTaskClick()}>
        <CardContent className='flex flex-col gap-y-2 items-start relative overflow-hidden'>
          <div className='absolute block-start-4 inline-end-3' onClick={e => e.stopPropagation()}>
            <IconButton
              aria-label='more'
              size='small'
              className={classnames(styles.menu, {
                [styles.menuOpen]: menuOpen
              })}
              aria-controls='long-menu'
              aria-haspopup='true'
              onClick={handleClick}
            >
              <i className='tabler-dots-vertical' />
            </IconButton>
            <Menu
              id='long-menu'
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {/* <MenuItem onClick={handleClose}>Duplicate Task</MenuItem> */}
              <MenuItem
                onClick={() => {
                  handleDelete()
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          </div>

          <Typography
            color='text.primary'
            className=' break-words text-base sm:text-base xs:text-sm'
            style={{ wordBreak: 'break-word' }}
          >
            {task.product}
          </Typography>

          <div className='flex flex-wrap justify-between items-center gap-4 is-full'>
            <div className='flex flex-wrap gap-4'>
              <div className='flex items-center gap-1'>
                {/* <i className='tabler-list-numbers text-xl text-textSecondary' /> */}
                <p className='text-base text-textSecondary'>Qty: </p>
                <Typography color='text.secondary' className='text-sm sm:text-sm xs:text-xs'>
                  {task.quantity}
                </Typography>
              </div>

              <div className='flex items-center gap-1'>
                <i className='tabler-cash text-xl text-textSecondary' />
                <Typography color='text.secondary' className='text-sm sm:text-sm xs:text-xs'>
                  {task.price}
                </Typography>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default TaskCard
