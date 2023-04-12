const {PubSub} = require('@google-cloud/pubsub');
const {google} = require('googleapis');
const axios = require('axios');

// Set up OAuth2 client
let client;
let access_token;

async function initClient() {
  client = google.accounts.oauth2.initTokenClient({
    client_id: '430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com',
    scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/pubsub",
    callback: async (tokenResponse) => {
      access_token = tokenResponse.access_token;
      localStorage.setItem('access_token', access_token);
      
      // Create Pub/Sub topic and subscription
      const pubsub = new PubSub();
      const topicName = 'money';
      const subscriptionName = 'money-sub';

      // Create topic if it doesn't exist
      const [topic] = await pubsub.createTopic(topicName).catch(console.error);
      console.log(`Topic ${topicName} created or already exists.`);

      // Create subscription if it doesn't exist
      const [subscription] = await topic.createSubscription(subscriptionName).catch(console.error);
      console.log(`Subscription ${subscriptionName} created or already exists.`);

      // Get user profile information
      let profile = {};

      await axios.get(
        'https://gmail.googleapis.com/gmail/v1/users/me/profile',
        {headers: {Authorization: `Bearer ${access_token}`}}
      )
        .then(async res => {
          profile = {...profile, email: res.data.emailAddress};
          await axios.post('/addUser', {email: res.data.emailAddress})
            
            .then(res => console.log(res))
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));

      await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}})
        .then(res => {
          profile = {...profile, ...res.data}
        })
        .catch(err => console.log(err))
        
      localStorage.setItem('profile', JSON.stringify(profile));
      window.location.replace('/');
    },
  });
}

// Call initClient() function to start authentication flow

module.exports = { initClient };