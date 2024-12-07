import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import EventCard from "../../components/EventCard/EventCard";
import useUserAccount from "../../hooks/account/useUserAccount";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  image: string;
  contractAddress: string;
  ticketPrice: string;
}

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useUserAccount();

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!address) return;

      try {
        setLoading(true);
        // Query user_applied_events collection
        const userEventsRef = collection(db, "user_applied_events");
        const q = query(
          userEventsRef,
          where("userWalletAddress", "==", address)
        );
        const querySnapshot = await getDocs(q);

        // Fetch full event details for each applied event
        const eventPromises = querySnapshot.docs.map(async (docSnapshot) => {
          const eventId = docSnapshot.data().eventId;
          const eventDocRef = doc(db, "events", eventId);
          const eventDoc = await getDoc(eventDocRef);

          if (eventDoc.exists()) {
            return {
              id: eventDoc.id,
              ...eventDoc.data(),
            } as Event;
          }
          return null;
        });

        const resolvedEvents = await Promise.all(eventPromises);
        // Filter out any null values and set the events
        setEvents(
          resolvedEvents.filter((event): event is Event => event !== null)
        );
      } catch (error) {
        console.error("Error fetching user events:", error);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [address]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (events.length === 0) {
    return <div className="text-center py-8">No events found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} {...event} myEvent={true} />
        ))}
      </div>
    </div>
  );
};

export default MyEvents;
