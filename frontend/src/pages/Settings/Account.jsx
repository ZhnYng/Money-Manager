import React from 'react';
import { Link } from 'react-router-dom';

export default function Account(){
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
    </div>
  )
}