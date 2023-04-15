import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import BottomNavbar from './components/BottomNavbar';
import Home from './pages/Home';
import Profile from "./pages/Profile";
import Account from "./pages/Settings/Account";
import Budget from "./pages/Settings/Budget";
import Notifications from "./pages/Settings/Notifications";
import Login from "./pages/Login";
import Statistics from "./pages/Statistics";
import NotFound from "./pages/NotFound";

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
      errorElement: <NotFound />,
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
