import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function Login() {
  const [token, setToken] = React.useState('');
  var client;
  /*global google*/
  client = google.accounts.oauth2.initCodeClient({
    client_id: '430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    ux_mode: 'popup',
    callback: async (response) => {
      // Send auth code to your backend platform
      console.log(response)
      axios.post('/authCode', {code: response.code})
        .then(res => {
          setToken(res.data.access_token)
          console.log(res.data.access_token)
        })
        .catch(err => console.log(err))
    },
  });

  function getAuthCode() {
    // Request authorization code and obtain user consent
    client.requestCode();
  }

  function getMessages() {
    axios.get('/allTransactionDetails', )
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }
  return (
    <>
    <button onClick={getAuthCode} className="bg-black p-10">AUTHEN</button>
    <button onClick={getMessages} className="bg-black p-10">MESSAGES</button>
    </>
  )
}