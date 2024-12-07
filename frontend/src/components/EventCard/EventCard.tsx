import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

type EventCardProps = {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  ticketPrice: string;
  myEvent: boolean;
};

const EventCard = ({
  id,
  name,
  location,
  description,
  image,
  ticketPrice,
  myEvent,
}: EventCardProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="relative h-[32rem] sm:h-[30rem] flex flex-col border-neo border-neo-black bg-neo-white rounded-lg p-4 shadow-neo hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
      {/* Event Image */}
      <div
        className="h-48 sm:h-40 w-full mb-4 bg-cover bg-center rounded-lg border-neo border-neo-black overflow-hidden"
        style={{ backgroundImage: `url(${image})` }}
      >
        {!image && (
          <div className="flex items-center justify-center h-full text-neo-black/60 font-neo uppercase">
            No Image
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow">
        {/* Event Name */}
        <h2 className="text-xl sm:text-2xl font-neo-display text-neo-black mb-2 uppercase tracking-tight">{name}</h2>

        {/* Location */}
        <p className="text-sm font-neo text-neo-black mb-2 uppercase">
          📍 {location}
        </p>

        {/* Description */}
        <p className="text-neo-black/70 font-neo mb-4 line-clamp-3">{description}</p>

        {/* Price and Button - Now pushed to bottom */}
        <div className="mt-auto">
          <div className="flex flex-col gap-3">
            <p className="text-xl font-neo-display text-neo-black uppercase">
              {parseInt(ticketPrice) / 1000000000000000000} ETH
            </p>
            <button
              className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-primary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase tracking-wider"
              onClick={() => {
                if (myEvent) navigate(`${id}`);
                else
                  navigate(pathname.includes("events") ? `${id}` : `events/${id}`);
              }}
            >
              {!myEvent ? "Book Now" : "View Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
