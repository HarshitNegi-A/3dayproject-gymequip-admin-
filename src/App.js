import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import Products from "./components/Products";
import Orders from "./components/Orders";

function App() {

  const router=createBrowserRouter([
    {
      path:'/',
      element: <HomePage/>
    },
    {
      path:'/products',
      element: <Products/>
    },
    {
      path:'/orders',
      element: <Orders/>
    },
  ])

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
