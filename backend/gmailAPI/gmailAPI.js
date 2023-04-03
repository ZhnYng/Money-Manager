const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const base64url = require('base64url');
const extractionRegex = require('./extractionRegex');
const axios = require('axios');

let oauth2Client = new google.auth.OAuth2(
  "430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com",
  "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",
  // "http://localhost:3000" //frontend url
  "https://moneymanagerclient.netlify.app/login" //frontend url
)

// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = path.join(process.cwd(), './gmailAPI/token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), './gmailAPI/credentials.json');
// // const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// // const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// /**
//  * Reads previously authorized credentials from the save file.
//  *
//  * @return {Promise<OAuth2Client|null>}
//  */
// async function loadSavedCredentialsIfExist(email) {
//   try {
//     const content = await fs.readFile(TOKEN_PATH);
//     const email_credentials = JSON.parse(content);
//     for await (const email_credential of email_credentials){
//       if(email_credential.email === email){
//         delete email_credential.email;
//         return google.auth.fromJSON(email_credential);
//       }
//     }
//   } catch (err) {
//     return null;
//   }
// }

// /**
//  * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
//  *
//  * @param {OAuth2Client} client
//  * @return {Promise<void>}
//  */
// async function saveCredentials(client, email) {
//   const content = await fs.readFile(CREDENTIALS_PATH);
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = {
//     email: email,
//     type: 'authorized_user',
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   };
//   try{
//     const token_content = await fs.readFile(TOKEN_PATH);
//     const user_credentials = JSON.parse(token_content);
//     const fileContent = JSON.stringify([...user_credentials, payload]);
//     await fs.writeFile(TOKEN_PATH, fileContent);
//   } catch (err) {
//     const fileContent = JSON.stringify([payload]);
//     await fs.writeFile(TOKEN_PATH, fileContent);
//   }
// }

// /**
//  * Load or request or authorization to call APIs.
//  *
//  */
// async function authorize(email) {
//   let client = await loadSavedCredentialsIfExist(email);
//   if (client) {
//     return client;
//   }
//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH
//   });
//   if (client.credentials) {
//     await saveCredentials(client, email);
//   }
//   return client;
// }

// /**
//  * Lists the labels in the user's account.
//  *
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */

// // Decode a base64url-encoded string to a plaintext string
function decodeBase64Url(str) {
  let buffer = Buffer.from(base64url.toBase64(str), 'base64');
  buffer = buffer.toString('utf-8');
  return buffer
}

function stringToData(inputString, regexName, subject){
  const keyValue = inputString.split(/:(.*)/s).map(str => str.trim());
  if(keyValue.length === 1){ // Runs when inputString is not an object type
    const keyValueSplit = keyValue[0].split(/(\s+)/).filter((str) => /\S/.test(str));
    if(subject == "You have sent money via PayNow"){
      const outputObject = {};
      outputObject["Recipient"] = keyValueSplit.slice(3, -1).join(' ');
      return outputObject;
    }
  }else{
    const outputObject = {};
    switch(regexName){
      case "Date_of_Transfer":
        const dateString = keyValue[1];
        const dateParts = dateString.split(" "); // split the string into an array of ["21", "Feb", "2023"]
        const year = dateParts[2];
        const month = new Date(Date.parse(dateParts[1] + " 1, 2022")).getMonth() + 1; // convert the month name to a month number using Date.parse()
        const day = dateParts[0].padStart(2, "0"); // pad the day with a leading zero if necessary
        const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day}`;
        outputObject[regexName] = formattedDate;
        break;
      case "Time_of_Transfer":
        let timeString = keyValue[1].slice(0, -2) + ' ' + keyValue[1].slice(-2);
        timeString = timeString.replace('.', ':')
        let time = new Date(`1970-01-01 ${timeString}`);
        let formattedTime = time.toLocaleTimeString("en-UK", {hour12: false});
        outputObject[regexName] = formattedTime;
        break;
      default:
        outputObject[regexName] = keyValue[1];
    }
    return outputObject;
  }
}

function getTransactionDetails(accessToken, id) {
  // const gmail = google.gmail({version: 'v1', auth});
  return axios.get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${id}`, {headers: {Authorization: `Bearer ${accessToken}`}})
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    })
  // try {
  //   // const res = await gmail.users.threads.get({ 
  //   //   userId: 'me', 
  //   //   id: id
  //   // });
  //   // function decodeBase64Url(str) {
  //   //   let buffer = Buffer.from(base64url.toBase64(str), 'base64');
  //   //   buffer = buffer.toString('utf-8');
  //   //   return buffer
  //   // }
  //   // console.log(decodeBase64Url(res.data.messages[0].payload.parts[0].body.data))
  //   return res;
  // } catch(err) {
  //   return err;
  // }
}

async function allThreads(accessToken) {
  return axios.get('https://gmail.googleapis.com/gmail/v1/users/me/threads', {headers: {Authorization: `Bearer ${accessToken}`}})
    .then(async res => {
      const allThreads = res.data.threads;
      if (!allThreads || allThreads.length === 0) {
        return 'No threads found.';
      } else {
        let allResponses = [];
        for (const thread of allThreads) {
          allResponses.push(getTransactionDetails(accessToken, thread.id));
        }
        allResponses = await Promise.all(allResponses)
        allResponses = allResponses.map((res) => {
          let messages = [];
          for(const message of res.data.messages){
            const headers = message.payload.headers;
            const subject = headers.find(header => header.name === 'Subject').value;
            if(Object.keys(extractionRegex).includes(subject)){
              const data = decodeBase64Url(extractionRegex[subject].emailBody(message));
              let details = {};
              for(const regexKey of Object.keys(extractionRegex[subject])){
                if(data.match(extractionRegex[subject][regexKey])){
                  details = {...details, ...stringToData(data.match(extractionRegex[subject][regexKey])[0], regexKey, subject)};
                }
              }
              details = {"Transaction_method": subject, ...details};
              messages.push(details);
            }else{
              messages.push(null);
            }
          }
          return messages;
        })
        allResponses = allResponses.flat();
        allResponses = allResponses.filter(x => x != null);
        return allResponses;
      }
    })
    .catch(err => console.log(err));

  // const gmail = google.gmail({version: 'v1', auth});
  // try {
    // const res = await gmail.users.threads.list({
    //   userId: 'me', maxResults: 220
    // });
  // } catch (err) {
  //   return err;
  // }
}

const gmailAPI = {
  getAuthToken: async function(code, callback){
    console.log({code: code})
    let { tokens } = await oauth2Client.getToken(code);
    console.log({tokens: tokens})
    if (tokens){
      oauth2Client.setCredentials(tokens)
      return callback(null, tokens);
    }else{
      return callback("Error", null);
    }
  },

  allTransactionDetails: async function(accessToken) {
    const value = await allThreads(accessToken);
    return value;
  },

  getDetails: async function(id){
    const value = await getTransactionDetails(client, id);
    return value;
  }
}

module.exports = gmailAPI;