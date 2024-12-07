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
    <div className="relative border-2 border-border bg-bg rounded-base p-4 shadow-light hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all">
      {/* Event Image */}
      <div
        className="h-40 w-full mb-4 bg-cover bg-center rounded-base border-2 border-border"
        style={{ backgroundImage: `url(${image})` }}
      >
        {!image && (
          <div className="flex items-center justify-center h-full text-text-muted">
            No Image
          </div>
        )}
      </div>

      {/* Event Name */}
      <h2 className="text-2xl font-heading text-text mb-2">{name}</h2>

      {/* Location */}
      <p className="text-sm font-base text-text-secondary mb-2">
        📍 {location}
      </p>

      {/* Description */}
      <p className="text-text-muted mb-4 line-clamp-2">{description}</p>

      {/* Price and Button */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-heading text-text">
          {parseInt(ticketPrice) / 1000000000000000000} ETH
        </p>
        <button
          className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
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
  );
};

export default EventCard;
