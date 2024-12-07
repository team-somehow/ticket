import { useState } from "react";

import { collection, addDoc } from "firebase/firestore";

import axios from "axios";

import { useWriteContract } from "wagmi";

import TicketProtocolImplementation from "../../../artifacts/TicketProtocol.json";
import {
  contractAddress,
  firebaseFunctionBaseUrl,
} from "../../../constants/constants";
import { db } from "../../../lib/firebase.config";

const useApplyForEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { writeContract } = useWriteContract();

  const applyForEvent = async (
    eventId: string,
    spotifyUserId: string,
    address: string,
    artist: string,
    stakeAmount: string,
    contractAddress: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch score and artist name
      let fanScore = 47; // Default score
      try {
        const response = await axios.get(
          `${firebaseFunctionBaseUrl}/calculate_fan_score?user_id=${spotifyUserId}&artist_name=${artist}`
        );
        fanScore = response.data.fan_score || fanScore; // Use default if fan_score is undefined
        console.log(response.data);
      } catch (error) {
        console.warn("Failed to fetch fan score, using default:", fanScore);
      }

      // Add document with score and artist name
      const eventUserRef = collection(db, "user_applied_events");
      await addDoc(eventUserRef, {
        eventId: eventId,
        isListed: false,
        userId: spotifyUserId,
        userWalletAddress: address,
        status: "applied",
        score: fanScore,
        artist_name: artist,
      });

      try {
        writeContract({
          abi: TicketProtocolImplementation.abi,
          functionName: "stakeAndApply",
          address: contractAddress as `0x${string}`,
          account: address as `0x${string}`,
          value: stakeAmount as unknown as bigint,
        });
      } catch {
        console.log("[7423198] stake and apply");
      }

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
