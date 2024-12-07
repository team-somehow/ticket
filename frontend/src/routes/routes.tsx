import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import UpcomingEvents from "../pages/UpcomingEvents/UpcomingEvents";
import EventDetails from "../pages/EventDetails/EventDetails";
import RedirectFromLocalStorage from "../components/RedirectFromLocalStorage/RedirectFromLocalStorage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Navbar /> <Home />
      </>
    ),
  },

  {
    path: "events",
    element: (
      <>
        <Navbar /> <UpcomingEvents />,
      </>
    ),
  },
  {
    path: "events/:eventId",
    element: (
      <>
        <Navbar /> <EventDetails />,
      </>
    ),
  },

  {
    path: "/redirect",
    element: <RedirectFromLocalStorage />,
  },
]);

export default router;
