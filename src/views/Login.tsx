'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'
import themeConfig from '@configs/themeConfig'
import { useImageVariant } from '@core/hooks/useImageVariant'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setIsLoggedIn } from '@/store/slices/user-slice'
import { Mode, ResponseStatus } from '@/@core/types'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import CustomSnackBarNotification from '@/components/notification/custom-snackbar-notification'

interface LoginProps {
  mode: string
}

const Login = ({ mode }: { mode: Mode }) => {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false)
  const [loadingButtonLogin, setLoadingButtonLogin] = useState<boolean>(false)
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [responseStatus, setResponseStatus] = useState<ResponseStatus | null>(null)

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  const router = useRouter()
  const dispatch = useDispatch()
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoadingButtonLogin(true)
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    setUsernameError(null)
    setPasswordError(null)

    let isValid = true

    if (!username) {
      setUsernameError('Username harus diisi')
      isValid = false
    }

    if (!password) {
      setPasswordError('Password harus diisi')
      isValid = false
    }

    if (isValid) {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}api/user/login`, {
          username,
          password
        })
        const token = response.data.data.token
        localStorage.setItem('token', token)
        dispatch(setIsLoggedIn({ status: true, message: 'OK' }))
        setResponseStatus({ status: 'success', message: 'Selamat. Anda berhasil login.' })
        setTimeout(() => {
          setLoadingButtonLogin(false)
          router.push('/')
        }, 3000)
      } catch (error: any) {
        setResponseStatus({
          status: 'failed',
          message: error.response?.data.errors || 'Maaf, terjadi kesalahan pada server.'
        })
        setTimeout(() => {
          setLoadingButtonLogin(false)
        }, 1500)
      }
    } else {
      setLoadingButtonLogin(false)
    }
  }

  useEffect(() => {
    if (responseStatus) {
      setSnackBarOpen(true) // Show Snackbar when isSuccessUpdate changes
    }
  }, [responseStatus])

  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const handleCloseSnack = () => {
    setSnackBarOpen(false) // Close the Snackbar
  }

  return (
    <div className='flex flex-col justify-center items-center min-h-screen relative p-6'>
      {responseStatus && (
        <CustomSnackBarNotification
          open={snackBarOpen}
          response={responseStatus}
          onClose={handleCloseSnack}
          onResponse={setResponseStatus}
        />
      )}
      <Card className='flex flex-col sm:w-[450px]'>
        <CardContent className='p-6 sm:!p-12'>
          <Link href='/' className='flex justify-center items-center mb-6'>
            <Logo />
          </Link>
          <div className='flex flex-col gap-5'>
            <div>
              <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography className='mb-1'>Please sign-in to your account and start the adventure</Typography>
            </div>
            <form noValidate autoComplete='off' onSubmit={handleSubmit} className='flex flex-col gap-5'>
              <TextField
                autoFocus
                fullWidth
                label='Username'
                name='username'
                autoComplete='username'
                error={!!usernameError}
                helperText={usernameError}
              />
              <TextField
                fullWidth
                name='password'
                label='Password'
                id='outlined-adornment-password'
                type={isPasswordShown ? 'text' : 'password'}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        size='small'
                        edge='end'
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
                <FormControlLabel control={<Checkbox />} label='Remember me' />
                <Typography className='text-end' color='primary' component={Link} href='/forgot-password'>
                  Forgot password?
                </Typography>
              </div>
              <Button fullWidth variant='contained' type='submit' disabled={loadingButtonLogin}>
                {loadingButtonLogin ? (
                  <span className='flex animate-pulse'>
                    <TimelapseRoundedIcon className='animate-spin mx-2' />
                    Memuat...
                  </span>
                ) : (
                  <span>Log In</span>
                )}
              </Button>
              <div className='flex justify-center items-center flex-wrap gap-2'>
                <Typography>New on our platform?</Typography>
                <Typography component={Link} href='/register' color='primary'>
                  Create an account
                </Typography>
              </div>
              <Divider className='gap-3'>or</Divider>
              <div className='flex justify-center items-center gap-2'>
                <IconButton size='small' className='text-facebook'>
                  <i className='ri-facebook-fill' />
                </IconButton>
                <IconButton size='small' className='text-twitter'>
                  <i className='ri-twitter-fill' />
                </IconButton>
                <IconButton size='small' className='text-github'>
                  <i className='ri-github-fill' />
                </IconButton>
                <IconButton size='small' className='text-googlePlus'>
                  <i className='ri-google-fill' />
                </IconButton>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login
