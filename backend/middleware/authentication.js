const axios = require('axios');

const authenticateJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(authorization.split(' ')[0] === "Bearer"){
        axios.get('https://gmail.googleapis.com/gmail/v1/users/me/profile',
            {headers: {Authorization: `Bearer ${authorization.split(' ')[1]}`}})
            .then(res => {
                req.email = res.data.emailAddress;
                next();
            })
            .catch(err => {
                if(err.response.data.error.code === 401){
                    res.status(401).send("Invalid access token");
                }else{
                    // console.log(err);
                    res.status(500).send(err);
                }
            });
    }else{
        res.status(401).send("Invalid access token");
    }
};

module.exports = authenticateJWT;