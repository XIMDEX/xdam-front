import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import MainService from '../api/service';
import { reloadApp } from '../appSlice';

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
  btn: {
    backgroundColor: '#43a1a2',
    '&:hover, &:focus': {
      backgroundColor: '#43a1a2',
    },
  }
}));

function LoginPage() {
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
    let user = await MainService().login(email, password);
    if (user.error) {
      setLoginStatus(user.error);
      setLoading(false);
      return;
    }
    MainService().setToken('JWT', user.data.access_token);
    setLoginStatus('Login success. Loading user data, please wait.');
    if (history.location.pathname === '/search') {
        history.push(history.location.pathname + history.location.search);
    }else if(history.location.pathname.startsWith('/resource/') && history.location.pathname.endsWith('/preview')){
      const urlParts = history.location.pathname.split('/');
      const resourceId = urlParts[2];
      history.push(history.location.pathname +`/resource/${resourceId}/preview`);
    } else {
        history.push('/home')
    }
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
        className={classes.btn}
        // style={{backgroundColor: '#43a1a2'}}
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



export default LoginPage;
