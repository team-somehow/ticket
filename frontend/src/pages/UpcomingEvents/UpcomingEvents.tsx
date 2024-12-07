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

  if (loading) return (
    <div className="min-h-screen bg-neo-bg p-4">
      <div className="bg-neo-white border-neo border-neo-black p-6 rounded-lg shadow-neo animate-pulse">
        <p className="font-neo-display text-xl text-neo-black uppercase">Loading Events...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neo-bg p-4">
      <div className="bg-neo-primary border-neo border-neo-black p-6 rounded-lg shadow-neo">
        <p className="font-neo-display text-xl text-neo-black uppercase">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neo-bg p-4">
      {/* Header */}
      <div className="mb-6 bg-neo-primary border-neo border-neo-black p-6 rounded-lg shadow-neo">
        <h1 className="text-3xl sm:text-4xl font-neo-display text-neo-black uppercase tracking-tight">
          Upcoming Events
        </h1>
      </div>

      {/* Filters Container */}
      <div className="mb-8 bg-neo-white border-neo border-neo-black rounded-lg shadow-neo overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b-neo border-neo-black">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-3 bg-neo-bg border-neo border-neo-black rounded-lg font-neo text-neo-black placeholder-neo-black/50 focus:outline-none focus:bg-neo-white transition-all"
          />
        </div>

        {/* Location Filter */}
        <div className="p-4 border-b-neo border-neo-black">
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
            className="w-full px-4 py-3 bg-neo-bg border-neo border-neo-black rounded-lg font-neo text-neo-black uppercase focus:outline-none hover:bg-neo-white transition-all cursor-pointer"
          >
            <option value="">Select Location</option>
            {allLocations.map((location) => (
              <option key={location} value={location} className="uppercase">
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="font-neo text-neo-black uppercase text-sm">
                Price Range
              </label>
              <span className="font-neo-display text-neo-black">
                {filters.priceRange[1]} ETH
              </span>
            </div>
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
              className="w-full h-2 bg-neo-bg rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-neo-primary [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neo-black [&::-webkit-slider-thumb]:rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
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
      ) : (
        <div className="bg-neo-white border-neo border-neo-black p-6 rounded-lg shadow-neo">
          <p className="font-neo text-lg text-neo-black text-center">
            No events found
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;
