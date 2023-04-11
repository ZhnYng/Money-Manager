import React from 'react';
import axios from 'axios';

export default function TransferData({details, setChangesMade}){
  const [deleteTransaction, setDeleteTransaction] = React.useState(false);
  const [category, setCategory] = React.useState(details.category);
  
  const categoryColors = {
    "none": {
      bgColor: "bg-gray-200",
      textColor: "text-gray-700",
    },
    "food": {
      bgColor: "bg-red-500",
      textColor: "text-white",
    },
    "entertainment": {
      bgColor: "bg-purple-500",
      textColor: "text-white",
    },
    "apparel": {
      bgColor: "bg-orange-500",
      textColor: "text-white",
    }
  }

  function handleCategory(e){
    setCategory(e.target.value)
  }

  function handleCategorySubmit(){
    axios.put(`/updateCategory/${details.transaction_id}/${category}`, [],
      {headers: {authorization: `Bearer ${localStorage.getItem('access_token')}`}})
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  function handleDelete(){
    if(!deleteTransaction) {
      setTimeout(() => {
        setDeleteTransaction(true);
      }, 300)
    }
    else{

      axios.delete(`/deleteTransaction/${details.transaction_id}`, 
        {headers: {authorization: `Bearer ${localStorage.getItem('access_token')}`}})
        .then(result => {console.log(result); setChangesMade("transaction deleted")})
        .catch(err => console.log(err));
    }
  }

  function convertDate(date){
    if(date !== "NaN"){
      const dateParts = date.split('-');
      const monthIndex = parseInt(dateParts[1]) - 1;
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      const month = months[monthIndex];
      return `${dateParts[2]} ${month} ${dateParts[0]}`;
    }else{
      return "No transactions"
    }
  }

  return (
    <>
    {/* Start of transaction modal */}
    <input type="checkbox" id={`transaction-modal-${details.transaction_id}`} className="modal-toggle" />
    <label htmlFor={`transaction-modal-${details.transaction_id}`} className="modal cursor-pointer">
      <div className={`card w-10/12 bg-gray-700 text-white my-2 border-4 border-gray-200`}>
        <div className="card-body">
          <div className='flex items-center justify-between'>
            <p className='text-2xl underline font-bold'>{details.recipient}</p>
          </div>
          <h2 className="card-title text-xl font-bold">Date: {convertDate(details.date_of_transfer)}</h2>
          <h2 className="card-title text-xl font-bold">Amount: {details.transaction_type === "income" ? "+" : "-"}{details.amount}</h2>
          <h2 className="card-title text-xl font-bold">Time: {details.time_of_transfer}</h2>
          <h2 className="card-title text-xl font-bold">Method: {details.method}</h2>
          <h2 className="card-title text-xl font-bold">Account: {details.account}</h2>
          <select 
            className={`select w-full max-w-xs ${categoryColors[category]?.bgColor} 
              text-white border-2 border-white font-bold text-xl my-2`}
            value={category} 
            onChange={handleCategory}
            onBlur={handleCategorySubmit}
          >
            <option disabled value='none'>Select a category</option>
            <option value='food'>Food</option>
            <option value='entertainment'>Entertainment</option>
            <option value='apparel'>Apparel</option>
          </select>
          {(details.recorded_with === "MANUAL" || details.recorded_with === "RECURRING") && <button className="btn btn-error text-lg w-full border-2 border-red-900 self-end"
            onClick={handleDelete} onBlur={() => setDeleteTransaction(false)}
            >{deleteTransaction ? 'CONFIRM DELETE' : 'DELETE'}
          </button>}
        </div>
      </div>
    </label>
    {/* End of transaction modal */}
    <label htmlFor={`transaction-modal-${details.transaction_id}`} className='w-full flex justify-center'>
      <div className={`card w-10/12 bg-gray-700 text-white my-2 border-4 border-gray-200`}>
        <div className={`badge ${categoryColors[category]?.bgColor} ${categoryColors[category]?.textColor} font-bold border-none self-end mt-2 mr-2`}>{category?.toUpperCase()}</div>
        <div className="card-body flex-row justify-between pt-0 grid-cols-12 grid">
          <div className='col-span-6'>
            <p className='text-xl font-bold'>{details.recipient}</p>
            <h2 className="card-title text-xl">{convertDate(details.date_of_transfer)}</h2>
          </div>
          <h2 className="card-title text-xl font-bold col-span-6 text-center justify-self-center">{details.transaction_type === "income" ? "+" : "-"}{details.amount}</h2>
        </div>
      </div>
    </label>
    </>
  )
}