import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ImInfinite } from 'react-icons/im'

const Login = () => {
  const [identity, setIdentity] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  useEffect(() => {
    AuthClient.create().then( async e => {
      setIdentity(e)

      let isAuthenticated = await e.isAuthenticated()
      if (isAuthenticated){
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
        identityProvider: process.env.CUSTOM_PROVIDER || 'https://identity.icp0.app',
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
    <div className='my-auto'>
      {!isAuthenticated ? (
        <div className='post-card p-5'>
          <button onClick={handleLogin} className='primary-btn py-4'>
            <ImInfinite className='bg-transparent' />
            Login with Internet Identity</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
