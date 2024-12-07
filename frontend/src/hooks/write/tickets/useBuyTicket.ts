import { useState } from "react";

import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../../lib/firebase.config";

interface BuyTicketParams {
  ticketId: string;
  buyerAddress: string;
}

const useBuyTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyTicket = async ({ ticketId, buyerAddress }: BuyTicketParams) => {
    setLoading(true);
    setError(null);

    try {
      const ticketRef = doc(db, "user_applied_events", ticketId);
      await updateDoc(ticketRef, {
        userWalletAddress: buyerAddress,
        is_listed: false,
      });

      return { success: true };
    } catch (err) {
      console.error("Error purchasing ticket:", err);
      setError("Failed to purchase the ticket. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { buyTicket, loading, error };
};

export default useBuyTicket;
