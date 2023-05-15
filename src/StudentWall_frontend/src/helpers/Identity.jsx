import React from 'react'
import { useAuth } from './use-auth-client'
import { ImInfinite } from 'react-icons/im'
import { CgLogOut } from 'react-icons/cg'

const whoamiStyles = {
  border: '1px solid #1a1a1a',
  marginBottom: '1rem'
}

function LoggedIn () {
  const [result, setResult] = React.useState('')
  const { whoamiActor, logout, login, principal, identity, isAuthenticated } = useAuth()
  console.log('identity', whoamiActor)

  const handleClick = async () => {
    const whoami = await whoamiActor.whoami()
    setResult(whoami)
  }

  return (
    <div className='col my-auto identity-btn'>
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
