import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import Cryptocurrencies from "../pages/Cryptocurrencies/Cryptocurrencies";
import { individualsRoutes } from "../pages/Individuals/individualsRoutes";
import { businessesRoutes } from "../pages/Businesses/businessesRoutes";
import SignUp from "../pages/SignUp/SignUp";
import SignIn from "../pages/SignIn/SignIn";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "cryptocurrencies", element: <Cryptocurrencies /> },
      { path: "signup", element: <SignUp /> },
      { path: "signin", element: <SignIn /> },
      ...individualsRoutes,
      ...businessesRoutes,
    ],
  },
]);

export default router;

