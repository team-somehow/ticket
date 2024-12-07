
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase.config";

const useUserStatus = (eventId: string | undefined, address: string | undefined) => {
  const [userStatus, setUserStatus] = useState<string | null>(null);

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
        } else {
          setUserStatus("not applied");
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
        setUserStatus(null);
      }
    };

    fetchUserStatus();
  }, [eventId, address]);

  return { userStatus };
};

export default useUserStatus;