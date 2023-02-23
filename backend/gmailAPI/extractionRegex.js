// This file contains all the regex expressions used to extract useful data out of each type of email
// The keys are the subject/title of the email
// emailbody is the location of the email body based on the returned email details from the gmailAPI 
//    this is because each type of email has its own body location

const extractionRegex = {
  "Successful NETS Payment": {
    "Recipient": /Merchant Name\s+:\s+([^\n]+)\s/,
    "Date of Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
    "Time of Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
    "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
    "Account": /From your account\s+:\s+([^\n]+)\s/,
    emailBody: res => res.data.payload.body.data
  },
  "You have sent money via OCBC Pay Anyone": {
    "Recipient": /PayNow name\s+:\s+([^\n]+)\s/,
    "Date of Transfer": /Date of transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
    "Time of Transfer": /Time of transfer\s+:\s+(\d+.\d+\w+)\s/,
    "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
    "Account": /From your account\s+:\s+([^\n]+)\s/,
    emailBody: res => res.data.payload.body.data
  },
  "You have sent money via PayNow": {
    "Recipient": /sent money to\s+(\w+\s+)+\busing/,
    "Date of Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
    "Time of Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
    "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
    "Account": /From your account\s+:\s+([^\n]+)\s/,
    emailBody: res => res.data.payload.parts[0].parts[0].body.data
  }
}

module.exports = extractionRegex;