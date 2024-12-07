"use client";

import { collection, doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../lib/firebase.config";
import axios from "axios";
import { firebaseFunctionBaseUrl } from "../../constants/constants";
import useUserAccount from "../../hooks/account/useUserAccount";

export default function CreateEvent() {
  const { address } = useUserAccount();
  const [formData, setFormData] = useState({
    name: "Cold Play Tour",
    symbol: "CPT",
    ticketPrice: "1000000000000000",
    maxResalePrice: "10000000000000000",
    royaltyReceiver: "0x0Dd7D7Ad21d15A999dcc7218E7Df3F25700e696f",
    royaltyFeeNumerator: "500",
    baseTokenURI: "https://example.com/metadata/",
    minFanScore: "50",
    totalTickets: "5",
    // stakeAmount: "",
    city: "New Delhi",
    description: "Coldplay are a British rock band formed in London in 1997. ",
    ticketsToSell: "5",
    date: "2024-12-28T21:30",
    artist: "Coldplay",
    image:
      "https://images.hdqwalls.com/download/coldplay-band-wallpaper-3840x2160.jpg",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    try {
      setLoading(true);

      const eventsRef = collection(db, "events");
      await setDoc(doc(eventsRef), {
        ...formData,
        location: formData.city,
        stakeAmount: formData.ticketPrice,
        owner: address,
        contractAddress: null,
      });
      setLoading(false);

      // Call the Firebase function to create the contract
      await axios.get(`${firebaseFunctionBaseUrl}/createContract`);
    } catch (error) {
      console.error("Error creating event:", error);
      setLoading(false);
    }
  };

  if (loading) {
    <div className="text-center text-2xl font-bold py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-yellow-100 p-8 border-4 border-black rounded-md shadow-lg hover:shadow-xl transition-shadow space-y-6"
      >
        <h1 className="text-3xl font-bold text-black text-center">
          Create Event
        </h1>

        {/* Event Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter event name"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Symbol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Symbol
          </label>
          <input
            type="text"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            placeholder="Enter symbol"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Ticket Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ticket Price (in WEI)
          </label>
          <input
            type="text"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder="Enter ticket price"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Max Resale Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Resale Price (in WEI)
          </label>
          <input
            type="text"
            name="maxResalePrice"
            value={formData.maxResalePrice}
            onChange={handleChange}
            placeholder="Enter max resale price"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Royalty Receiver */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Royalty Receiver Address
          </label>
          <input
            type="text"
            name="royaltyReceiver"
            value={formData.royaltyReceiver}
            onChange={handleChange}
            placeholder="Enter royalty receiver address"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Royalty Fee Numerator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Royalty Fee Numerator
          </label>
          <input
            type="text"
            name="royaltyFeeNumerator"
            value={formData.royaltyFeeNumerator}
            onChange={handleChange}
            placeholder="Enter royalty fee numerator"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Base Token URI */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Token URI
          </label>
          <input
            type="text"
            name="baseTokenURI"
            value={formData.baseTokenURI}
            onChange={handleChange}
            placeholder="Enter base token URI"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Minimum Fan Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Fan Score
          </label>
          <input
            type="text"
            name="minFanScore"
            value={formData.minFanScore}
            onChange={handleChange}
            placeholder="Enter minimum fan score"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Total Tickets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Tickets
          </label>
          <input
            type="text"
            name="totalTickets"
            value={formData.totalTickets}
            onChange={handleChange}
            placeholder="Enter total tickets"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Stake Amount */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stake Amount (in WEI)
          </label>
          <input
            type="text"
            name="stakeAmount"
            value={formData.stakeAmount}
            onChange={handleChange}
            placeholder="Enter stake amount"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div> */}

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city of event"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Tickets to Sell */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tickets to Sell
          </label>
          <input
            type="text"
            name="ticketsToSell"
            value={formData.ticketsToSell}
            onChange={handleChange}
            placeholder="Enter number of tickets to sell"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Artist
          </label>
          <input
            type="text"
            name="artist"
            value={formData.artist}
            onChange={handleChange}
            placeholder="Enter artist name"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="w-full px-4 py-2 border-4 border-black rounded-md bg-white shadow-inner"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white font-medium text-lg rounded-md shadow-md hover:bg-gray-800 hover:-translate-y-1 hover:translate-x-1 transition-all"
          disabled={loading}
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
