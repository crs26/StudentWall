import React from 'react'
import { useAuth } from './use-auth-client'
import { ImInfinite } from 'react-icons/im'
import { CgLogOut } from 'react-icons/cg'

function LoggedIn () {
  const { logout, login, isAuthenticated } = useAuth()

  return (
    <div className='col d-flex justify-content-end my-auto identity-btn'>
      {!isAuthenticated
        ? (
          <button onClick={login} className='primary-btn d-flex mx-auto'>
            <ImInfinite className='bg-transparent my-auto' />
            <span className='my-auto ms-2'>
              Login with Internet Identity
            </span>
          </button>
          )
        : (
          <div>
            <button onClick={logout} className='d-flex mx-auto primary-btn'><CgLogOut className='my-auto' /> <span className='my-auto ms-2'>Logout</span></button>
          </div>
          )}
    </div>
  )
}

export default LoggedIn
