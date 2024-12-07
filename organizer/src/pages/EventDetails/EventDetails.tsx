import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import useUserAccount from "../../hooks/account/useUserAccount";
import ConnectToSpotify from "../../components/ConnectToSpotify/ConnectToSpotify";
import useCustomReadContract from "../../hooks/useCustomReadContract";
import useUserEventDetails from "../../hooks/get/events/useUserEventDetails";
import useUserStatus from "../../hooks/get/events/useUserStatus";
import useApplyForEvent from "../../hooks/write/events/useApplyForEvent";
import { useQuery } from "@apollo/client";
import { stakesReceivedsQuery } from "../../queries";
import ScoreGeneration from "../../components/ScoreGeneration/ScoreGeneration";

type Props = {};

const EventDetails = (props: Props) => {
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const { address } = useUserAccount();
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [spotifyUserId, setSpotifyUserId] = useState<string | null>(null);
  const { data } = useQuery(stakesReceivedsQuery);
  console.log(data);

  const {
    eventDetails,
    loading: loadingEventDetails,
    error: eventError,
  } = useUserEventDetails(eventId, address);
  const { userStatus } = useUserStatus(eventId, address);
  const {
    applyForEvent,
    loading: applying,
    error: applyError,
  } = useApplyForEvent();

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

  const [showScoreGeneration, setShowScoreGeneration] = useState(false);

  useEffect(() => {
    const spotify_user_id = searchParams.get("spotify_user_id");
    if (spotify_user_id) {
      setSpotifyUserId(spotify_user_id);
      setSpotifyConnected(true);
      localStorage.setItem("spotify_user_id", spotify_user_id);
    }
  }, [searchParams]);

  const handleStake = async () => {
    if (!spotifyConnected) {
      alert("Please connect to Spotify first!");
      return;
    }

    if (!eventDetails || !spotifyUserId) return;
    console.log("Staking started...");

    await applyForEvent(
      eventId!,
      spotifyUserId,
      address!,
      eventDetails.artist,
      eventDetails.stakeAmount,
      eventDetails.contractAddress
    );

    setTimeout(() => {
      setShowScoreGeneration(true);
    }, 2500);
  };

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
    <>
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
                disabled={!spotifyConnected || applying}
              >
                Book Ticket
              </button>
              {applyError && (
                <p className="text-red-500 text-center mt-2">{applyError}</p>
              )}
            </>
          )}
        </div>
      </div>

      {showScoreGeneration && <ScoreGeneration eventId={eventId!} />}
    </>
  );
};

export default EventDetails;
