const { default: axios } = require("axios");
const base64url = require("base64url");
const extractionRegex = require("./extractionRegex");
let accessToken = 
  "ya29.a0AWY7CkmF5WHjBK7RJGPz_8QDvRAkavqiOgsEMc7chkMp1Bo-31fqRzvPNqq_zbDCq3GzN4bTjpd20Sj7VGlaFzDUjmP4hdSXsrB7XGR_NEjFZ9hV1K8bzzJO8PYqLrDBA6Y82c_W9WmKCobHiirgaGHA7nNDvQaCgYKAa0SARASFQG1tDrp8sJiVwhpb0vOYfpTLMByBA0165"
// Step 1: Read through emails to find the EMAIL ID of the sample transaction detail emails
// Dario DBS sample id: 187212b5eff46beb
let sampleId = "187fadd8148be729";
function step1() {
  axios
    .get(
      "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=90",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    .then((res) => {
      for (const thread of res.data.threads) {
        axios
          .get(
            `https://gmail.googleapis.com/gmail/v1/users/me/threads/${thread.id}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          )
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
}

// Step 2: Find the subject of the sample email
let subject = 'Fwd: Transaction Alerts';
function step2(){
  axios
    .get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${sampleId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => {
      for (const message of res.data.messages) {
        const subject = message.payload.headers.find(
          (header) => header.name === "Subject"
        ).value;
        console.log(subject)
        const sender = message.payload.headers.find(
          (header) => header.name === "From"
        ).value;
        for (const supportedBanks of Object.keys(extractionRegex)) {
          if (sender.includes(supportedBanks)) {
            bankName = supportedBanks;
            console.log(bankName)
            break;
          }
        }
      }
    })
    .catch((err) => console.log(err));
}

// Step 3: Isolate this sample email and identify the location of its main contents
let location = 'message.payload.parts[0].body.data'
let emails = [];
async function step3() {
  axios
    .get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${sampleId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => {
      emails = res.data.messages;
      for (const message of res.data.messages) {
        function decodeBase64Url(str) {
          let buffer = Buffer.from(base64url.toBase64(str), "base64");
          buffer = buffer.toString("utf-8");
          return buffer;
        }
        console.log(decodeBase64Url(message.payload.parts[0].parts[0].body.data));
      }
    })
    .catch((err) => console.log(err));
}

// Step 4: Use find the regex needed to detect the necessary information
// Amount: /(?<=received ).*(?= on)/
// Date & Time: /(?<=on ).*(?= from)/
// From: /(?<=from )[A-Z\s]+(?= to)/
// To: /(?<=to )[\s\S]*(?= via)/
// Method: /(?<=via )\w*/
// Type: /received|sent/
function step4() {
  axios
    .get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${sampleId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((res) => {
      for (const message of res.data.messages) {
        function decodeBase64Url(str) {
          let buffer = Buffer.from(base64url.toBase64(str), "base64");
          buffer = buffer.toString("utf-8");
          return buffer;
        }
        let data = decodeBase64Url(message.payload.parts[0].parts[0].body.data);
        // data = data.replace(/[\r\n]/gm, ' ');
        // console.log(data.includes("your  account"))
        // console.log(data.match(/(?<=to )\w(?= via)/)[0])
        console.log(data.match(/sent money to\s+([\w\.\'\"]+\s+)+\busing/)[0])
      }
    })
    .catch((err) => console.log(err));
}
step4()
// Step 5: Add this new information into the extractionRegex.js

// Step 6: Test if the regexes can extract out the required information
let information = [];
async function step6(bankName) {
  await axios
    .get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${sampleId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then(res => {
      for(const message of res.data.messages){
        function decodeBase64Url(str) {
          let buffer = Buffer.from(base64url.toBase64(str), "base64");
          buffer = buffer.toString("utf-8");
          return buffer;
        }
        const emailBody = decodeBase64Url(
          extractionRegex[bankName][subject].emailBody(message)
        );
        for (const regexName of Object.keys(
          extractionRegex[bankName][subject]
        )) {
          if(typeof extractionRegex[bankName][subject][regexName] === "function"){
            continue
          }else{
            information.push(emailBody.match(
              extractionRegex[bankName][subject][regexName]
            )[0])
          }
        }
      }
      console.log(information);
    })
    .catch(err => console.log(err));
}

// Step 7: Create function to convert to an object
let strings = {
  'Amount': 'SGD 7.95',
  'Date & Time': '22 Mar 18:03 (SGT)',
  'From': 'LIM ZHEN YANG',
  'To': 'your\r\naccount',
  'Method': 'PayNow',
  'Type': 'received'
}
let outputObject = {};
async function step7 (inputString, regexName){
  switch(regexName){
    case "Date & Time": 
      const keyValue = inputString.split(' ');
      const dateDetails = keyValue.slice(0, 2);
      const timeDetails = keyValue.slice(2, 4);
      const currDate = new Date;
      const year = currDate.getFullYear();
      const month = new Date(Date.parse(dateDetails[1] + ` 1, ${year}`)).getMonth() + 1;
      const date = dateDetails[0];
      outputObject["Date_of_Transfer"] = `${year}-${month}-${date}`;
      
      let time = new Date(`1970-01-01 ${timeDetails[0]}`);
      let formattedTime = time.toLocaleTimeString("en-UK", { hour12: false });
      outputObject["Time_of_Transfer"] = formattedTime;
      break;
    case "To":
      const sentTo = inputString.replace(/\r\n/g, " ");
      outputObject[regexName] = sentTo;
      break;
    case "Type":
      if(inputString == "received"){
        outputObject[regexName] = "income";
      }else{
        outputObject[regexName] = "expense";
      }
      break;
    default:
      outputObject[regexName] = inputString;
  }
}
for(const key of Object.keys(strings)){
  step7(strings[key], key);
}
// console.log(outputObject)

// Step 8: Add this function to objectify.js