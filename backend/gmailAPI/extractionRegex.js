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
      "From": /From your account\s+:\s+([^\n]+)\s/,
      emailBody: message => message.payload.parts[0].parts[0].body.data
    },
  },

  "DBS": {
    // "iBanking Alerts": {
    //   "Date & Time": /Date & Time:\s+\d{2} [A-Z][a-z]{2} \d{2}:\d{2} \(SGT\)/,
    //   "Amount": /Amount:\s+SGD\d+.\d{2}/,
    //   "From": /From:\s+My Account A\/C ending \d{4}/,
    //   "To": /To:\s+[^()]+\s+\(Mobile no\. ending \d{4}\)/,
    //   emailBody: message => message.payload.parts[0].body.data
    // },
    // "Transaction Alerts": {
    //   // "Information type: DBS PayNow|DBS PayLah!"
    //   "Amount": /(?<=received )[\s\S]*(?= on)|(?<=Amount:\s)SGD\d+.\d{2}/,
    //   "Date & Time": /(?<=on )([a-zA-Z0-9\s\n\:\(\)]+)(?= from)|(?<=Date\s&\sTime:\s)\d{2} [A-Z][a-z]{2} \d{2}:\d{2} \(SGT\)/,
    //   "From": /(?<=from )[A-Z\s]+(?= to)|(?<=From:\s)PayLah!\sWallet\s\(Mobile\sending\s\d{4}\)/,
    //   "To": /(?<=to )([a-zA-Z0-9\s\n]+)(?= via)|(?<=To:\s)[a-zA-Z0-9\(\) ]+/,
    //   "Method": /(?<=via )\w*|(?<=From:\s)PayLah!/,
    //   "Type": /(?<=You have )[a-zA-Z]*|(?<=via )\w*|(?<=From:\s)PayLah!/,
    //   emailBody: message => message.payload.parts[0].body.data
    // }
    "Transaction Alerts": {
      'Amount': /(?<=received\s)[A-Z]+\s\d+[.]\d{2}(?= on)/,
      'Date & Time': /\d{1,2}\s+\w{3}\s+\s*\d{1,2}:\d{1,2}\s*\(\w+\)/,
      'From': /(?<=from )[A-Z\s]+(?= to)/,
      'To': /(?<=to )[\s\S]*(?= via)/,
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
        return data;
      },
      emailBody: message => message.payload.parts[1].body.data
    }
  }
}

module.exports = extractionRegex;