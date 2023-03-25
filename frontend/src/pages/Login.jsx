import React from 'react';
import { FaPiggyBank } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const navigate = useNavigate();

  function handleCallbackResponse(response){
    localStorage.setItem("token", response.credential)
    navigate('/')
  }

  React.useEffect(() => {
    if(localStorage.getItem('token')) navigate('/')

    /* global google */
    google.accounts.id.initialize({
      client_id: "430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme: 'outline', size: "large"}
    )
  }, [])

  return(
    <div className='bg-green-400 min-h-screen flex flex-col items-center justify-center'>
      <FaPiggyBank size={70} color={"white"}/>
      <p className='text-white font-bold text-xl justify-self-end my-2'>MoneyManager</p>
      <div id='signInDiv' className='mt-6'></div>
    </div>
  )
}