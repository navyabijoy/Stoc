"use client";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Ensure the path is correct
import { auth, db } from "../../firebase"; // Ensure correct imports
import { signOut } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, setDoc, query, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Modal,
  Stack,
  TextField,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const router = useRouter();
  const [recipes, setRecipes] = useState('');

  const CustomButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#7FA1C3',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '20px',
    textTransform: 'none',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
    '&:hover': {
      backgroundColor: '#102c57',
      color: '#F9E400',
      boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
    },
    '&:active': {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    },
  }));

  const [recipe, setRecipe] = useState("");
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const fetchItems = async () => {
    try {
      const itemsCollection = collection(db, "StockUp"); // Ensure correct collection name
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(itemsList);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  const generateRecipe = async () => {
    setIsGeneratingRecipe(true); // Start loading indicator
    try {
      // Extract item names from the items array
      const itemNames = items.map(item => item.id);

      // Send POST request to the API endpoint with item names
      const response = await fetch('app/api/generate-recipe/route.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: itemNames }),
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the JSON response
      const data = await response.json();
      setRecipe(data.recipe); // Update state with the generated recipe
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipe("Failed to generate recipe. Please try again."); // Set error message
    } finally {
      setIsGeneratingRecipe(false); // Stop loading indicator
    }
  };

  const updateInventory = async () => {
    const q = query(collection(db, "StockUp")); // Use db here
    const snapshot = await getDocs(q); // Corrected to getDocs
    const inventoryList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setItems(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(db, "StockUp", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(db, "StockUp", item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        updateInventory();
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              StockUp
            </Typography>
            <Button color="inherit" onClick={handleSignOut}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
        <Container>
          <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
            Welcome, {user.displayName}!
          </Typography>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" onClick={handleOpen}>
              Add New Item
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">
                      {item.id}
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        onClick={() => addItem(item.id)}
                        sx={{ mr: 1 }}
                      >
                        +1
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal open={open} onClose={handleClose}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="fixed"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bgcolor="rgba(0, 0, 0, 0.5)" // Optional: for a dark overlay
            >
              <Box
                width="80%"
                maxWidth="400px"
                bgcolor="white"
                p={3}
                borderRadius="8px"
              >
                <Typography variant="h6" gutterBottom>
                  Add New Item
                </Typography>
                <TextField
                  label="Item Name"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={() => {
                    addItem(itemName);
                    setItemName("");
                    handleClose();
                  }}
                  fullWidth
                >
                  Add Item
                </Button>
              </Box>
            </Box>
          </Modal>
          
        </Container>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
      <CustomButton 
  variant="contained" 
  onClick={generateRecipe} 
  disabled={isGeneratingRecipe}
>
  {isGeneratingRecipe ? "Generating..." : "Find Recipes!"}
</CustomButton>
</Box>
          {recipe && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Generated Recipe:</Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {recipe}
            </Typography>
          </Paper>
        </Box>
      )}
    </ThemeProvider>
  );
}
