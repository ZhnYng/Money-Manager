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
    transaction_type: "expense",
    recipient: "",
    amount: "",
    date_of_transfer: currentDate,
    time_of_transfer: currentTime,
    category: "none",
    account: "",
    method: "",
    recorded_with: "MANUAL"
  });

  function handleChange(e){
    console.log(transactionDetails)
    e.preventDefault();
    setTransactionDetails(prevTransactionDetails => {
      if(e.target.name === "recipient") return {...prevTransactionDetails, [e.target.name]: (e.target.value).toUpperCase()}
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
      <div className="modal-box bg-white">
        {error ? <div className="alert alert-error shadow-lg mb-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Recipient and amount cannot be empty!</span>
          </div>
        </div> : null}
        <form>
          <h1 className='font-bold text-2xl text-center text-gray-600'>New Transaction</h1>
          <div className='flex justify-center gap-2 my-2'>
            <button className={`btn btn-success w-6/12 font-bold 
              ${transactionDetails.transaction_type === "income" ? "text-white outline outline-white":null}`}
              value="income" name='transaction_type' onClick={handleChange}>Income</button>
            <button className={`btn btn-error w-6/12 font-bold 
              ${transactionDetails.transaction_type === "expense" ? "text-white outline outline-white":null}`}
              value="expense" name='transaction_type' onClick={handleChange}>Expense</button>
          </div>
          <div className="form-control flex flex-col w-full">
            <label className="input-group font-bold my-2">
              <span className='bg-gray-500 text-gray-300'>Recipient</span>
              <input type="text" placeholder="E.g. Shao Yang" value={transactionDetails.recipient}
                className="input input-bordered text-lg w-10/12 bg-gray-300 text-gray-900" name='recipient' onChange={handleChange}/>
            </label>
            <label className="input-group font-bold my-2">
              <span className='bg-gray-500 text-gray-300'>Amount</span>
              <input type="number" placeholder="SGD 0.00" value={transactionDetails.amount}
                className="input input-bordered text-lg w-10/12 bg-gray-300 text-gray-800" name='amount' onChange={handleChange}/>
            </label>
            <label className="input-group font-bold my-2">
              <span className='bg-gray-500 text-gray-300'>Method</span>
              <input type="text" placeholder="E.g. PayNow" value={transactionDetails.method}
                className="input input-bordered text-lg w-10/12 bg-gray-300 text-gray-800" name='method' onChange={handleChange}/>
            </label>
            <label className="input-group font-bold my-2">
              <span className='bg-gray-500 text-gray-300'>Account</span>
              <input type="text" placeholder="E.g. FRANK Account" value={transactionDetails.account}
                className="input input-bordered text-lg w-10/12 bg-gray-300 text-gray-800" name='account' onChange={handleChange}/>
            </label>
            <select 
              className={`select text-gray-300 w-full bg-gray-500
              border border-gray-500 font-bold text-xl my-2`}
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