import { useState } from "react";

import { doc, updateDoc } from "firebase/firestore";

import { useAccount, useSignMessage } from "wagmi";

import { db } from "../../../lib/firebase.config";

const useHandleSell = () => {
  const [error, setError] = useState<string | null>(null);
  const { signMessage, isSuccess } = useSignMessage();
  const { isConnected } = useAccount();

  const handleSell = async (userEventDocId: string) => {
    try {
      const message = `I want to sell my ticket with ID: ${userEventDocId}`;

      const signature = signMessage({ message: message });

      console.log("Signature:", signature);

      if (isSuccess) {
        const userEventRef = doc(db, "user_applied_events", userEventDocId);
        await updateDoc(userEventRef, { is_listed: true });
        window.location.reload();
      }
    } catch (err) {
      console.error("Error signing message:", err);
      setError("Failed to list ticket. Please try again later.");
    }
  };

  return { handleSell, error };
};

export default useHandleSell;
