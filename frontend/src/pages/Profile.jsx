import React from 'react';
import jwtDecode from 'jwt-decode';
import SettingsNavigation from '../components/SettingsNavigation';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Profile(){
  const navigate = useNavigate();
  const [user, setUser] = React.useState()

  React.useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [])

  function handleLogOut(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');
    navigate('/login');
  }

  return (
    <div className='h-screen absolute top-0 w-screen -z-50 bg-green-300'>
      <div className='relative h-1/4'>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-box-arrow-left text-white absolute right-0 m-2" viewBox="0 0 16 16" onClick={handleLogOut}>
          <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
          <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
        </svg>
        <div className='h-3/4 bg-green-600'></div>
        <div className='text-white top-1/2 absolute ml-5'>
          <img src={user?.picture} className="rounded-full w-20"></img>
          <div className='text-white text-2xl font-bold'>
            {user?.name}
          </div>
        </div>
        <div className='h-1/3 bg-green-700'></div>
      </div>
      <div className='my-14 mx-7'>
        <Link 
          to="/settings/budget"
          state={{
            user: user
          }}
        >
          <SettingsNavigation 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cash-stack" viewBox="0 0 16 16">
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z"/>
              </svg>
            } 
            title={"Budget"}
          />
        </Link>
        <Link to="/settings/account">
          <SettingsNavigation 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z"/>
              </svg>
            } 
            title={"Account"}
          />
        </Link>
        <Link to="/settings/notifications">
          <SettingsNavigation 
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
              </svg>
            } 
            title={"Notifications"}
          />
        </Link>
        <hr className='bg-black'/>
        <div className='flex flex-row justify-between text-green-900 my-6'>
          <div className='flex flex-row'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16" onClick={handleLogOut}>
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
            </svg>
            <p className='text-xl font-medium ml-3'>Log Out</p>
          </div>
        </div>
      </div>
    </div>
  )
}