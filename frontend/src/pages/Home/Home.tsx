"use client";

import { useEffect, useState } from "react";

const events2 = [
  {
    name: "Fan Fest 2023",
    location: "Mumbai, India",
    description:
      "Join us for an exciting fan experience with music, games, and surprises!",
    image: "https://via.placeholder.com/300x200",
    ticketPrice: "500",
  },
  {
    name: "Comic Con 2023",
    location: "Bangalore, India",
    description:
      "Celebrate pop culture with comics, cosplay, and your favorite characters!",
    image: "https://via.placeholder.com/300x200",
    ticketPrice: "1000",
  },
  {
    name: "Music Fiesta",
    location: "Delhi, India",
    description:
      "Enjoy live performances by top artists in an electrifying atmosphere!",
    image: "https://via.placeholder.com/300x200",
    ticketPrice: "750",
  },
  {
    name: "Music Fiesta",
    location: "Delhi, India",
    description:
      "Enjoy live performances by top artists in an electrifying atmosphere!",
    image: "https://via.placeholder.com/300x200",
    ticketPrice: "750",
  },
];

const Home = () => {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEvents(events2);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents(events2);
      }
    };
    fetchEvents();
  }, []);

  return (
    <>
      <header className="inset-0 flex min-h-[80dvh] w-full flex-col items-center justify-center bg-bg dark:bg-darkBg bg-[linear-gradient(to_right,#80808033_1px,transparent_1px),linear-gradient(to_bottom,#80808033_1px,transparent_1px)] bg-[size:70px_70px]">
        <div className="mx-auto w-container max-w-full px-5 py-[110px] text-center lg:py-[150px]">
          <h1 className="text-5xl font-heading text-text dark:text-darkText md:text-4xl lg:text-9xl">
            Fanbase
          </h1>
          <p className="my-10 mt-4 font-base leading-relaxed text-text dark:text-darkText text-xl lg:leading-relaxed">
            Because Every Fan Matters.
            <br />
            Never Miss out on Concerts with our FanScores!
          </p>
        </div>
      </header>

      <section className="events w-full px-6 py-12 bg-bg dark:bg-darkBg border-t-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark">
        <h2 className="text-5xl font-heading text-text dark:text-darkText mb-4 mx-6">
          Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-8">
          {/* {events.map((event, index) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              location={event.location}
              description={event.description}
              image={event.image}
              ticketPrice={event.ticketPrice}
            />
          ))} */}

          {JSON.stringify(events)}
        </div>
      </section>
    </>
  );
};

export default Home;
