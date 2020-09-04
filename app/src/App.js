import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [state, setState] = useState({
    tokenValue: ''
  });

  const login = async () => {
    const res = await axios.post('/api/login', {
      token: state.tokenValue
    });
    if (res.data.login) {
      setState({...state, loggedIn: true, ehrUrls: res.data.ehrUrls, refreshToken: res.data.refreshToken});
    }
  }

  const handleChange = (e) => {
    e.preventDefault();
    setState({...state, tokenValue: e.target.value})
  }

  return (
    <div className="App">
      {
        state.loggedIn ? 
        <ul className="App-list">
          {state.ehrUrls.map((url, i) => <li key={i}><a href={url}>{url}</a></li>)}
        </ul> :
        <div className="App-login">
          <div className="App-login-button" onClick={login}>
            Log In
          </div>

          <form>
            <input type="text" value={state.value} onChange={handleChange}></input>
          </form>
        </div>

    }
    </div>
  );
}

export default App;
