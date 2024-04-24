import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { AuthContext } from '../../context/authContext';
import { useTheme } from '@mui/material/styles';
import './navbar.scss';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  return (
    <>
      <AppBar position="fixed" className="navbar">
        <Toolbar>
          <Link to={`/profile/${currentUser?.id}`} className="navbar-link">
            <Avatar
              alt={currentUser?.name}
              src={currentUser?.profilePic ? `/upload/${currentUser.profilePic}` : "/upload/default.png"}
              className="navbar-avatar"
            />
            <Typography
              variant="h6" 
              component="div"
              className="navbar-name"
              sx={{ display: 'block', fontWeight: 'bold' }}
            >
              {currentUser?.name}
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box sx={{ flexGrow: 1 }}>
      </Box>
    </>
  );
};

export default Navbar;