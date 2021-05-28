import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import { Link, useHistory,useLocation } from 'react-router-dom';
import memories from './images/photo-album.svg';
import decode from 'jwt-decode';
import useStyles from './navbarStyles';
function Navbar() {
  const classes = useStyles();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const item = localStorage.getItem('profile');
  const history = useHistory();
  const location=useLocation();
  //eslint - disable - next - line;
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [item]); //eslint - disable - next - line;
  const token = user?.token;
  
  useEffect(()=>{
    
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
         localStorage.clear();
         history.push('/');
         
      }
    }
  },[token,location,history])
  
  function handleLogout() {
    localStorage.clear();
    history.push('/auth');
    setUser(null);
  }
  return (
    <AppBar className={classes.appBar} position='static' color='inherit'>
      <div className={classes.brandContainer}>
        <Typography
          component={Link}
          to='/'
          className={classes.heading}
          variant='h2'
          align='center'>
          Memories
        </Typography>
        <img
          className={classes.image}
          src={memories}
          alt='Memories'
          height='60'
        />
      </div>
      <Toolbar  className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar
              className={classes.purple}
              alt={user.result.name}
              src={user.result.imageUrl}>
              {user.result.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant='h6'>
              {user.result.name}
            </Typography>
            <Button
              variant='contained'
              className={classes.logout}
              onClick={handleLogout}
              color='secondary'>
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to='/auth'
            variant='contained'
            color='primary'>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
