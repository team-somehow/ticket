
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import { Event } from "../../../types/event";

const useEventDetails = (eventId: string | undefined) => {
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [loadingEventDetails, setLoadingEventDetails] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      setLoadingEventDetails(true);
      setEventError(null);
      try {
        const eventDoc = doc(db, "events", eventId);
        const eventSnapshot = await getDoc(eventDoc);

        if (eventSnapshot.exists()) {
          setEventDetails(eventSnapshot.data() as Event);
        } else {
          setEventError("Event not found");
        }
      } catch (error) {
        setEventError("Failed to fetch event details");
        console.error("Error fetching event details:", error);
      } finally {
        setLoadingEventDetails(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return { eventDetails, loadingEventDetails, eventError };
};

export default useEventDetails;