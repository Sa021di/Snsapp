import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from '../../context/authContext';
import "./BotNavbar.scss";

const BotNavbar = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        if (newValue === 0) {
          navigate('/');
        } else if (newValue === 1) {
          navigate('/bookmarks');
        } else if (newValue === 2) {
          handleLogout();
        }
      }}
      className="bot-navbar"
    >
      <BottomNavigationAction label="" icon={<HomeIcon />} />
      <BottomNavigationAction label="" icon={<BookmarksIcon />} />
      <BottomNavigationAction label="" icon={<LogoutIcon />} />
    </BottomNavigation>
  );
};

export default BotNavbar;