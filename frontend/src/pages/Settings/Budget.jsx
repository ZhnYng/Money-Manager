import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Budget(){
  const location = useLocation();
  const [budgetDetails, setBudgetDetails] = React.useState({
    amount: '',
    frequency: 'monthly',
  });
  const [submitStatus, setSubmitStatus] = React.useState(null);

  function handleChange(e){
    setBudgetDetails(prevBudgetDetails => ({...prevBudgetDetails, [e.target.name]: e.target.value}));
  }

  function handleSubmit(){
    axios.post('/addBudget', budgetDetails, {headers: {authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(res => setSubmitStatus(true))
      .catch(err => {
        setSubmitStatus(false);
        console.log(err);
      })
  }

  React.useEffect(() => {
    axios.get(`/getCurrentBudget/${location.state.user.email}`)
      .then(res => setBudgetDetails(res.data))
      .catch(err => console.log(err));
  }, [])

  return (
    <div className='bg-green-300 min-h-screen w-screen'>
      <div className='h-16 bg-green-600 w-screen flex flex-row text-white font-bold items-center gap-8 px-5'>
        <Link to="/profile">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </Link>
        <p className='text-xl'>Budget</p>
      </div>
      {submitStatus ? 
      <div className='flex justify-center'>
        <div className="alert alert-success shadow-lg w-11/12 mt-5">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Success! Budget saved</span>
          </div>
        </div>
      </div> 
      : 
      submitStatus === null ? null : 
      <div className='flex justify-center'>
        <div className="alert alert-error shadow-lg w-11/12 mt-5">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Error! Budget not saved</span>
          </div>
        </div>
      </div>
      }
      <button className="btn btn-success text-lg absolute right-0 m-5" onClick={handleSubmit}>Save</button>
      <div className='flex flex-col items-center'>
        <div className='my-10 w-11/12'>
          <span className="label-text text-green-600 text-lg font-medium uppercase mb-36">BUDGET Preferences</span>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Amount</p>
            <div className="form-control">
              <input 
                type="number" 
                placeholder="$0.00" 
                name="amount"
                className="text-lg w-40 input font-medium md:max-w-xs bg-gray-200 text-gray-800"
                onChange={handleChange}
                value={budgetDetails.amount}
              />
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Frequency</p>
            <select 
              className="select md:max-w-xs w-40 bg-gray-200 text-gray-800 text-lg" 
              value={budgetDetails.frequency}
              name="frequency"
              onChange={handleChange}
            >
              <option disabled>Budget renewal frequency</option>
              <option value='monthly'>Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}