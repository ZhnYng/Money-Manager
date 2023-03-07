import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import BottomNavbar from './components/BottomNavbar';
import Home from './pages/Home';
import Profile from "./pages/Profile";
import Budget from "./pages/Settings/Budget";
import Statistics from "./pages/Statistics";

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
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
