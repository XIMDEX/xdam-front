import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reloadApp } from '../../appSlice';
import { Grid, Button } from '@material-ui/core';
import MainService from '../../api/service';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { login, parseJWT } from '../../api/XdirAuthService';
import { useNavigate } from 'react-router-dom';

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

export const Login = () => {
  let navigate = useNavigate();
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

  const loginCheck = async () => {
    setLoading(true);

    login({username: email, password})
      .then((token: string) => {
        const payload = parseJWT(token);
        MainService().setToken('JWT', token, payload.expiration);

        setLoginStatus('Login success. Loading user data, please wait.');

        setLoading(false);
        navigate('/home');
        dispatch(reloadApp());
      })
      .catch(error => {
        setLoginStatus(error);
        setLoading(false);
      });
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
        onClick={loginCheck}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'LOGIN'}
      </Button>
      <RenderStatus />
    </div>
  );
}
