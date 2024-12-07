import { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";

interface ListedTicketData {
  docId: string;
  eventId: string;
  is_listed: boolean;
  [key: string]: any; // for other fields from firestore
}

interface ListedTicket {
  docId: string;
  eventId: string;
  userWalletAddress: string;
  is_listed: boolean;
  eventDetails: {
    name: string;
    location: string;
    description: string;
    ticketPrice: string;
  };
}

const useListedTickets = () => {
  const [tickets, setTickets] = useState<ListedTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListedTickets = async () => {
      setLoading(true);
      setError(null);

      try {
        const userTicketsRef = collection(db, "user_applied_events");
        const querySnapshot = await getDocs(userTicketsRef);
        const listedTickets = querySnapshot.docs
          .filter((doc) => doc.data().is_listed === true)
          .map((doc) => ({ ...doc.data(), docId: doc.id }) as ListedTicketData);

        const ticketsWithDetails: ListedTicket[] = [];
        for (const ticket of listedTickets) {
          const eventDoc = doc(db, "events", ticket.eventId);
          const eventSnapshot = await getDoc(eventDoc);

          if (eventSnapshot.exists()) {
            ticketsWithDetails.push({
              ...ticket,
              eventDetails: eventSnapshot.data(),
            } as ListedTicket);
          }
        }

        setTickets(ticketsWithDetails);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListedTickets();
  }, []);

  return { tickets, loading, error };
};

export default useListedTickets; 