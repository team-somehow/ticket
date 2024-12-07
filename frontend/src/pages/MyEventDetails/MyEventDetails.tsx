import { useParams } from "react-router-dom";
import useUserAccount from "../../hooks/account/useUserAccount";
import useMyEventDetails from "../../hooks/get/events/useMyEventDetails";
import useUserEventScore from "../../hooks/get/events/useUserEventScore";

export default function MyEventDetails() {
  const { eventId } = useParams();
  const { address } = useUserAccount();

  const {
    eventDetails,
    loading: eventLoading,
    error: eventError,
  } = useMyEventDetails(eventId);

  console.log(useMyEventDetails(eventId));
  const {
    userStatus,
    userEventDetails,
    fanPercentage,
    loading: scoreLoading,
    error: scoreError,
  } = useUserEventScore(eventId, address);

  const loading = eventLoading || scoreLoading;
  const error = eventError || scoreError;

  if (loading) return (
    <div className="min-h-screen bg-neo-bg p-4">
      <div className="bg-neo-white border-neo border-neo-black p-6 rounded-lg shadow-neo animate-pulse">
        <p className="font-neo-display text-xl text-neo-black uppercase">Loading Event Details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-neo-bg p-4">
      <div className="bg-neo-primary border-neo border-neo-black p-6 rounded-lg shadow-neo">
        <p className="font-neo-display text-xl text-neo-black uppercase">{error}</p>
      </div>
    </div>
  );

  if (!eventDetails) return null;

  return (
    <div className="min-h-screen bg-neo-bg p-4">
      {/* Header */}
      <div className="mb-6 bg-neo-primary border-neo border-neo-black p-6 rounded-lg shadow-neo">
        <h1 className="text-3xl sm:text-4xl font-neo-display text-neo-black uppercase tracking-tight">
          My Event Details
        </h1>
      </div>

      {/* Event Details Card */}
      <div className="mb-6 bg-neo-white border-neo border-neo-black p-6 rounded-lg shadow-neo">
        <img 
          src={eventDetails.image} 
          alt={eventDetails.name}
          className="w-full h-48 object-cover mb-4 border-neo border-neo-black rounded-lg shadow-neo"
        />
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-neo-display text-neo-black uppercase font-black">
            {eventDetails.name}
          </h2>
          <p className="font-neo-display text-neo-black text-xl uppercase font-black">
            {(parseInt(eventDetails.ticketPrice) / Math.pow(10, 18)).toFixed(4)} ETH
          </p>
        </div>
        <p className="font-neo text-neo-black mb-2">
          <span className="uppercase font-bold">Location:</span> {eventDetails.location}
        </p>
        <p className="font-neo text-neo-black">{eventDetails.description}</p>
      </div>

      {/* Status Card */}
      <div className="mb-6 bg-neo-primary border-neo border-neo-black p-6 rounded-lg shadow-neo text-center">
        {userStatus === "applied" && (
          <>
            <div className="mb-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-neo-accent/30 blur-xl scale-95"></div>
                <h2 className="relative z-10 text-xl font-neo-display text-neo-black uppercase font-black bg-neo-white border-neo border-neo-black p-4 rounded-lg shadow-neo">
                  🎉 Congratulations! You are in the Top {fanPercentage}% of Fans 🎉
                </h2>
              </div>
              <div className="inline-block bg-neo-white border-neo border-neo-black px-6 py-3 rounded-lg shadow-neo">
                <div className="relative pb-12 pr-2">
                  <p className="font-neo-display text-neo-black text-lg uppercase">
                    Your Fan Score: <span className="text-2xl font-black">{userEventDetails?.score || 0}</span>
                  </p>
                  <a
                    href="https://www.truenetwork.io/explorer/raman/0x5e06ec4eb2edf0239ef2408b5cb65504018b29b4cfbb33bc234a7e2acf1f0cd4"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 mt-2 border border-radius-5 absolute top-8 bottom-0 right-0 font-neo uppercase bg-neo-white px-3 hover:text-emerald-600 transition-colors cursor-pointer flex items-center gap-1 text-sm"
                  >
                    <img 
                      src="/icons/polkadot.png" 
                      alt="Verified" 
                      className="w-8 h-8"
                    />
                    Attested
                  </a>
                </div>
              </div>
            </div>
            {eventDetails?.scanUrl?.length > 0 &&<button
              onClick={() => window.open(eventDetails?.scanUrl, "_blank")}
              className="px-4 py-2 text-sm bg-neo-accent border-neo border-neo-black rounded-lg shadow-neo font-neo text-neo-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
              View on Chain
            </button>}
          </>
        )}
        {userStatus === "accepted" && (
          <>
            <img
              src={userEventDetails?.nftUrl}
              alt="NFT Ticket"
              className="mx-auto w-40 h-40 mb-4 border-neo border-neo-black rounded-lg shadow-neo"
            />
            <h2 className="text-xl font-neo-display text-neo-black uppercase mb-4 font-black">
              🎉 Here is your NFT Ticket 🎉
            </h2>
            {eventDetails?.scanUrl?.length > 0 &&<button
              onClick={() => window.open(eventDetails?.scanUrl, "_blank")}
              className="px-6 py-3 bg-neo-accent border-neo border-neo-black rounded-lg shadow-neo font-neo text-neo-black uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold"
            >
              View on Chain
            </button>}
          </>
        )}
        {userStatus === "rejected" && (
          <p className="text-xl font-neo-display text-neo-black uppercase font-black">
            Unfortunately, you did not get in this time 🥲
          </p>
        )}
      </div>

      {/* Status Details Card */}
      <div className="bg-neo-white border-neo border-neo-black p-6 rounded-lg shadow-neo text-center">
        <p className="text-xl font-neo-display text-neo-black uppercase mb-4 font-black">Status</p>
        {userStatus === "applied" && (
          <p className="font-neo text-neo-black">
            Thank you for applying, results will be out soon.
          </p>
        )}
        {userStatus === "accepted" && (
          <p className="font-neo text-neo-black">
            🎉 Congratulations on getting in! 🎉 <br />
            We hope to see you at the Event.
          </p>
        )}
        {userStatus === "rejected" && (
          <p className="font-neo text-neo-black">
            Better luck next time, ticket price will be refunded!
          </p>
        )}
      </div>
    </div>
  );
}
