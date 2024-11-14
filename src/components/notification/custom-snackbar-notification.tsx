import Snackbar from '@mui/material/Snackbar'
import { IconButton, Portal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { ResponseStatus } from '@/@core/types'
import { useDispatch } from 'react-redux'
import { setResponseStatus } from '@/store/slices/response-status-slice'

interface CustomSnackBarNotificationProps {
  open: boolean
  response?: ResponseStatus | null
  onClose: () => void
  onResponse: (response: ResponseStatus | null) => void
}

export default function CustomSnackBarNotification({
  open,
  response,
  onClose,
  onResponse
}: CustomSnackBarNotificationProps) {
  const dispatch = useDispatch()

  const getMessageIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon style={{ color: 'green' }} />
      case 'failed':
        return <ErrorIcon style={{ color: 'red' }} />
      default:
        return null
    }
  }

  const message = response ? (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {getMessageIcon(response.status)}
      <span style={{ marginLeft: 8 }}>{response.message}</span>
    </span>
  ) : null

  return (
    <Portal>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={onClose}
        message={message}
        autoHideDuration={4000}
        ContentProps={{
          style: {
            backgroundColor: '#fafafa',
            color: response?.status === 'success' ? '#4caf50' : '#f44336', // Green for success, red for error
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '1px 2px 30px rgba(0, 0, 0, 0.5)',
            borderRadius: '4px'
          }
        }}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={onClose}>
            <CloseIcon fontSize='small' color='inherit' />
          </IconButton>
        }
      />
    </Portal>
  )
}
