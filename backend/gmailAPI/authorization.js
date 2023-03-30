const {google} = require('googleapis');

const authorization = {
    oauth2Client : new google.auth.OAuth2(
        "430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com",
        "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",
        // "http://localhost:3000" //frontend url
        "https://moneymanagerclient.netlify.app/" //frontend url
    ),
      
    getToken: async function(code, callback){
        let { tokens } = await this.oauth2Client.getToken(code);
        if(tokens){
            this.oauth2Client.setCredentials(tokens)
            return callback(null, tokens);
        }else{
            return callback("Token failed", null);
        }
    }
}

module.exports = authorization;