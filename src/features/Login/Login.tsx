import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reloadApp } from '../../appSlice';
import { Grid, Button } from '@material-ui/core';
import MainService from '../../api/service';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '400px',
    padding: '0 20px',
    margin: '25vh auto',
  },
  mbText: {
    marginBottom: 30,
  },
  title: {
    fontWeight: 'bolder',
    marginBottom: 50,
  },
}));

export function Login() {
  let history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState({} as any | '');

  const writeEmail = (e) => {
    setEmail(e.target.value);
  };
  const writePassword = (e) => {
    setPassword(e.target.value);
  };

  const log = async () => {
    setLoading(true);
    let user = await MainService.login(email, password);
    if (user.error) {
      setLoginStatus(user.error);
      setLoading(false);
      return;
    }
    MainService.setToken('JWT', user.data.access_token);
    setLoginStatus('Login success. Loading user data, please wait.');
    history.push('/home');
    dispatch(reloadApp());
  };

  function RenderStatus() {
    if (typeof loginStatus === 'string') {
      return (
        <p style={{ textAlign: 'center', marginTop: 10 }}>{loginStatus}</p>
      );
    }
    return (
      <ul>
        {' '}
        {Object.keys(loginStatus).map((item, i) => (
          <li key={i}>{loginStatus[item][0]}</li>
        ))}{' '}
      </ul>
    );
  }

  return (
    <div className={classes.root}>
      {/* <Typography gutterBottom variant='h5' align='center' className={classes.mbText}>Login</Typography> */}
      <img
        src="ximdex_dam_login.png"
        style={{ width: '100%', marginBottom: 30 }}
      />
      <TextField
        className={classes.mbText}
        fullWidth
        size="small"
        label="Email"
        variant="outlined"
        onChange={writeEmail}
      />
      <TextField
        className={classes.mbText}
        fullWidth
        size="small"
        label="Password"
        variant="outlined"
        type="password"
        onChange={writePassword}
      />
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={log}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'LOGIN'}
      </Button>
      <RenderStatus />
    </div>
  );
}
