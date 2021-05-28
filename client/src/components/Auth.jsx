import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Avatar,
  Paper,
  Grid,
  Typography,
} from '@material-ui/core';
import useStyles from './authStyles';
import { GoogleLogin } from 'react-google-login';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import Icon from './Icon';
import { Redirect } from 'react-router';
const Auth = () => {
  const classes = useStyles();
  const [isSignup, setisSignUp] = useState(true);
  const [isRedirect, setisRedirect] = useState(false);
  const [showPassword, setshowPassWord] = useState(false);
  const [formData, setformData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  function handleShowPassword() {
    setshowPassWord((showPassword) => !showPassword);
  }
  function switchMode() {
    setisSignUp((isSignup) => !isSignup);
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (isSignup) {
      axios
        .post('https://mernfullstack-app.herokuapp.com/api/signup', formData)
        .then((response) => {
          localStorage.setItem('profile', JSON.stringify(response.data));
          setisRedirect(true);
        });
    } else {
      axios
        .post('https://mernfullstack-app.herokuapp.com/api/signin', formData)
        .then((response) => {
          localStorage.setItem('profile', JSON.stringify(response.data));
          setisRedirect(true);
        });
    }
  }
  function handleChange(event) {
    const { name, value } = event.target;
    setformData((formData) => {
      return { ...formData, [name]: value };
    });
  }
  function handleSuccess(response) {
    const result = response?.profileObj;
    const token = response?.tokenId;
    const data = { result, token };

    localStorage.setItem('profile', JSON.stringify(data));
    setisRedirect(true);
  }
  function handleFailure(err) {
    console.log(err);
    console.log('Google Sign In was Unsuccessfull!');
  }
  if (isRedirect) {
    return <Redirect to='/' />;
  } else {
    return (
      <Container component='main' maxWidth='xs'>
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant='h5'>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input
                    name='firstName'
                    label='First Name'
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name='lastName'
                    label='Last Name'
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name='email'
                label='Email'
                type='email'
                handleChange={handleChange}
              />
              <Input
                name='password'
                label='Password'
                handleChange={handleChange}
                type={showPassword ? 'text' : 'password'}
                handleShowPassword={handleShowPassword}
              />
              {isSignup && (
                <Input
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  handleChange={handleChange}
                />
              )}
            </Grid>

            <Button
              variant='contained'
              type='submit'
              fullWidth
              color='primary'
              className={classes.submit}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>

            <GoogleLogin
              clientId='1064453970646-tpeo7djnkasf2h5kfl6v4plaj5g24mta.apps.googleusercontent.com'
              
              render={(renderProps) => (
                <Button
                  className={classes.googleButton}
                  color='primary'
                  fullWidth
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<Icon />}
                  variant='contained'>
                  Sign in with Google
                </Button>
              )}
              onSuccess={handleSuccess}
              onFailure={handleFailure}
              cookiePolicy='single_host_origin'
            />
            <Grid container justify='flex-end'>
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    );
  }
};

export default Auth;
