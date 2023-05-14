import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ImInfinite } from 'react-icons/im'
import { CgLogOut } from 'react-icons/cg'

const Login = () => {
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    AuthClient.create().then(async e => {
      setIdentity(e)

      let isAuthenticated = await e.isAuthenticated()
      if (isAuthenticated) {
        console.log("authenticated")
        setIsAuthenticated(true)
      }
    })

  }, [])


  const handleLogin = async () => {
    try {
      const authClient = await AuthClient.create();
      console.log(authClient)
      await authClient.login({
        identityProvider: process.env.CUSTOM_PROVIDER || 'https://identity.ic0.app',
        onSuccess: (e) => {
          console.log("user logged in")
          setIdentity(e)
          setIsAuthenticated(true)
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (identity) {
        await identity.logout();
        localStorage.removeItem('identity');
        setIsAuthenticated(false)
        setIdentity(null);
      }
    } catch (error) {
      console.error('Error logging out:', error);
      console.log(authClient)
    }
  };

  const test = () => {
    console.log(authClient.isAuthenticated())
    console.log(authClient.getIdentity().getPrincipal().toString())
  }

  return (
    <div className='col my-auto identity-btn'>
      {!isAuthenticated ? (
        <button onClick={handleLogin} className='primary-btn d-flex mx-auto'>
          <ImInfinite className='bg-transparent my-auto' />
          <span className='my-auto ms-2'>
            Login with Internet Identity
          </span>
        </button>
      ) : (
        <div>
          <button onClick={handleLogout} className='d-flex mx-auto primary-btn'><CgLogOut className='my-auto' /> <span className='my-auto ms-2'>Logout</span></button>
        </div>
      )}
    </div>
  );
};

export default Login;
