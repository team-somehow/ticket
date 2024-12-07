import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";

interface UserEventDetails {
  status: string;
  nftUrl?: string;
  score?: number;
}

const useUserEventScore = (
  eventId: string | undefined,
  address: string | undefined
) => {
  const [userStatus, setUserStatus] = useState<string>("applied");
  const [userEventDetails, setUserEventDetails] =
    useState<UserEventDetails | null>(null);
  const [fanPercentage, setFanPercentage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserStatus = async () => {
      if (!address || !eventId) return;

      try {
        const eventUserRef = collection(db, "user_applied_events");
        const q = query(
          eventUserRef,
          where("eventId", "==", eventId),
          where("userWalletAddress", "==", address)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          setUserStatus(userDoc.status);
          setUserEventDetails(userDoc as UserEventDetails);

          // Fetch all scores for the event
          const allScoresQuery = query(
            eventUserRef,
            where("eventId", "==", eventId)
          );
          const allScoresSnapshot = await getDocs(allScoresQuery);

          const scores = allScoresSnapshot.docs.map((doc) => doc.data().score);
          scores.sort((a, b) => b - a);

          const userScoreIndex = scores.indexOf(userDoc.score);
          const percentageAbove =
            ((scores.length - userScoreIndex - 1) / scores.length) * 100;

          setFanPercentage(percentageAbove);
        } else {
          setUserStatus("applied");
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
        setError("Failed to fetch user status");
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatus();
  }, [eventId, address]);

  return { userStatus, userEventDetails, fanPercentage, loading, error };
};

export default useUserEventScore;
