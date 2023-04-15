import React from 'react';
import { Link } from 'react-router-dom';

export default function Account(){
  const profile = JSON.parse(localStorage.getItem('profile'));
  
  return (
    <div className='bg-green-300 min-h-screen'>
      <div className='h-16 bg-green-900 w-screen flex flex-row text-white font-bold items-center gap-8 px-5'>
        <Link to="/profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </Link>
        <p className='text-xl'>Account</p>
      </div>
      <div className='flex flex-col items-center'>
        <div className='my-10 w-11/12'>
          <div className="label-text text-green-600 text-lg font-medium uppercase mb-5">Account information</div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Name</p>
            <div className="form-control flex flex-row items-center text-gray-600 font-medium text-xl">
              {profile?.name}
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Email</p>
            <div className="form-control flex flex-row items-center text-gray-600 font-medium text-xl">
              {profile?.email}
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Picture</p>
            <img src={profile?.picture} className="rounded-full w-14"></img>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Family Name</p>
            <div className="form-control flex flex-row items-center text-gray-600 font-medium text-xl">
              {profile?.family_name}
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Given Name</p>
            <div className="form-control flex flex-row items-center text-gray-600 font-medium text-xl">
              {profile?.given_name}
            </div>
          </div>
          <hr className='border-gray-600 my-5'></hr>
          <div className="label-text text-green-600 text-lg font-medium uppercase mb-5">Account management</div>
          <div className='flex items-center justify-between my-5'>
            <button className="btn btn-error">DELETE ACCOUNT</button>
          </div>
          <hr className='border-gray-600 my-5'></hr>
          <p className='text-gray-500'>Account information comes from your google account. If you wish to edit these information do it from your google account.</p>
        </div>
      </div>
    </div>
  )
}