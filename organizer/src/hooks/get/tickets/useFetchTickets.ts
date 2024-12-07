import { useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebase.config";

const useFetchTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async (address: string) => {
    setLoading(true);
    setError(null);

    try {
      const userTicketsRef = collection(db, "user_applied_events");
      const q = query(
        userTicketsRef,
        where("userWalletAddress", "==", address),
        where("status", "==", "accepted")
      );

      const querySnapshot = await getDocs(q);
      const ticketsData: any[] = [];

      for (const docSnapshot of querySnapshot.docs) {
        const ticketData = docSnapshot.data();
        const eventRef = doc(db, "events", ticketData.eventId);
        const eventSnapshot = await getDoc(eventRef);

        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.data();
          ticketsData.push({
            eventName: eventData.name,
            city: eventData.location,
            nftUrl: ticketData.nftUrl,
            userEventDocId: docSnapshot.id,
            isListed: ticketData.is_listed || false,
          });
        }
      }

      setTickets(ticketsData);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to fetch tickets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return { tickets, loading, error, fetchTickets };
};

export default useFetchTickets;
