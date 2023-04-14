// case "Fwd: iBanking Alerts":
//   switch (keyValue[0]) {
//     case 'Date & Time':
//       let outputObject = {};

//       // Getting the date
//       let dateParts = keyValue[1].split(' ');
//       const date = dateParts[0];
//       const month = new Date(Date.parse(dateParts[1] + " 1, 2022")).getMonth() + 1;
//       const year = Date.getFullYear();
//       console.log(`${year}-${month}-${date}`)
//       outputObject = {...outputObject, "Date_of_Transfer": `${year}-${month}-${date}`}
      
//       // Getting the time
//       let dbsTimestamp = keyValue[2];
//       let time = new Date(`1970-01-01 ${dbsTimestamp}`);
//       let formattedTime = time.toLocaleTimeString("en-UK", { hour12: false });
//       outputObject = {...outputObject, "Time_of_Transfer": formattedTime};
//       return outputObject
//   }

const objectify = {
  OCBC: {
    "Successful NETS Payment": function (inputString, regexName, subject) {
      const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
      const outputObject = {};
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
          let formattedTime = time.toLocaleTimeString("en-UK", { hour12: false });
          outputObject[regexName] = formattedTime;
          break;
        default:
          outputObject[regexName] = keyValue[1];
      }
      return outputObject;
    },

    "You have sent money via OCBC Pay Anyone": function (inputString, regexName, subject) {
      const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
      const outputObject = {};
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
          let formattedTime = time.toLocaleTimeString("en-UK", { hour12: false });
          outputObject[regexName] = formattedTime;
          break;
        default:
          outputObject[regexName] = keyValue[1];
      }
      return outputObject;
    },

    "You have sent money via PayNow": function (inputString, regexName, subject) {
      const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
      const outputObject = {};
      switch (regexName) {
        case "Recipient":
          const keyValueSplit = keyValue[0]
            .split(/(\s+)/)
            .filter((str) => /\S/.test(str));
            outputObject[regexName] = keyValueSplit.slice(3, -1).join(" ");
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
          let formattedTime = time.toLocaleTimeString("en-UK", { hour12: false });
          outputObject[regexName] = formattedTime;
          break;
        default:
          outputObject[regexName] = keyValue[1];
      }
      return outputObject;
    },
  },

  DBS: {
    "Transaction Alerts": function(inputString, regexName){
      const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
      const outputObject = {};
      switch(regexName){
        case "Date & Time": 
          const dateDetails = keyValue[1].split(' ').slice(0, 2);
          const timeDetails = keyValue[1].split(' ').slice(2);
          const currDate = new Date;
          const year = currDate.getFullYear();
          const month = new Date(Date.parse(dateDetails[1] + ` 1, ${year}`)).getMonth() + 1;
          const date = dateDetails[0];
          outputObject["Date_of_Transfer"] = `${year}-${month}-${date}`;
          
          let time = new Date(`1970-01-01 ${timeDetails[0]}`);
          let formattedTime = time.toLocaleTimeString("en-UK", { hour12: false });
          outputObject["Time_of_Transfer"] = formattedTime;
          break;
        case "Amount": 
          // Splits 'SGD10.00' to 'SGD 10.00'
          const spacedStr = keyValue[1].replace(/([a-zA-Z])(\d)/g, '$1 $2');
          outputObject["Amount"] = spacedStr;
          break;
        case "Account": 
          outputObject["Account"] = keyValue[1];
          break;
        case "Recipient":
          const name = keyValue[1].split("(")[0].trim();
          outputObject["Recipient"] = name;
          break;
      }
      return outputObject;
    }
  }
}

module.exports = objectify;