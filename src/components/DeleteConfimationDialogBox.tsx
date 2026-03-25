// ** React Imports
import React, { type RefObject } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

interface DeleteConfirmationDialogProps {
  id: any
  name: string
  open: boolean
  message?: string
  setOpen: (open: boolean) => void
  deleteFunction: any
  buttonRef?: RefObject<HTMLButtonElement>
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  id,
  name,
  open,
  message,
  setOpen,
  deleteFunction,
  buttonRef
}) => {
  // ** State
  const handleClose = () => setOpen(false)

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose()
        }
      }}
    >
      <DialogTitle id='alert-dialog-title' style={{ color: 'red' }}>
        Confirm Deletion
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Deleting <span style={{ fontWeight: 600, color: '#413f46f0' }}>{name}</span> will permanently remove all
          associated data. Are you sure you want to proceed? {message}
          {/* Are you sure you want to delete <span style={{ fontWeight: 600, color: '#413f46f0' }}>{name}</span>? */}
        </DialogContentText>
      </DialogContent>
      <DialogActions className='dialog-actions-dense'>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='contained' ref={buttonRef} onClick={() => deleteFunction(id)}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
