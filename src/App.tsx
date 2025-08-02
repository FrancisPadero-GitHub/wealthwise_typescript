import { createBrowserRouter, RouterProvider } from "react-router";

// Pages imports
import Login from "./app/pages/auth/Login";
import Register from "./app/pages/auth/Register";
import PageNotFound from "./app/components/PageNotFound";

function App() {
  const router = createBrowserRouter ([
    // Default page
    {
      path: "/"
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "*",
      element: <PageNotFound/>
    }

  ])
  return (
    <RouterProvider router={router}/>
  );
}

export default App
