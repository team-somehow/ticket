
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";
import axios from "axios";
import { firebaseFunctionBaseUrl } from "../../../constants/constants";

const useApplyForEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyForEvent = async (
    eventId: string,
    spotifyUserId: string,
    address: string,
    artist: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch score and artist name
      const response = await axios.get(
        `${firebaseFunctionBaseUrl}/calculate_fan_score?user_id=${spotifyUserId}&artist_name=${artist}`
      );
      console.log(response.data);

      // Add document with score and artist name
      const eventUserRef = collection(db, "user_applied_events");
      await addDoc(eventUserRef, {
        eventId: eventId,
        isListed: false,
        userId: spotifyUserId,
        userWalletAddress: address,
        status: "applied",
        score: response.data.fan_score,
        artist_name: response.data.artist_name,
      });

      return { success: true };
    } catch (error) {
      console.error("Apply for event error:", error);
      setError("Failed to apply for event");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { applyForEvent, loading, error };
};

export default useApplyForEvent;