// This file contains all the regex expressions used to extract useful data out of each type of email
// The keys are the subject/title of the email
// emailbody is the location of the email body based on the returned email details from the gmailAPI 
//    this is because each type of email has its own body location

const extractionRegex = {
  OCBC: {
    "Successful NETS Payment": {
      "Recipient": /Merchant Name\s+:\s+([^\n]+)\s/,
      "Date_of_Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time_of_Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "Account": /From your account\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.body.data
    },
    "You have sent money via OCBC Pay Anyone": {
      "Recipient": /PayNow name\s+:\s+([^\n]+)\s/,
      "Date_of_Transfer": /Date of transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time_of_Transfer": /Time of transfer\s+:\s+(\d+.\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "Account": /From your account\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.body.data
    },
    "You have sent money via PayNow": {
      "Recipient": /sent money to\s+([\w\.]+\s+)+\busing/,
      "Date_of_Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time_of_Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "Account": /From your account\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.parts[0].parts[0].body.data
    },
  },

  DBS: {
    "Transaction Alerts": {
      "Date & Time": /Date & Time:\s+\d{2} [A-Z][a-z]{2} \d{2}:\d{2} \(SGT\)/,
      "Amount": /Amount:\s+SGD\d+\.\d+/,
      "Account": /From:\s+My Account A\/C ending \d{4}/,
      "Recipient": /To:\s+[^()]+\s+\(Mobile no\. ending \d{4}\)/,
      emailBody: message => message.payload.parts[0].body.data
    }
  }
}

module.exports = extractionRegex;