import React from 'react';

export default function SettingsNavigation({icon, title}){
  const [showing, setShowing] = React.useState(false);

  function handleToggle(){
    setShowing(!showing);
  }

  return (
    <div className='flex flex-row justify-between text-green-900 my-6' onClick={handleToggle}>
      <div className='flex flex-row'>
        {icon}
        <p className='text-xl font-medium ml-3'>{title}</p>
      </div>
      <button>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
          <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
        </svg>
      </button>
    </div>
  )
}