const base64url = require("base64url");
const extractionRegex = require("./extractionRegex");
const axios = require("axios");

const { google } = require("googleapis");
const pubsub = require("@google-cloud/pubsub");
const objectify = require("./objectify");

// Decode a base64url-encoded string to a plaintext string
function decodeBase64Url(str) {
  let buffer = Buffer.from(base64url.toBase64(str), "base64");
  buffer = buffer.toString("utf-8");
  return buffer;
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
            if (res.messages) {
              for (const message of res.messages) {
                const headers = message.payload.headers;

                // Getting bank name
                let bankName;
                try{
                  const sender = headers
                    .find((header) => header.name === "From")
                    .value.toUpperCase();
                  for (const supportedBanks of Object.keys(extractionRegex)) {
                    if (sender.includes(supportedBanks)) {
                      bankName = supportedBanks;
                      break;
                    }
                  }
                }catch{
                  console.log(`Bank name not found in:\n${message}`)
                }
                if (!bankName) break;

                // Getting email subject
                let subject;
                try{
                  emailSubject = headers.find(
                    (header) => header.name === "Subject"
                  ).value;
                  for (const supportedSubject of Object.keys(extractionRegex[bankName])) {
                    if (emailSubject === supportedSubject) {
                      subject = emailSubject
                    };
                  }
                }catch{
                  console.log(`Subject not found in:\n${message}`);
                }
                if (!subject) break;

                // Extraction layer
                if(extractionRegex[bankName][subject]){
                  const emailBody = decodeBase64Url(
                    extractionRegex[bankName][subject].emailBody(message)
                  );
                  let details = objectify(emailBody, bankName, subject)
                  details = { 
                    emailId: message.id, 
                    ...details,
                    category: 'none' 
                  };
                  messages.push(details);
                }
              }
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

  getGmailApi: async function (accessToken) {
    // Set up authentication
    const auth = new google.auth.GoogleAuth({
      scopes: [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/pubsub",
      ],
      credentials: {
        access_token: accessToken,
      },
    });
    const authClient = await auth.getClient();

    // Initialize the Gmail API client
    const gmail = google.gmail({ version: "v1", auth: authClient });

    // Set up the Cloud Pub/Sub topic and subscription
    const topicName = "my-topic";
    const subscriptionName = "my-subscription";
    const topic = pubsub.topic(topicName);
    const subscription = topic.subscription(subscriptionName);

    // Set up the mailbox change notification
    const userId = "me";
    const watchRequest = {
      labelIds: ["INBOX"],
      topicName: `projects/${projectId}/topics/${topicName}`,
      labelFilterAction: "include",
      expiration: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };
    const response = await gmail.users.watch({
      userId,
      requestBody: watchRequest,
    });

    // Listen for notifications on the subscription
    subscription.on("message", (message) => {
      const payload = message.data.toString();
      console.log(`Received message: ${payload}`);
      message.ack();
    });
  },
};

module.exports = gmailAPI;
