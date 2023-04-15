const { default: axios } = require("axios");
const base64url = require("base64url");
let accessToken =
  "ya29.a0Ael9sCP3q54_rFGXrr0IP6vp_Ti6mMMzAVSJo8F973FCTCpBFa5K-6srbtHbS6I34ZKkp9frdqBduQIBnwUQZcpN_yp4Dm6dd4zUBz62mugm0tffoXFYYMaFU7vQ9AHStGsu64loEnKG9ldu0m4Sbd_T_Mm7cgaCgYKAWYSARASFQF4udJhIR6TVI1mGVTWRqya1T5Bqg0165";

// Step 1: Read through emails to find the EMAIL ID of the sample transaction detail emails
// Dario DBS sample id: 187212b5eff46beb
let sampleId = "1871d4e203c35930";
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
        function decodeBase64Url(str) {
          let buffer = Buffer.from(base64url.toBase64(str), "base64");
          buffer = buffer.toString("utf-8");
          return buffer;
        }
        const subject = message.payload.headers.find(
          (header) => header.name === "Subject"
        ).value;
        console.log(subject)
      }
    })
    .catch((err) => console.log(err));
}

// Step 3: Isolate this sample email and identify the location of its main contents
let location = 'message.payload.parts[0].body.data'
function step3() {
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
        console.log(decodeBase64Url(message.payload.parts[0].body.data));
      }
    })
    .catch((err) => console.log(err));
}

// Step 4: Use find the regex needed to detect the necessary information
// Amount: /received\s\S+\s\d+(?:\.\d+)?/
// Date & Time: /on \d{1,2} \w{3} \d{2}:\d{2} \(\w{3}\)/
// From: /from [A-Z\s]+ to/
// Account: /\byour\saccount\b/
// Method: /via\s+\w+/
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
        let data = decodeBase64Url(message.payload.parts[0].body.data);
        console.log(data.match(/To:\s+[^()]+\s+\(Mobile no\. ending \d{4}\)/)[0])
      }
    })
    .catch((err) => console.log(err));
}
step4()

// Step 5: Add this new information into the extractionRegex.js