import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { ImInfinite } from 'react-icons/im'

const Login = () => {
  const [identity, setIdentity] = useState(null);
  let authClient
  AuthClient.create().then(e => {
    authClient = e
    if (e.isAuthenticated()){
      setIdentity(e.getIdentity())
    }
  })
  
  const handleLogin = async () => {
    try {
      await authClient.login({
        identityProvider: process.env.CUSTOM_PROVIDER | 'https://identity.icp0.app',
        onSuccess: () => {
          const identityString = authClient.getIdentity().toString();
          localStorage.setItem('identity', identityString);
          setIdentity(authClient.getIdentity());
        },
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (identity) {
        const authClient = await AuthClient.create();
        await authClient.logout();
        localStorage.removeItem('identity');
        setIdentity(null);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const test = () => {
    console.log(authClient.isAuthenticated())
    console.log(authClient.getIdentity().getPrincipal().toString())
  }

  return (
    <div className='my-auto'>
      {!identity ? (
        <div className='post-card p-5'>
          <button onClick={handleLogin} className='primary-btn py-4'>
            <ImInfinite className='bg-transparent' />
            Login with Internet Identity</button>
        </div>
      ) : (
        <div>
          <p>Welcome, {identity.getPrincipal().toString()}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Login;
