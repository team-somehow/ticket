import { useState, useEffect } from "react";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import { Event } from "../../../types/event";

const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events: Event[] = [];
        const eventsRef = collection(db, "events");
        const querySnapshot = await getDocs(eventsRef);
        querySnapshot.forEach((doc) => {
          const event = doc.data() as Event;
          events.push({
            ...event,
            id: doc.id,
            image: event.image || "https://via.placeholder.com/300x200",
          });
        });
        setEvents(events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
};

export default useEvents;
