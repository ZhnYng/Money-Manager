import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Budget(){
  const currency = 'SGD';
  const location = useLocation();
  const [budgetDetails, setBudgetDetails] = React.useState({
    amount: '',
    frequency: 'monthly',
    start_date: '',
    end_date: '',
    method: '',
    recipient: 'BUDGET',
    account: '',
    category: 'none',
    transaction_type: 'income',
    recorded_with: 'RECURRING'
  });
  const [submitStatus, setSubmitStatus] = React.useState(null);

  function handleChange(e){
    setBudgetDetails(prevBudgetDetails => ({...prevBudgetDetails, [e.target.name]: e.target.value}));
  }

  function handleSubmit(){
    const numeric_amount = budgetDetails.amount;
    budgetDetails.amount = `${currency} ${parseFloat(budgetDetails.amount).toFixed(2)}`;
    axios.post('/addRecurringTransaction', budgetDetails, {headers: {authorization: `Bearer ${localStorage.getItem('access_token')}`}})
      .then(res => {setSubmitStatus(true); console.log(res);})
      .catch(err => {
        setSubmitStatus(false);
        console.log(err);
      })
    budgetDetails.amount = numeric_amount;
  }

  React.useEffect(() => {
    axios.get(`/getUserBudget/${location.state.user.email}`)
      .then(res => {
        res.data.amount = res.data.amount.split(" ")[1];
        setBudgetDetails(res.data)
      })
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
            <div className="form-control flex flex-row items-center">
              <p className='font-bold text-gray-600 text-lg mr-1'>{currency}($)</p>
              <input 
                type="number" 
                placeholder="0.00" 
                name="amount"
                className="text-lg w-32 input font-medium md:max-w-xs bg-gray-200 text-gray-800"
                onChange={handleChange}
                value={budgetDetails.amount}
              />
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Frequency</p>
            <select 
              className={`select text-white w-48 bg-white
              border border-gray-500 font-medium text-xl`}
              value={budgetDetails.frequency}
              name="frequency"
              onChange={handleChange}
              disabled
            >
              <option disabled>Budget renewal frequency</option>
              <option value='monthly'>Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Method</p>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="E.g. PayNow" 
                name="method"
                className="text-lg w-48 input font-medium md:max-w-xs bg-gray-200 text-gray-800"
                onChange={handleChange}
                value={budgetDetails.method}
              />
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Account</p>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="E.g. FRANK Account" 
                name="account"
                className="text-lg w-48 input font-medium md:max-w-xs bg-gray-200 text-gray-800"
                onChange={handleChange}
                value={budgetDetails.account}
              />
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Category</p>
            <select 
              className={`select text-gray-800 w-48 bg-white
              border border-gray-500 font-medium text-xl`}
              value={budgetDetails.category} 
              onChange={handleChange}
              name="category"
            >
              <option value='none'>Category</option>
              <option value='food'>Food</option>
              <option value='entertainment'>Entertainment</option>
              <option value='apparel'>Apparel</option>
            </select>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>Start Date</p>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="YYYY-MM-DD" 
                name="start_date"
                className="text-lg w-48 input font-medium md:max-w-xs bg-gray-200 text-gray-800"
                onChange={handleChange}
                value={budgetDetails.start_date}
              />
              <label className='text-gray-500 font-medium self-end'>E.g. YYYY-MM-DD</label>
            </div>
          </div>
          <div className='flex items-center justify-between my-5'>
            <p className='text-xl text-green-900 font-medium'>End Date</p>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="YYYY-MM-DD" 
                name="end_date"
                className="text-lg w-48 input font-medium md:max-w-xs bg-gray-200 text-gray-800"
                onChange={handleChange}
                value={budgetDetails.end_date}
              />
              <label className='text-gray-500 font-medium self-end'>E.g. YYYY-MM-DD</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}