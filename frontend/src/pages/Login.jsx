import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignInButton from '../components/LoginButton';

export default function Login() {

  // <script>
  //   function initBaseURL(){
  //     axios.defaults.baseURL = 'https://money-manager-backend-no0w.onrender.com';
  //     // axios.defaults.baseURL = 'http://localhost:5000';
  //   }

  //   var client;
  //   var access_token;
  //   function initClient() {
  //     client = google.accounts.oauth2.initTokenClient({
  //       client_id: '430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com',
  //       scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile",
  //       callback: async (tokenResponse) => {
  //         console.log(access_token)
  //         access_token = tokenResponse.access_token;
  //         localStorage.setItem('access_token', access_token);
  //         // Get user profile information
  //         let profile = {};

  //         await axios.get(
  //           'https://gmail.googleapis.com/gmail/v1/users/me/profile',
  //           {headers: {Authorization: `Bearer ${access_token}`}}
  //         )
  //           .then(async res => {
  //             profile = {...profile, email: res.data.emailAddress};
  //             await axios.post('/addUser', {email: res.data.emailAddress})
  //               .then(async res => {
  //                 console.log(res);
  //                 await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}})
  //                   .then(res => {
  //                     profile = {...profile, ...res.data}
  //                     localStorage.setItem('profile', JSON.stringify(profile))
  //                     window.location.replace('/');
  //                   })
  //                   .catch(err => console.log(err))
  //               })
  //               .catch(err => console.log(err));
  //           })
  //           .catch(err => console.log(err));
  //       },
  //     });
  //   }
  // </script>
  

  // const navigate = useNavigate();
  // async function getAuthCode() {
  //   // Request authorization code and obtain user consent
  //   client.requestAccessToken();
  // }

  // function revokeToken() {
  //   google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')});
  // }

  // function getMessages() {
  //   if(access_token){
  //     axios.get('/allTransactionDetails', {headers: {authorization: `Bearer ${access_token}`}})
  //       .then(res => console.log(res))
  //       .catch(err => console.log(err))
  //   }else{
  //     getAuthCode();
  //   }
  // }

  return (
    <>
    <div className='bg-green-400 min-h-screen flex justify-center flex-col items-center'>
      <FaPiggyBank size={70} color='white'/>
      <h1 className='text-4xl font-bold text-white my-4'>Money Manager</h1>
      {/* <div id='signInDiv' className="btn btn-primary btn-lg" >Sign in with google</div> */}
      <SignInButton/>
    </div>
    {/* <button onClick={revokeToken} className="bg-black p-10">revokeToken</button>
    <button onClick={getMessages} className="bg-black p-10">MESSAGES</button> */}
    </>
  )
}