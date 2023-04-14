const { default: axios } = require("axios");
const base64url = require("base64url");
let accessToken =
  "ya29.a0Ael9sCPJBva7LYVOG7r-cJ0mZw6z3UebMVVdEC-IpGqOO-bXatGqIdV-kqZQj_qO-q1_VlNHEJudxdY_t_dxi1qRWTqdZdaLyhxEVAEsbTQAE4lNIDbPISMhM1uFH5krc_zfU7NN6R-xnHs62L05pStMl9KYJAaCgYKAX8SARASFQF4udJhRF4lzQah4dWJTQ-p8od97g0165";

// Step 1: Read through emails to find the EMAIL ID of the sample transaction detail emails
// Dario DBS sample id: 187212b5eff46beb
let sampleId = "187212b5eff46beb";
function step1() {
  axios
    .get(
      "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=70",
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
let subject = 'Fwd: iBanking Alerts';
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
// Date & Time regex: /Date & Time:\s+\d{2} [A-Z][a-z]{2} \d{2}:\d{2} \(SGT\)/
// Amount regex: /Amount:\s+SGD\d+\.\d+/
// From regex: /From:\s+My Account A\/C ending \d{4}/
// To regex: /To:\s+[^()]+\s+\(Mobile no\. ending \d{4}\)/
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

// Step 5: Add this new information into the extractionRegex.js
step4()