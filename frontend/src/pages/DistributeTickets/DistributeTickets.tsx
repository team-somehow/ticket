import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import axios from "axios";

export default function DistributeTickets() {
  const { eventId } = useParams(); // Get the event ID from the URL
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const firebaseFunctionBaseUrl = "http://127.0.0.1:5001/personal-projects-e8a07/us-central1";

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const eventDoc = doc(db, "events", eventId!); // Reference the document
        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
          setEventDetails(eventSnapshot.data());
        } else {
          throw new Error("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleDistributeTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${firebaseFunctionBaseUrl}/distributeTickets`,
        {
          eventId,
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error distributing tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold py-8">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-2xl font-bold py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-5">
      <h1 className="text-4xl font-bold text-center mb-8 border-4 border-black p-4 bg-main rounded-base shadow-light">
        Event Admin
      </h1>
      <div className="bg-white border-2 border-border shadow-light rounded-base p-6 w-90 text-center mb-6">
        <h2 className="text-2xl font-heading text-text mb-4">
          {eventDetails.name}
        </h2>
        <p className="text-lg font-base text-text-secondary mb-4">
          <strong>Location:</strong> {eventDetails.location}
        </p>
        <p className="text-text-muted text-lg">{eventDetails.description}</p>
      </div>
      <div className="bg-white border-2 border-border shadow-light rounded-base p-6 w-90 text-center">
        <button
          className="px-6 py-3 bg-main text-text w-90 font-base border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
          onClick={handleDistributeTickets}
        >
          Distribute Tickets
        </button>
      </div>
    </div>
  );
}
