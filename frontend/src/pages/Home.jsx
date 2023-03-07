import axios from 'axios';
import React from 'react';
import Header from '../components/Header';
import TransferData from '../components/TransferData';
import jwtDecode from 'jwt-decode';
import CreateTransaction from '../components/CreateTransaction';

export default function Home(){
  const [transactionDetails, setTransactionDetails] = React.useState([{
    transaction_id: null,
    recipient: "No Transactions",
    amount: "SGD 0.00",
    date_of_transfer: "NaN",
    time_of_transfer: "NaN",
    category: "none"
  }]);

  // React.useEffect(() => {
  //   axios.get(`/getIdByUser/${jwtDecode(localStorage.getItem('token')).email}`)
  //     .then(result => {
  //       axios.put(`/gmailUpdateTransactions/${result.data.user_id}`)
  //         .then((res) => console.log(res))
  //         .catch((err) => console.log('Data not synced'));
  //     })
  //     .catch(err => console.log(err));
  // }, [])

  return (
    <div className='bg-green-300 min-h-screen'>
      <Header setTransactionDetails={setTransactionDetails}/>
      <div className='flex flex-col items-center py-32'>
        {transactionDetails.map(detail => {
          return <TransferData key={detail.transaction_id} details={detail}/>
        })}
      </div>
      <CreateTransaction/>
      <label htmlFor="create-transaction-modal" className="btn btn-circle fixed right-4 bottom-24">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </label>
    </div>
  )
}