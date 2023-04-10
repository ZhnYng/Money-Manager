const base64url = require("base64url");
const extractionRegex = require("./extractionRegex");
const axios = require("axios");

// // Decode a base64url-encoded string to a plaintext string
function decodeBase64Url(str) {
  let buffer = Buffer.from(base64url.toBase64(str), "base64");
  buffer = buffer.toString("utf-8");
  return buffer;
}

function stringToData(inputString, regexName, subject) {
  const keyValue = inputString.split(/:(.*)/s).map((str) => str.trim());
  if (keyValue.length === 1) {
    // Runs when inputString is not an object type
    const keyValueSplit = keyValue[0]
      .split(/(\s+)/)
      .filter((str) => /\S/.test(str));
    if (subject == "You have sent money via PayNow") {
      const outputObject = {};
      outputObject["Recipient"] = keyValueSplit.slice(3, -1).join(" ");
      return outputObject;
    }
  } else {
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
  }
}

const gmailAPI = {
  getAllEmailMessages: async function (accessToken, callback) {
    // API call gets all the threads in your gmail
    // A thread is the collection of emails in the same category
    // It may or may not contain more than one email
    return axios
      .get(
        "https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=120",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(async (res) => {
        const allThreads = res.data.threads;
        if (!allThreads || allThreads.length === 0) {
          return callback("No threads found", null);
        } else {
          let allResponses = [];
          // In each thread, get the thread id and call the getAllThreadMessages
          // function to read the email contents of the thread
          for (const thread of allThreads) {
            allResponses.push(this.getDetails(accessToken, thread.id));
          }
          allResponses = await Promise.all(allResponses);
          // Filter out the emails with the transaction details
          allResponses = allResponses.map((res) => {
            let messages = [];
            try {
              for (const message of res.messages) {
                const headers = message.payload.headers;
                const subject = headers.find(
                  (header) => header.name === "Subject"
                ).value;
                if (Object.keys(extractionRegex).includes(subject)) {
                  const data = decodeBase64Url(
                    extractionRegex[subject].emailBody(message)
                  );
                  let details = {};
                  for (const regexKey of Object.keys(
                    extractionRegex[subject]
                  )) {
                    if (data.match(extractionRegex[subject][regexKey])) {
                      details = {
                        ...details,
                        ...stringToData(
                          data.match(extractionRegex[subject][regexKey])[0],
                          regexKey,
                          subject
                        ),
                      };
                    }
                  }
                  details = { Transaction_method: subject, ...details };
                  messages.push(details);
                } else {
                  messages.push(null);
                }
              }
            } catch {
              console.log(res.messages);
            }
            return messages;
          });
          allResponses = allResponses.flat();
          allResponses = allResponses.filter((x) => x != null);
          return callback(null, allResponses);
        }
      })
      .catch((err) => callback(err, null));
  },

  getDetails: async function (accessToken, id) {
    return axios
      .get(`https://gmail.googleapis.com/gmail/v1/users/me/threads/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (!res) console.log(`This thread is undefined ${id}`);
        else return res.data;
      })
      .catch((err) => {
        console.log(`This thread caused an error ${id}`);
        return err;
      });
  },

  getUserProfile: function (accessToken, callback) {
    axios
      .get("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        return callback(null, res.data.emailAddress);
      })
      .catch((err) => callback(err, null));
  },
};

module.exports = gmailAPI;
