import React from 'react';
import axios from 'axios';

export default function TransferData({details}){
  const [category, setCategory] = React.useState(details.category)
  if(details.category === null || details.category === "null"){
    details.category = "none"
  }
  
  const categoryColors = {
    "none": {
      bgColor: "bg-green-500",
      textColor: "text-green-500",
    },
    "food": {
      bgColor: "bg-red-500",
      textColor: "text-red-500",
    },
    "entertainment": {
      bgColor: "bg-purple-500",
      textColor: "text-purple-500",
    },
    "apparel": {
      bgColor: "bg-orange-500",
      textColor: "text-orange-500",
    }
  }

  function handleCategory(e){
    setCategory(e.target.value)
  }

  function handleCategorySubmit(){
    axios.put(`/updateCategory/${details.transaction_id}/${category}`, [],
      {headers: {authorization: `Bearer ${localStorage.getItem('token')}`}})
      .then(result => console.log(result))
      .catch(err => console.log(err));
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
    <input type="checkbox" id={`transaction-modal-${details.transaction_id}`} className="modal-toggle" />
    <label htmlFor={`transaction-modal-${details.transaction_id}`} className="modal cursor-pointer">
      <div className={`card w-11/12 ${categoryColors[category]?.bgColor} text-white my-2`}>
        <div className="card-body">
          <div className='flex items-center justify-between'>
            <p className='text-2xl underline font-bold'>{details.recipient}</p>
          </div>
          <h2 className="card-title text-xl font-bold">Date: {convertDate(details.date_of_transfer)}</h2>
          <h2 className="card-title text-xl font-bold">Amount: {details.amount}</h2>
          <h2 className="card-title text-xl font-bold">Time: {details.time_of_transfer}</h2>
          <h2 className="card-title text-xl font-bold">Method: {details.method}</h2>
          <h2 className="card-title text-xl font-bold">Account: {details.account}</h2>
          <select 
            className={`select w-full max-w-xs ${categoryColors[category]?.textColor} 
              bg-white font-bold text-xl my-2`}
            value={category} 
            onChange={handleCategory}
            onBlur={handleCategorySubmit}
          >
            <option disabled value='none'>Select a category</option>
            <option value='food'>Food</option>
            <option value='entertainment'>Entertainment</option>
            <option value='apparel'>Apparel</option>
          </select>
        </div>
      </div>
    </label>
    <label htmlFor={`transaction-modal-${details.transaction_id}`}>
      <div className={`card w-96 ${categoryColors[category]?.bgColor} text-white my-2`}>
        <div className={`badge bg-white ${categoryColors[category]?.textColor} font-bold border-none self-end mt-2 mr-2`}>{category?.toUpperCase()}</div>
        <div className="card-body flex-row justify-between pt-0 grid-cols-12 grid">
          <div className='col-span-7'>
            <p className='text-xl font-bold'>{details.recipient}</p>
            <h2 className="card-title text-xl">{convertDate(details.date_of_transfer)}</h2>
          </div>
          <h2 className="card-title text-2xl font-bold col-span-5">{details.amount}</h2>
        </div>
      </div>
    </label>
    </>
  )
}