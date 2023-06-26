// This file contains all the regex expressions used to extract useful data out of each type of email
// The keys are the subject/title of the email
// emailbody is the location of the email body based on the returned email details from the gmailAPI 
//    this is because each type of email has its own body location
const cheerio = require('cheerio');

const extractionRegex = {
  OCBC: {
    "Successful NETS Payment": {
      "To": /Merchant Name\s+:\s+([^\n]+)\s/,
      "Date_of_Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time_of_Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "From": /From your account\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.body.data
    },
    "You have sent money via OCBC Pay Anyone": {
      "To": /PayNow name\s+:\s+([^\n]+)\s/,
      "Date_of_Transfer": /Date of transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time_of_Transfer": /Time of transfer\s+:\s+(\d+.\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "From": /From your account\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.body.data
    },
    "You have sent money via PayNow": {
      "To": /sent money to\s+([\w\.\'\"]+\s+)+\busing/,
      "Date_of_Transfer": /Date of Transfer\s+:\s+(\d+\s\w+\s\d{4})\s/,
      "Time_of_Transfer": /Time of Transfer\s+:\s+(\d+:\d+\w+)\s/,
      "Amount": /Amount\s+:\s+(SGD\s[\d.]+)\s/,
      "From": /From your account\s+:\s+([^\n]+)\s|From Account No.\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.parts[0].parts[0].body.data
    },
  },

  "DBS": {
    "iBanking Alerts": {
      "Date & Time": /\d{1,2}\s+\w{3}\s+\s*\d{1,2}:\d{1,2}\s*\(\w+\)/,
      "Amount": /(?<=Amount:)\s*\bSGD\s*\d+\.\d{2}\b/,
      "From": /(?<=From:)[\s\S]*?(?=\n)/,
      "To": /(?<=To: )[\s\S]*?(?=\n)/,
      'Method': /\bPayNow\b/,
      emailBody: message => message.payload.body.data
      // emailBody: message => message.payload.parts[0].body.data // This is the path to the email body in testing
    },
    "Transaction Alerts": {
      'Amount': /(?<=received\s)[A-Z]+\s\d+[.]\d{2}(?= on)/,
      'Date & Time': /\d{1,2}\s+\w{3}\s+\s*\d{1,2}:\d{1,2}\s*\(\w+\)/,
      'From': /(?<=from )[A-Z\s]+(?= to)/,
      'To': /(?<=\bto\b )[^#]*(?= via)/,
      'Method': /(?<=via )\w*/,
      "Type": /(?<=You\shave\s)(received|sent)/,
      extractionFunction: emailBody => {
        const $ = cheerio.load(emailBody);
        $.html();
        allData = [];
        $('tr').each(function(i, tr){
          var tr = $(tr).text();
          allData.push(tr);
        })
        data = allData.splice(-4);
        console.log('extractionFunction:', data)
        return data;
      },
      emailBody: message => message.payload.parts[0].body.data
      // emailBody: message => message.payload.parts[1].body.data // This is the path to the email body in testing
    }
  }
}

module.exports = extractionRegex;