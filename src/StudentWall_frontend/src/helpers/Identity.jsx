import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

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
    <div>
      {!identity ? (
        <button onClick={handleLogin}>Login with Internet Identity</button>
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
