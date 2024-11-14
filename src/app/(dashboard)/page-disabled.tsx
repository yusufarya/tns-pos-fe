import { Warning } from '@mui/icons-material'

import { Box, Typography } from '@mui/material'

interface PageDisabledProps {
  message?: string | any
}

const PageDisabled: React.FC<PageDisabledProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        zIndex: 1400
      }}
    >
      <Box textAlign='center'>
        <div className='flex justify-center'>
          <Warning fontSize='large' className='mx-3 my-1 animate-bounce ' />
          <Typography variant='h3' color={'white'} fontWeight={600} className='animate-bounce'>
            Maaf
          </Typography>
        </div>
        <Typography variant='body1' color={'white'}>
          {message}.
        </Typography>
      </Box>
    </Box>
  )
}

export default PageDisabled
