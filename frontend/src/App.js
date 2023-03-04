import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import BottomNavbar from './components/BottomNavbar';
import Home from './pages/Home';

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
      ]
    }
  ]);

  return (
    ReactDOM.createRoot(document.getElementById("root")).render(
      <RouterProvider router={router} />
    )
  );
}

export default App;
