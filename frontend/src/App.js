import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import BottomNavbar from './components/BottomNavbar';
import Home from './pages/Home';
import Profile from "./pages/Profile";
import Account from "./pages/Settings/Account";
import Budget from "./pages/Settings/Budget";
import Notifications from "./pages/Settings/Notifications";
import Login from "./pages/Login";
import Statistics from "./pages/Statistics";


{/* <script>
    function initBaseURL(){
      axios.defaults.baseURL = 'https://money-manager-backend-no0w.onrender.com';
      // axios.defaults.baseURL = 'http://localhost:5000';
    }

    var client;
    var access_token;
    function initClient() {
      client = google.accounts.oauth2.initTokenClient({
        client_id: '430806173435-041j4g6133jfj4noqg676ppr6pkpdjg0.apps.googleusercontent.com',
        scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.profile",
        callback: async (tokenResponse) => {
          console.log(access_token)
          access_token = tokenResponse.access_token;
          localStorage.setItem('access_token', access_token);
          // Get user profile information
          let profile = {};

          await axios.get(
            'https://gmail.googleapis.com/gmail/v1/users/me/profile',
            {headers: {Authorization: `Bearer ${access_token}`}}
          )
            .then(async res => {
              profile = {...profile, email: res.data.emailAddress};
              await axios.post('/addUser', {email: res.data.emailAddress})
                .then(async res => {
                  console.log(res);
                  await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {headers: {Authorization: `Bearer ${localStorage.getItem('access_token')}`}})
                    .then(res => {
                      profile = {...profile, ...res.data}
                      localStorage.setItem('profile', JSON.stringify(profile))
                      window.location.replace('/');
                    })
                    .catch(err => console.log(err))
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        },
      });
    }
  </script> */}
  
function AppLayout(){
  return(
    <>
      <Outlet/>
      <BottomNavbar/>
    </>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      element: <AppLayout/>,
      children: [
        {
          path: "/",
          element: <Home />
        },
        {
          path: "/statistics",
          element: <Statistics />
        },
        {
          path: "/profile",
          element: <Profile />
        },
        {
          path: "/settings/budget",
          element: <Budget />
        },
        {
          path: "/settings/account",
          element: <Account />
        },
        {
          path: "/settings/notifications",
          element: <Notifications />
        },
      ],
    },
    {
      path: "/login",
      element: <Login />
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
