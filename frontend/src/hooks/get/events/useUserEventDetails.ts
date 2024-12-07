import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import { Event } from "../../../types/event";

const useUserEventDetails = (
  eventId: string | undefined,
  address: string | undefined
) => {
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserEventDetails = async () => {
      if (!eventId || !address) return; // Ensure both eventId and address are provided
      setLoading(true);
      setError(null);

      try {
        const eventDoc = doc(db, "events", eventId);
        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
          setEventDetails(eventSnapshot.data() as Event);
        } else {
          throw new Error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching user event details:", error);
        setError("Failed to fetch user event details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserEventDetails();
  }, [eventId, address]);

  return { eventDetails, loading, error };
};

export default useUserEventDetails;
