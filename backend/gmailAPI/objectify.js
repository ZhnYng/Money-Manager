const extractionRegex = require('../gmailAPI/extractionRegex');

const objectifyObj = {
  OCBC: {
    "Successful NETS Payment": function (extractionResults) {
      const outputObject = {};
      for(const [regexName, inputString] of Object.entries(extractionResults)){
        const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
        switch (regexName) {
          case "Date_of_Transfer":
            const dateString = keyValue[1];
            const dateParts = dateString.split(" "); // split the string into an array of ["21", "Feb", "2023"]
            const year = dateParts[2];
            const month =
              new Date(Date.parse(dateParts[1] + " 1, 2022")).getMonth() + 1; // convert the month name to a month number using Date.parse()
            const day = dateParts[0].padStart(2, "0"); // pad the day with a leading zero if necessary
            const formattedDate = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day}`;
            outputObject[regexName] = formattedDate;
            break;
          case "Time_of_Transfer":
            let timeString = keyValue[1].slice(0, -2) + " " + keyValue[1].slice(-2);
            timeString = timeString.replace(".", ":");
            let time = new Date(`1970-01-01 ${timeString}`);
            let formattedTime = time.toLocaleTimeString("en-Gb", { hour12: false });
            outputObject[regexName] = formattedTime;
            break;
          case "To":
            outputObject[regexName] = keyValue[1];
            const recipient = keyValue[1]
            if(recipient.toUpperCase().includes("YOUR ACCOUNT")){
              outputObject["Type"] = 'income';
            }else{
              outputObject["Type"] = 'expense';
            }
            break;
          default:
            outputObject[regexName] = keyValue[1];
        }
      }
      return outputObject;
    },

    "You have sent money via OCBC Pay Anyone": function (extractionResults) {
      const outputObject = {};
      for(const [regexName, inputString] of Object.entries(extractionResults)){
        const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
        switch (regexName) {
          case "Date_of_Transfer":
            const dateString = keyValue[1];
            const dateParts = dateString.split(" "); // split the string into an array of ["21", "Feb", "2023"]
            const year = dateParts[2];
            const month =
              new Date(Date.parse(dateParts[1] + " 1, 2022")).getMonth() + 1; // convert the month name to a month number using Date.parse()
            const day = dateParts[0].padStart(2, "0"); // pad the day with a leading zero if necessary
            const formattedDate = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day}`;
            outputObject[regexName] = formattedDate;
            break;
          case "Time_of_Transfer":
            let timeString = keyValue[1].slice(0, -2) + " " + keyValue[1].slice(-2);
            timeString = timeString.replace(".", ":");
            let time = new Date(`1970-01-01 ${timeString}`);
            let formattedTime = time.toLocaleTimeString("en-Gb", { hour12: false });
            outputObject[regexName] = formattedTime;
            break;
          case "To":
            outputObject[regexName] = keyValue[1];
            const recipient = keyValue[1]
            if(recipient.toUpperCase().includes("YOUR ACCOUNT")){
              outputObject["Type"] = 'income';
            }else{
              outputObject["Type"] = 'expense';
            }
            break;
          default:
            outputObject[regexName] = keyValue[1];
        }
      }
      return outputObject;
    },

    "You have sent money via PayNow": function (extractionResults) {
      const outputObject = {};
      for(const [regexName, inputString] of Object.entries(extractionResults)){
        const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
        switch (regexName) {
          case "To":
            const keyValueSplit = keyValue[0]
              .split(/(\s+)/)
              .filter((str) => /\S/.test(str));
              const recipient = keyValueSplit.slice(3, -1).join(" ");
              outputObject[regexName] = recipient;
  
            if(recipient.toUpperCase().includes("YOUR ACCOUNT")){
              outputObject["Type"] = 'income';
            }else{
              outputObject["Type"] = 'expense';
            }
            break;
          case "Date_of_Transfer":
            const dateString = keyValue[1];
            const dateParts = dateString.split(" "); // split the string into an array of ["21", "Feb", "2023"]
            const year = dateParts[2];
            const month =
              new Date(Date.parse(dateParts[1] + " 1, 2022")).getMonth() + 1; // convert the month name to a month number using Date.parse()
            const day = dateParts[0].padStart(2, "0"); // pad the day with a leading zero if necessary
            const formattedDate = `${year}-${month
              .toString()
              .padStart(2, "0")}-${day}`;
            outputObject[regexName] = formattedDate;
            break;
          case "Time_of_Transfer":
            let timeString = keyValue[1].slice(0, -2) + " " + keyValue[1].slice(-2);
            timeString = timeString.replace(".", ":");
            let time = new Date(`1970-01-01 ${timeString}`);
            let formattedTime = time.toLocaleTimeString("en-Gb", { hour12: false });
            outputObject[regexName] = formattedTime;
            break;
          default:
            outputObject[regexName] = keyValue[1];
        }
      }
      return outputObject;
    },
  },

  "DBS": {
  //   "iBanking Alerts": function(inputString, regexName){
  //     const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
  //     const outputObject = {};
  //     switch(regexName){
  //       case "Date & Time": 
  //         const dateDetails = keyValue[1].split(' ').slice(0, 2);
  //         const timeDetails = keyValue[1].split(' ').slice(2);
  //         const currDate = new Date;
  //         const year = currDate.getFullYear();
  //         const month = new Date(Date.parse(dateDetails[1] + ` 1, ${year}`)).getMonth() + 1;
  //         const date = dateDetails[0];
  //         outputObject["Date_of_Transfer"] = `${year}-${month}-${date}`;
          
  //         let time = new Date(`1970-01-01 ${timeDetails[0]}`);
  //         let formattedTime = time.toLocaleTimeString("en-Gb", { hour12: false });
  //         outputObject["Time_of_Transfer"] = formattedTime;
  //         break;
  //       case "Amount": 
  //         // Splits 'SGD10.00' to 'SGD 10.00'
  //         const spacedStr = keyValue[1].replace(/([a-zA-Z])(\d)/g, '$1 $2');
  //         outputObject["Amount"] = spacedStr;
  //         break;
  //       case "From": 
  //         outputObject["From"] = keyValue[1];
  //         break;
  //       case "To":
  //         const name = keyValue[1].split("(")[0].trim();
  //         outputObject["To"] = name;
  //         if(name.toUpperCase().includes("YOUR ACCOUNT")){
  //           outputObject["Type"] = 'income';
  //         }else{
  //           outputObject["Type"] = 'expense'
  //         }
  //         break;
  //     }
  //     return outputObject;
  //   },

    "Transaction Alerts": function (extractionResults) {
      const outputObject = {};
      for(const [key, value] of Object.entries(extractionResults)){
        switch (key) {
          case "Date & Time":
            const keyValue = value.split(' ');
            const dateDetails = keyValue.slice(0, 2);
            const timeDetails = keyValue.slice(2, 4);
            const currDate = new Date;
            const year = currDate.getFullYear();
            const month = new Date(Date.parse(dateDetails[1] + ` 1, ${year}`)).getMonth() + 1;
            const date = dateDetails[0];
            outputObject["Date_of_Transfer"] = `${year}-${month}-${date}`;
  
            let time = new Date(`1970-01-01 ${timeDetails[0]}`);
            let formattedTime = time.toLocaleTimeString("en-Gb", { hour12: false });
            outputObject["Time_of_Transfer"] = formattedTime;
            break;
          case "To":
            outputObject[key] = value;
            break;
          case "From":
            outputObject[key] = value;
            if(value.includes('PayLah! Wallet')){
              outputObject['Type'] = 'expense'
            }else{
              outputObject['Type'] = 'income'
            }
            break;
          case "Amount": 
            // Splits 'SGD10.00' to 'SGD 10.00'
            const spacedStr = value.replace(/([a-zA-Z])(\d)/g, '$1 $2');
            outputObject["Amount"] = spacedStr;
            break;
          case "Type":
            let type = ''
            value === 'received' ? type = 'income' : type = 'expense';
            outputObject[key] = type;
          default:
            outputObject[key] = value;
            break;
        }
      }
      console.log(outputObject)
      return outputObject;
    }
  }
}

function objectify(emailBody, bank, subject){
  let extractionResults = {}
  if(Object.keys(extractionRegex[bank][subject]).includes('extractionFunction')){
    let dataArray = extractionRegex[bank][subject].extractionFunction(emailBody)
    for(const data of dataArray){
      if(!data.includes(':')){
        extractionResults = {}
        break;
      }
      keyValueSplit = data.split(/:/);
      key = keyValueSplit.shift();
      value = keyValueSplit.join(':');
      extractionResults[key] = value;
    }
  }

  // If extraction function doesnt exist or did not work try regex
  if(Object.keys(extractionResults).length === 0){
    for(const [key, value] of Object.entries(extractionRegex[bank][subject])){
      if(typeof(key) === "string"){ // Regex string
        if (emailBody.match(value)) {
          extractionResults[key] = emailBody.match(value)[0]
        }
      }
    }
  }
  return objectifyObj[bank][subject](extractionResults)
}

module.exports = objectify;