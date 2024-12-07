import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";

const useHandleSell = () => {
  const [error, setError] = useState<string | null>(null);

  const handleSell = async (userEventDocId: string) => {
    try {
      const userEventRef = doc(db, "user_applied_events", userEventDocId);
      await updateDoc(userEventRef, { is_listed: true });
      console.log("Ticket listed on the marketplace");
    } catch (err) {
      console.error("Error listing ticket:", err);
      setError("Failed to list ticket. Please try again later.");
    }
  };

  return { handleSell, error };
};

export default useHandleSell;
