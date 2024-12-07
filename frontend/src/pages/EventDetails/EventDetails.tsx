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
    try {
      if (!spotifyConnected) {
        alert("Please connect to Spotify first!");
        return;
      }

      if (!eventDetails || !spotifyUserId) return;
      console.log("Staking started...");

      setShowScoreGeneration(true);

      await applyForEvent(
        eventId!,
        spotifyUserId,
        address!,
        eventDetails.artist,
        eventDetails.stakeAmount,
        eventDetails.contractAddress as `0x${string}`
      );
    } catch {
      //   alert("Failed to stake and apply");
    }

    // setTimeout(() => {
    // }, 2500);
  };

  if (loadingEventDetails)
    return (
      <div className="min-h-screen bg-neo-bg p-4">
        <div className="bg-neo-white border-neo border-neo-black p-6 rounded-lg shadow-neo animate-pulse">
          <p className="font-neo-display text-xl text-neo-black uppercase">
            Loading Event Details...
          </p>
        </div>
      </div>
    );

  if (eventError)
    return (
      <div className="min-h-screen bg-neo-bg p-4">
        <div className="bg-neo-primary border-neo border-neo-black p-6 rounded-lg shadow-neo">
          <p className="font-neo-display text-xl text-neo-black uppercase">
            {eventError}
          </p>
        </div>
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-neo-bg p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Event Details */}
          <div className="lg:col-span-2 bg-neo-white border-neo border-neo-black rounded-lg p-6 shadow-neo">
            {eventDetails && (
              <div>
                <div className="aspect-[16/9] mb-6 rounded-lg border-neo border-neo-black overflow-hidden relative">
                  <div className="absolute inset-0 bg-neo-primary/30 blur-xl scale-95"></div>
                  <img
                    src={eventDetails.image}
                    alt={eventDetails.name}
                    className="w-full h-full object-cover relative z-10"
                  />
                </div>

                <h2 className="text-3xl sm:text-4xl font-neo-display text-neo-black uppercase mb-6 tracking-tight">
                  {eventDetails.name}
                </h2>

                <div className="space-y-4 font-neo">
                  <p className="flex items-center gap-2 text-neo-black">
                    <span className="uppercase font-bold">📍 Location:</span>
                    {eventDetails.location}
                  </p>

                  <p className="text-neo-black">
                    <span className="uppercase font-bold">Description:</span>
                    <br />
                    {eventDetails.description}
                  </p>

                  <p className="flex items-center gap-2 text-neo-black">
                    <span className="uppercase font-bold">📅 Date:</span>
                    {eventDetails.date}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Section - Booking */}
          <div className="bg-neo-white border-neo border-neo-black rounded-lg p-6 shadow-neo">
            {userStatus === "applied" && (
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-neo-accent/30 blur-xl scale-95"></div>
                  <p className="relative z-10 text-xl font-neo-display text-neo-black uppercase bg-neo-white border-neo border-neo-black p-4 rounded-lg shadow-neo">
                    Please wait for results
                  </p>
                </div>
              </div>
            )}

            {userStatus === "not applied" && (
              <>
                <h3 className="text-2xl font-neo-display text-neo-black uppercase mb-6 tracking-tight">
                  Book Tickets
                </h3>

                {!spotifyConnected && eventId && (
                  <ConnectToSpotify eventId={eventId} />
                )}

                <button
                  className={cn(
                    "w-full px-6 py-3 text-base font-neo text-neo-black border-neo border-neo-black rounded-lg shadow-neo uppercase tracking-wider transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-none",
                    spotifyConnected
                      ? "bg-neo-primary"
                      : "bg-neo-white cursor-not-allowed opacity-50"
                  )}
                  onClick={handleStake}
                  disabled={!spotifyConnected || applying}
                >
                  {applying ? "Processing..." : "Book Ticket"}
                </button>

                {applyError && (
                  <div className="mt-4 p-3 bg-red-100 border-neo border-neo-black rounded-lg">
                    <p className="text-red-600 text-center font-neo">
                      {applyError}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showScoreGeneration && <ScoreGeneration eventId={eventId!} />}
    </>
  );
};

export default EventDetails;
