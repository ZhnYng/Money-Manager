import axios from 'axios';
import React from 'react';
import Header from '../components/Header';
import TransferData from '../components/TransferData';
import CreateTransaction from '../components/CreateTransaction';
import { useNavigate } from 'react-router-dom';

export default function Home(){
  const navigate = useNavigate();
  const [changesMade, setChangesMade] = React.useState();
  const [transactionDetails, setTransactionDetails] = React.useState([{
    transaction_id: null,
    recipient: "No Transactions",
    amount: "SGD 0.00",
    date_of_transfer: "NaN",
    time_of_transfer: "NaN",
    category: "none"
  }]);

  React.useEffect(() => {
    if(!localStorage.getItem('access_token')) navigate('/login');
    // For syncing gmail transactions to DB
    /* global client */
    /* global access_token */
    const email = JSON.parse(localStorage.getItem('profile')).email;
    axios.get(`/getIdByUser/${email}`)
      .then(result => {
        const userId = result.data.user_id;
        // axios.put(`/gmailUpdateTransactions/${userId}/${email}`, [], 
        //   {headers: {authorization: `Bearer ${localStorage.getItem('access_token')}`}})
        //   .then((res) => {console.log(res); setChangesMade("new automated transaction added")})
        //   .catch((err) => {
        //     if(err.response.status === 401){
        //       localStorage.removeItem('access_token');
        //       localStorage.removeItem('profile');
        //       navigate('/login');
        //     }
        //     console.log('Data not synced')
        //   });
      })
      .catch(err => {console.log(err)});

    axios.post(`/syncRecurringToTransaction/${email}`)
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }, [navigate])

  return (
    <div className='bg-green-300 min-h-screen'>
      <Header setTransactionDetails={setTransactionDetails} changesMade={changesMade}/>
      <div className='flex flex-col items-center py-32'>
        {transactionDetails.map(detail => {
          if(detail.category === null || detail.category === "null"){
            detail.category = "none";
          }
          return <TransferData key={detail.transaction_id} details={detail} setChangesMade={setChangesMade}/>
        })}
      </div>
      <CreateTransaction setChangesMade={setChangesMade}/>
      <label htmlFor="create-transaction-modal" className="btn btn-circle fixed right-4 bottom-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </label>
    </div>
  )
}