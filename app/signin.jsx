"use client";

import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from 'C:/Users/navya/inventory_management/firebase.js'; 

const SignIn = () => {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Sign In
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSignIn}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default SignIn;
