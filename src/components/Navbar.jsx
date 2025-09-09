import React from 'react';
import { AppBar, Toolbar, Button, Box, useTheme, useMediaQuery } from '@mui/material';

const Navbar = ({ onButtonClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navButtons = [
    { key: "TOP WAIT EVENTS", shortName: "Wait Events" },
    { key: "TOP SQL BY RESOURCE USAGE", shortName: "Top SQL" },
    { key: "ACTIVE SESSIONS DETAILS", shortName: "Active Sessions" },
    { key: "INVALID OBJECTS DETAILS", shortName: "Invalid Objects Details" },
    { key: "BUFFER CACHE HIT RATIO", shortName: "Buffer Cache Ratio" },
    { key: "LIBRARY CACHE HIT RATIO", shortName: "Library Cache Ratio" },
    { key: "ARCHIVE LOG GENERATION RATE", shortName: "Archive Logs" },
    { key: "INVALID OBJECTS SUMMARY", shortName: "Session Summary" },
    { key: "INVALID OBJECTS COUNT", shortName: "Invalid Objects Count" },
    { key: "TABLESPACE USAGE", shortName: "Tablespaces" },
    { key: "BLOCKING SESSIONS", shortName: "Blocking Sessions" },
    { key: "DEADLOCKS", shortName: "Deadlocks" },
  ];

  return (
    <AppBar position="static" color="default" sx={{ mb: 4, borderRadius: 2, backgroundColor: theme.palette.background.paper }}>
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

