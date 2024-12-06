import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import UpcomingEvents from "../pages/UpcomingEvents/UpcomingEvents";

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
  // {
  //   path: "events/:eventId",
  //   element: (
  //     <>
  //       <Navbar /> <EventDetails />,
  //     </>
  //   ),
  // },
]);

export default router;
