import React, { useState } from 'react';
import { FaPiggyBank, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

function Header({setTransactionDetails, statisticsIncome, statisticsExpenses, statisticsIncomeByYear, statisticsExpensesByYear, changesMade, swipe, setSwipe}) {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [income, setIncome] = React.useState('');
  const [expenses, setExpenses] = React.useState('');

  React.useEffect(() => {
    const email = JSON.parse(localStorage.getItem('profile')).email;
    axios.get(`/getIdByUser/${email}`)
      .then(result => {
        axios.get(
          `/getTransactions/${result.data.user_id}`, 
          {params: {period: `${(currentMonth+1).toString().padStart(2, '0')}-${currentYear}`}}
        )
          .then(result => {
            if(Array.isArray(result.data)){
              setTransactionDetails(result.data)
            } else {
              console.log(result)
              setTransactionDetails([{
                transaction_id: null,
                recipient: "No Transactions",
                amount: "SGD 0.00",
                date_of_transfer: "NaN",
                time_of_transfer: "NaN",
                category: "none",
                method: "NaN",
                account: "NaN"
              }])
            }
          })
          .catch(err => {
            console.log(err);
          });
        
        // Get expenses and income by month AND year
        axios.get(
          `/getExpenses/${result.data.user_id}`,
          {params: {month: `${(currentMonth+1).toString().padStart(2, '0')}`, year: currentYear}}
        )
          .then(result => {
            setExpenses(parseFloat(result.data[0].total_expenses))
            statisticsExpenses(parseFloat(result.data[0].total_expenses))
          })
          .catch(err => console.log(err));

        axios.get(
          `/getIncome/${result.data.user_id}`,
          {params: {month: `${(currentMonth+1).toString().padStart(2, '0')}`, year: currentYear}}
        )
          .then(result => {
            setIncome(parseFloat(result.data[0].total_income))
            statisticsIncome(parseFloat(result.data[0].total_income))
          })
          .catch(err => console.log(err));
          
        // Get expenses and income by year ONLY
        axios.get(
          `/getExpenses/${result.data.user_id}`,
          {params: {year: currentYear}}
        )
          .then(result => {
            statisticsExpensesByYear(parseFloat(result.data[0].total_expenses))
          })
          .catch(err => console.log(err));

        axios.get(
          `/getIncome/${result.data.user_id}`,
          {params: {year: currentYear}}
        )
          .then(result => {
            statisticsIncomeByYear(parseFloat(result.data[0].total_income))
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }, [currentMonth, currentYear, changesMade])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    if(currentMonth === 0){
      setCurrentMonth(11);
      setCurrentYear(prevYear => prevYear - 1);
    }else{
      setCurrentMonth(prevMonth => prevMonth - 1)
    }
  };

  const handleNextMonth = () => {
    if(currentMonth === 11){
      setCurrentMonth(0);
      setCurrentYear(prevYear => prevYear + 1);
    }else{
      setCurrentMonth(prevMonth => prevMonth + 1)
    }
  };

  React.useEffect(() => {
    if(swipe === 'left'){
      handleNextMonth();
      setSwipe(null);
    }else if(swipe === 'right'){
      handlePrevMonth();
      setSwipe(null);
    }
  }, [swipe])

  return (
    <div className="bg-green-500 rounded-b-3xl fixed top-0 w-full z-50">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center px-4">
          <div className="text-white">
            <FaPiggyBank size={40} />
          </div>
          <div className="text-2xl font-bold text-center flex-1">
            <div className="flex items-center justify-center">
              <div className="cursor-pointer text-white" onClick={handlePrevMonth}>
                <FaChevronLeft size={20} />
              </div>
              <h2 className="text-white px-4">
                {months[currentMonth]}
              </h2>
              <div className="cursor-pointer text-white" onClick={handleNextMonth}>
                <FaChevronRight size={20} />
              </div>
            </div>
          </div>
          <div className="text-lg font-bold">
            <h2 className="text-white">{currentYear}</h2>
          </div>
        </div>
        <div className="text-center text-2xl py-2">
          <div className={`font-bold ${parseFloat(income-expenses).toFixed(2) >= 0 ? 'text-white' : 'text-red-600'}`}>Remaining: ${parseFloat(income-expenses).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
