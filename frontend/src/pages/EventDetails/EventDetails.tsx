import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useWriteContract } from "wagmi";
import TicketProtocol from "../../artifacts/TicketProtocol.json";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../lib/firebase.config";
import { cn } from "../../lib/utils";
import axios from "axios";
import useUserAccount from "../../hooks/account/useUserAccount";
import { firebaseFunctionBaseUrl } from "../../constants/constants";
import { Event } from "../../types/event";
import ConnectToSpotify from "../../components/ConnectToSpotify/ConnectToSpotify";
import useCustomReadContract from "../../hooks/useCustomReadContract";

type Props = {};

const EventDetails = (props: Props) => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const { address } = useUserAccount();
  //   const { showSnackbar } = useSnackbar();

  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const [loadingEventDetails, setLoadingEventDetails] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyUserId, setSpotifyUserId] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  const { writeContract } = useWriteContract();

  const { data: isStaked, isLoading } = useCustomReadContract(
    eventDetails?.contractAddress as `0x${string}`,
    "hasStaked",
    [address]
  );

  const { data: stakeAmount, isLoading: isStakeAmountLoading } =
    useCustomReadContract(
      eventDetails?.contractAddress as `0x${string}`,
      "stakeAmount",
      []
    );

  const { data: ownerAddress, isLoading: isOwnerLoading } =
    useCustomReadContract(
      eventDetails?.contractAddress as `0x${string}`,
      "owner",
      []
    );

  useEffect(() => {
    const spotify_user_id = searchParams.get("spotify_user_id");
    if (spotify_user_id) {
      setSpotifyUserId(spotify_user_id);
      setSpotifyConnected(true);
      localStorage.setItem("spotify_user_id", spotify_user_id);
      //   showSnackbar("Spotify connected successfully");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoadingEventDetails(true);
      setEventError(null);
      try {
        // Fetch event details
        const eventDoc = doc(db, "events", eventId!);
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

    const fetchUserStatus = async () => {
      if (!address || !eventId) return;

      try {
        // Query the event_user collection for the user's status
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

    console.log(address);

    fetchEventDetails();
    fetchUserStatus();
  }, [eventId, address]);

  const handleStake = async () => {
    if (!spotifyConnected) {
      alert("Please connect to Spotify first!");
      return;
    }
    try {
      if (!eventDetails || !spotifyUserId) return;

      setLoadingEventDetails(true);

      // Fetch score and artist name
      const response = await axios.get(
        `${firebaseFunctionBaseUrl}/calculate_fan_score?user_id=${spotifyUserId}&artist_name=${eventDetails.artist}`
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

      setUserStatus("applied");
      //   showSnackbar("Ticket Price !");
    } catch (error) {
      console.error("Stake error:", error);
    } finally {
      setLoadingEventDetails(false);
    }
  };

  console.log({
    isStaked,
    stakeAmount,
    ownerAddress,
  });

  if (loadingEventDetails)
    return (
      <div className="text-2xl font-heading text-text dark:text-darkText text-center py-12">
        Loading...
      </div>
    );

  if (eventError)
    return (
      <div className="text-2xl font-heading text-text dark:text-darkText text-center py-12">
        Error: {eventError}
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-bg dark:bg-darkBg p-6">
      {/* Left Section */}
      <div className="w-full lg:w-7/10 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base p-6 shadow-light dark:shadow-dark">
        {eventDetails && (
          <div>
            <img
              src={eventDetails.image}
              alt={eventDetails.name}
              className="w-full h-60 object-cover rounded-base mb-4 border-2 border-border dark:border-darkBorder"
            />
            <h2 className="text-4xl font-heading text-text dark:text-darkText mb-4">
              {eventDetails.name}
            </h2>
            <p className="text-lg mb-2 text-text dark:text-darkText">
              <strong>Location:</strong> {eventDetails.location}
            </p>
            <p className="text-lg mb-2 text-text dark:text-darkText">
              <strong>Description:</strong> {eventDetails.description}
            </p>
            <p className="text-lg text-text dark:text-darkText">
              <strong>Date:</strong> {eventDetails.date}
            </p>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-3/10 bg-bg dark:bg-darkBg border-2 border-border dark:border-darkBorder rounded-base p-6 mt-6 md:mt-0 md:ml-6 shadow-light dark:shadow-dark">
        {userStatus === "applied" && (
          <p className="text-xl font-heading text-text dark:text-darkText text-center">
            Please wait for results
          </p>
        )}

        {userStatus === "not applied" && (
          <>
            <h3 className="text-3xl font-heading text-text dark:text-darkText mb-4">
              Book Tickets
            </h3>

            {!spotifyConnected && eventId && (
              <ConnectToSpotify eventId={eventId} />
            )}

            <button
              className={cn(
                "w-full px-4 py-2 font-heading text-text dark:text-darkText rounded-base border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark transition-all",
                spotifyConnected
                  ? "bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
                  : "bg-secondaryBlack cursor-not-allowed"
              )}
              onClick={handleStake}
              disabled={!spotifyConnected}
            >
              Book Ticket
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
