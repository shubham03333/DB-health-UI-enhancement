import React from 'react';
import { AppBar, Toolbar, Button, Box, useTheme, useMediaQuery } from '@mui/material';

const Navbar = ({ navButtons, onButtonClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" color="default" sx={{ mb: 4, borderRadius: 2, backgroundColor: theme.palette.background.paper, top: 0, zIndex: 1000 }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {navButtons.map((item) => (
            <Button
              key={item.key}
              color="primary"
              variant="outlined"
              onClick={() => onButtonClick(item.key)}
              size={isMobile ? 'small' : 'medium'}
            >
              {item.shortName}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;