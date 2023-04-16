import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className='bg-green-400 min-h-screen flex justify-center flex-col items-center'>
      <FaPiggyBank size={70} color='white'/>
      <h1 className='text-4xl font-bold text-white my-4'>Coinly</h1>
      <button onClick={getAuthCode} className="btn btn-primary btn-lg">Sign in with google</button>
    </div>
    {/* <button onClick={revokeToken} className="bg-black p-10">revokeToken</button>
    <button onClick={getMessages} className="bg-black p-10">MESSAGES</button> */}
    </>
  )
}