import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import TypeCalculator from './pages/TypeCalculator';
import DamageCalculator from './pages/DamageCalculator';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<TypeCalculator />} />
            <Route path="/damage" element={<DamageCalculator />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}
