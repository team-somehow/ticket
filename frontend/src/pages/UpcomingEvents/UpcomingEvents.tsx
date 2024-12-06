"use client";

import React, { useEffect, useState } from "react";
import EventCard from "../../components/EventCard/EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import useEvents from "../../hooks/get/events/useEvents";

type Event = {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  ticketPrice: number;
};

const weiToEther = (wei: string) => {
  return (parseInt(wei) / Math.pow(10, 18)).toFixed(4); // Converts WEI to ETH and formats it
};

const allLocations = [
  "Mumbai",
  "Ahmedabad",
  "Bangalore",
  "Delhi",
  "Kolkata",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Goa",
];

const UpcomingEvents = () => {
  const { events, loading, error } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 1],
  });

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Handle filters
  const handleFilterChange = (
    key: "location" | "priceRange",
    value: string | [number, number]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  // Filtered Events
  const filteredEvents = events.filter((event) => {
    const matchesName = event.name.toLowerCase().includes(searchQuery);
    const matchesLocation =
      !filters.location ||
      event.location.toLowerCase() === filters.location.toLowerCase();
    const priceRangeInWei = filters.priceRange.map((price) =>
      (price * Math.pow(10, 18)).toString()
    );
    const matchesPrice =
      parseInt(event.ticketPrice.toString()) >= parseInt(priceRangeInWei[0]) &&
      parseInt(event.ticketPrice.toString()) <= parseInt(priceRangeInWei[1]);
    console.log(event.ticketPrice, filters.priceRange);

    console.log(matchesName, matchesLocation, matchesPrice);

    return matchesName && matchesLocation && matchesPrice;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-bg dark:bg-darkBg py-8 px-8">
      <h1 className="text-5xl font-heading text-text dark:text-darkText mb-7">
        Upcoming Events
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by event name..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full px-4 py-2 border-2 border-border dark:border-darkBorder rounded-base bg-bg dark:bg-darkBg text-text dark:text-darkText shadow-light dark:shadow-dark focus:outline-none focus:border-main"
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Location Filter */}
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-4 py-4 border-2 border-border dark:border-darkBorder rounded-base bg-bg dark:bg-darkBg text-text dark:text-darkText shadow-light dark:shadow-dark focus:outline-none focus:border-main"
          >
            <option value="">Filter by location</option>
            {allLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="relative">
          <div className="bg-bg dark:bg-darkBg py-4 border-2 border-border dark:border-darkBorder rounded-base shadow-light dark:shadow-dark flex items-center">
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={filters.priceRange[1] * 10}
              onChange={(e) =>
                handleFilterChange("priceRange", [
                  0,
                  parseInt(e.target.value, 10) / 10,
                ])
              }
              className="w-full ml-4"
            />
            <p className="w-full ml-4 text-text dark:text-darkText">
              Max Price: {filters.priceRange[1]} ETH
            </p>
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.name}
            location={event.location}
            description={event.description}
            image={event.image}
            ticketPrice={event.ticketPrice.toString()}
            myEvent={false}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
