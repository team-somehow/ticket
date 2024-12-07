import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import UpcomingEvents from "../pages/UpcomingEvents/UpcomingEvents";
import EventDetails from "../pages/EventDetails/EventDetails";
import RedirectFromLocalStorage from "../components/RedirectFromLocalStorage/RedirectFromLocalStorage";
import MyTickets from "../pages/MyTickets/MyTickets";
import MyEvents from "../pages/MyEvents/MyEvents";
import MyEventDetails from "../pages/MyEventDetails/MyEventDetails";
import Marketplace from "../pages/Marketplace/Marketplace";
import DistributeTickets from "../pages/DistributeTickets/DistributeTickets";
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
    path: "my-events",
    element: (
      <>
        <Navbar /> <MyEvents />,
      </>
    ),
  },

  {
    path: "my-events/:eventId",
    element: (
      <>
        <Navbar /> <MyEventDetails />,
      </>
    ),
  },

  {
    path: "/my-tickets",
    element: (
      <>
        <Navbar />
        <MyTickets />
      </>
    ),
  },

  {
    path: "/marketplace",
    element: (
      <>
        <Navbar /> <Marketplace />,
      </>
    ),
  },

  {
    path: "/redirect",
    element: <RedirectFromLocalStorage />,
  },
  {
    path: '/distribute/:eventId',
    element: (
        <>
        <Navbar/>
        <DistributeTickets/>
        </>
    )
  },
]);

export default router;
