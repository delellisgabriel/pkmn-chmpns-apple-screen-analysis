import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Type Calculator', path: '/' },
  { label: 'Damage Calculator', path: '/damage' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
          ⚔ Pokemon Champions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navItems.map(({ label, path }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              sx={{
                color: '#fff',
                fontWeight: pathname === path ? 700 : 400,
                borderBottom: pathname === path ? '2px solid #fff' : '2px solid transparent',
                borderRadius: 0,
              }}
            >
              {label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
