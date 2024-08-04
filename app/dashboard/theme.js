// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7FA1C3', 
    },
    secondary: {
      main: '#102c57', 
    },
  },
  tableHead: {
    fontFamily: 'Arial, sans-serif',
    fontWeight: 40,
    bgcolor: '#E2DAD6',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h2: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
      fontSize: 100,
    },
    h6: {
      fontWeight: 600,
      fontFamily: 'Georgia, serif',
      fontSize: 25,
    },
    h4: {
      fontFamily: 'Georgia, serif',
      fontSize: 50,
    },
    
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },

      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 2,
        },
      },
    },
  },
});

export default theme;
