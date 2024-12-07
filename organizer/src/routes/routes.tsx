import { createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import EventDetails from "../pages/EventDetails/EventDetails";
import MyEvents from "../pages/MyEvents/MyEvents";
import DistributeTickets from "../pages/DistributeTickets/DistributeTickets";
import CreateEvent from "../pages/CreateEvent/CreateEvent";
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
    path: "events/create",
    element: (
      <>
        <Navbar /> <CreateEvent />,
      </>
    ),
  },

  {
    path: "my-events/:eventId",
    element: (
      <>
        <Navbar /> <DistributeTickets />,
      </>
    ),
  },
]);

export default router;
