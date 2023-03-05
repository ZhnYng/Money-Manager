import axios from 'axios';
import React from 'react';

export default function CreateTransaction(){
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const currentTime = (
    ("0" + date.getHours()).slice(-2)   + ":" + 
    ("0" + date.getMinutes()).slice(-2) + ":" + 
    ("0" + date.getSeconds()).slice(-2));
  
  const [error, setError] = React.useState();
  const [transactionDetails, setTransactionDetails] = React.useState({
    transaction_type: "",
    recipient: "",
    amount: "",
    date_of_transfer: currentDate,
    time_of_transfer: currentTime,
    category: "none",
    account: "",
    method: ""
  });

  function handleChange(e){
    e.preventDefault();
    setTransactionDetails(prevTransactionDetails => {
      return {...prevTransactionDetails, [e.target.name]: e.target.value}
    })
  }

  function handleSubmit(e){
    e.preventDefault();
    transactionDetails.amount = `SGD ${parseFloat(transactionDetails.amount).toFixed(2)}`;
    if(!transactionDetails.recipient || !transactionDetails.amount){
      setError(true)
    }else{
      axios.post('/addTransaction', transactionDetails, 
        {headers: {authorization: `Bearer ${localStorage.getItem('token')}`}})
        .then(result => console.log(result))
        .catch(err => console.log(err));
    }
  }

  return (
    <>
    <input type="checkbox" id="create-transaction-modal" className="modal-toggle" />
    <label htmlFor="create-transaction-modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {error ? <div className="alert alert-error shadow-lg mb-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Recipient and amount cannot be empty!</span>
          </div>
        </div> : null}
        <form>
          <h1 className='font-bold text-2xl text-center'>New Transaction</h1>
          <div className='flex justify-center gap-2 my-2'>
            <button className="btn btn-success w-6/12 text-gray-700 font-bold" 
              value="income" name='transaction_type' onClick={handleChange}>Income</button>
            <button className="btn btn-error w-6/12 text-gray-700 font-bold" 
              value="expense" name='transaction_type' onClick={handleChange}>Expense</button>
          </div>
          <div className="form-control flex flex-col w-full">
            <label className="input-group font-bold my-2">
              <span>Recipient</span>
              <input type="text" placeholder="E.g. John" value={transactionDetails.recipient}
                className="input input-bordered text-lg w-10/12" name='recipient' onChange={handleChange}/>
            </label>
            <label className="input-group font-bold my-2">
              <span>Amount</span>
              <input type="number" placeholder="SGD 0.00" className="input input-bordered text-lg w-10/12" 
                value={transactionDetails.amount} name="amount" onChange={handleChange}/>
            </label>
            <label className="input-group font-bold my-2">
              <span>Method</span>
              <input type="text" placeholder="E.g. PayNow" className="input input-bordered text-lg w-10/12" 
              value={transactionDetails.method} name="method" onChange={handleChange}/>
            </label>
            <label className="input-group font-bold my-2">
              <span>Account</span>
              <input type="text" placeholder="E.g. FRANK Account" value={transactionDetails.account}
              className="input input-bordered text-lg w-10/12" name="account" onChange={handleChange}/>
            </label>
            <select 
              className={`select text-gray-400 w-full
              border border-gray-600 font-bold text-xl my-2`}
              value={transactionDetails.category} 
              onChange={handleChange}
              name="category"
            >
              <option disabled value='none'>Select a category</option>
              <option value='food'>Food</option>
              <option value='entertainment'>Entertainment</option>
              <option value='apparel'>Apparel</option>
            </select>
            <button className="btn btn-success my-2 text-gray-800 font-bold w-full"
              onClick={handleSubmit}>Submit</button>
          </div>
        </form>
      </div>
    </label>
    </>
  )
}