import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function Login() {
  const [token, setToken] = React.useState('');

  /*global google*/
  // let oauth2Client = new google.auth.OAuth2(
  //   "430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com",
  //   "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",
  //   // "http://localhost:3000" //frontend url
  //   "https://moneymanagerclient.netlify.app/login" //frontend url
  // )

  // var client;
  // client = google.accounts.oauth2.initCodeClient({
  //   client_id: '430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com',
  //   scope: 'https://www.googleapis.com/auth/gmail.readonly',
  //   ux_mode: 'popup',
  //   callback: async (response) => {
  //     // Send auth code to your backend platform
  //     console.log(response)
  //     // axios.post('/authCode', {code: response.code})
  //     //   .then(res => {
  //     //     setToken(res.data.access_token)
  //     //     console.log(res.data.access_token)
  //     //   })
  //     //   .catch(err => console.log(err))
      
  //     /*global oauth2Client*/
  //     let { tokens } = await oauth2Client.getToken(response.code);
  //     oauth2Client.setCredentials(tokens)
  //   },
  // });

  /* global client */
  /* global access_token */
  console.log(access_token)
  async function getAuthCode() {
    // Request authorization code and obtain user consent
    await client.requestAccessToken();
    console.log(access_token)
  }
  function revokeToken() {
    google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')});
  }

  function getMessages() {
    if(access_token){
      axios.get('/allTransactionDetails', {headers: {authorization: `Bearer ${access_token}`}})
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }else{
      getAuthCode();
    }
  }

  return (
    <>
    <button onClick={getAuthCode} className="bg-black p-10">AUTHEN</button>
    <button onClick={revokeToken} className="bg-black p-10">revokeToken</button>
    <button onClick={getMessages} className="bg-black p-10">MESSAGES</button>
    </>
  )
}