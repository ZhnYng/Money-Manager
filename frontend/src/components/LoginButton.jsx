import React from "react";
import axios from "axios";

function SignInButton() {
  React.useEffect(() => {
    var client;
    var access_token;
    function initClient() {
      client = google.accounts.oauth2.initTokenClient({
        client_id: "430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com",
        scope:
          "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile",
        callback: async (tokenResponse) => {
          console.log(access_token);
          access_token = tokenResponse.access_token;
          localStorage.setItem("access_token", access_token);
          // Get user profile information
          let profile = {};

          await axios
            .get("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then(async (res) => {
              profile = { ...profile, email: res.data.emailAddress };
              await axios
                .post("/addUser", { email: res.data.emailAddress })
                .then(async (res) => {
                  console.log(res);
                  await axios
                    .get(
                      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem(
                            "access_token"
                          )}`,
                        },
                      }
                    )
                    .then((res) => {
                      profile = { ...profile, ...res.data };
                      localStorage.setItem("profile", JSON.stringify(profile));
                      window.location.replace("/");
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        },
      });
    }

    initClient();
  }, []);

  function handleCallbackResponse(response) {
    console.log(response);
  }

  function handleSignInButtonClick() {
    google.accounts.id.prompt();
  }

  return (
    <div onClick={handleSignInButtonClick} className="btn btn-primary btn-lg">
      Sign in with Google
    </div>
  );
  }

export default SignInButton;
