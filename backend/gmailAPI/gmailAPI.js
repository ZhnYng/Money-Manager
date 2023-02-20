const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const identifiers = require('./identifiers.json');
const base64url = require('base64url');
const express = require('express');

const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), './gmailAPI/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './gmailAPI/credentials.json');
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
// const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

// Decode a base64url-encoded string to a plaintext string
function decodeBase64Url(str) {
  let buffer = Buffer.from(base64url.toBase64(str), 'base64');
  buffer = buffer.toString('utf-8');
  return buffer
}

function stringToData(inputString){
  const keyValue = inputString.split(/:(.*)/s).map(str => str.trim());
  if(keyValue.length === 1){
    const keyValueSplit = keyValue[0].split(/(\s+)/).filter(function(str) {
      return /\S/.test(str);
    });
    const check = ["sent", "money", "to", "using"].map(x => {
      return keyValueSplit.includes(x);
    })
    if(check.every(v => v === true)){
      const outputObject = {};
      outputObject["PayNow name"] = keyValueSplit.slice(3, -1).join(' ');
      return outputObject
    }
  }else{
    const outputObject = {};
    outputObject[keyValue[0]] = keyValue[1];
    return outputObject;
  }
}

async function getTransactionDetails(auth, id) {
  const gmail = google.gmail({version: 'v1', auth});
  try {
    const res = await gmail.users.messages.get({ 
      userId: 'me', 
      id: id
    });
    return res;
  } catch(err) {
    return err;
  }
}

async function allThreads(auth) {
  const allRegex = {
    "Successful NETS Payment": {
      "Merchant Name": /Merchant Name\s+:\s+([^\n]+)\s/,
      "Date of Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time of Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "Account": /From your account\s+:\s+([^\n]+)\s/
    },
    "You have sent money via OCBC Pay Anyone": {
      "PayNow name": /PayNow name\s+:\s+([^\n]+)\s/,
      "Date of transfer": /Date of transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time of transfer": /Time of transfer\s+:\s+(\d+.\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "Account": /From your account\s+:\s+([^\n]+)\s/
    },
    "You have sent money via PayNow": {
      "You have sent money to": /sent money to\s+(\w+\s+)+\busing/,
      "Date of Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time of Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "Account": /From your account\s+:\s+([^\n]+)\s/
    }
  }
  const gmail = google.gmail({version: 'v1', auth});
  try {
    const res = await gmail.users.threads.list({
      userId: 'me', maxResults: 200
    });
    const allThreads = res.data.threads;
    if (!allThreads || allThreads.length === 0) {
      return 'No threads found.';
    } else {
      let allResponses = [];
      for (const thread of allThreads) {
        allResponses.push(getTransactionDetails(auth, thread.id));
      }
      allResponses = await Promise.all(allResponses)
      allResponses = allResponses.map((res) => {
        const headers = res.data.payload.headers;
        const subject = headers.find(header => header.name === 'Subject').value;
        if(Object.keys(allRegex).includes(subject)){
          let message;
          switch (subject) {
            case "You have sent money via PayNow":
              message = res.data.payload.parts[0].parts[0].body.data
              break;
            default:
              message = res.data.payload.body.data;
          }
          const data = decodeBase64Url(message)
          let details = {}
          for(const regexKey of Object.keys(allRegex[subject])){
            if(data.match(allRegex[subject][regexKey])){
              details = {...details, ...stringToData(data.match(allRegex[subject][regexKey])[0])}
            }
          }
          return details;
        }else{
          return null;
        }
      })
      allResponses = allResponses.filter(x => x != null);
      return allResponses;
    }
  } catch (err) {
    return err;
  }
}

const gmailAPI = {
  allTransactionDetails: async function() {
    const auth = await authorize();
    const value = await allThreads(auth);
    return value;
  }
}

module.exports = gmailAPI;