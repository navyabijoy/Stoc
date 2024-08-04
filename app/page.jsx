'use client';
import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./dashboard/theme"; 
import { auth, googleProvider } from '../firebase.js'; 
import { useRouter } from "next/navigation";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container, 
  Grid, 
  Paper,
  Snackbar 
} from '@mui/material';



const features = [
    { heading: 'Easy Management', description: 'Effortlessly track and organize your pantry items.' },
    { heading: 'Guided Recipes', description: 'Get personalized recipes based on your pantry contents.' },
    { heading: 'Simple UI', description: 'Enjoy a clean and intuitive user interface.' },
];

export default function LandingPage() {
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/dashboard');  // Redirect to dashboard after successful sign-in
        } catch (error) {
            console.error('Sign in error:', error);
            setSnackbarMessage('Failed to sign in. Please try again.');
            setOpenSnackbar(true);
        }
    };

    return (
      
      <ThemeProvider theme={theme}>
        <Box>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            StockUp
          </Typography>
          <Button 
            color="inherit" 
            variant="contained" 
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ marginTop: '8' }}>
        <Typography 
         variant="h2" align="center" sx={{ fontWeight: 'bold', marginTop: 18, mb: 4, ml: 6 }}>
          Welcome to StockUp!
        </Typography>
        <Grid container spacing={5}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  width: '90%',
                  height: '70%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderRadius: '16px',
                  mt: 2,
                }}
              >
                <Typography variant="h6" gutterBottom color="secondary">
                  {feature.heading}
                </Typography>
                <Typography>{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
      </Box>
    </ThemeProvider>
  );
}