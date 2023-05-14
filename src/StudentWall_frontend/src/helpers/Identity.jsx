import React, { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

const Login = () => {
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    const storedIdentity = localStorage.getItem('identity');
    if (storedIdentity) {
      setIdentity(AuthClient.Identity.fromString(storedIdentity));
    }
  }, []);

  const handleLogin = async () => {
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
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