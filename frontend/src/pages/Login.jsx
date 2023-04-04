import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default function Login() {
  const navigate = useNavigate();
  /* global google */
  /* global client */
  /* global access_token */
  async function getAuthCode() {
    // Request authorization code and obtain user consent
    client.requestAccessToken();
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