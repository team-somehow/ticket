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
  const {
    userStatus,
    userEventDetails,
    fanPercentage,
    loading: scoreLoading,
    error: scoreError,
  } = useUserEventScore(eventId, address);

  const loading = eventLoading || scoreLoading;
  const error = eventError || scoreError;

  if (loading) {
    return (
      <div className="text-center text-3xl font-heading text-text py-8">
        Loading event details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-3xl font-heading text-red-500 py-8">
        {error}
      </div>
    );
  }

  if (!eventDetails) return null;

  return (
    <div className="min-h-screen flex flex-col items-center bg-bg p-5">
      <h1 className="text-3xl w-90 font-heading text-text mb-5 border-2 border-border p-4 bg-main rounded-base shadow-light">
        My Event Details
      </h1>

      {/* Event Details Card */}
      <div className="bg-bg-secondary border-2 border-border shadow-light rounded-base p-6 w-90 text-center mb-5">
        <h2 className="text-2xl font-heading text-text mb-4">
          {eventDetails.name}
        </h2>
        <p className="text-sm font-base text-text-secondary mb-4">
          <strong>Location:</strong> {eventDetails.location}
        </p>
        <p className="text-text-muted text-lg">{eventDetails.description}</p>
      </div>

      {/* Congratulations Card */}
      <div className="bg-mainAccent border-2 border-border shadow-light rounded-base p-6 w-90 text-center mb-5">
        {userStatus === "applied" && (
          <>
            <h2 className="text-xl font-heading text-text mb-4">
              🎉 Congratulations! You are in the Top {fanPercentage}% of Fans 🎉
            </h2>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-main text-text font-base border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all mx-auto"
              onClick={() =>
                window.open(`https://etherscan.io/address/${address}`, "_blank")
              }
            >
              View on Chain
            </button>
          </>
        )}
        {userStatus === "accepted" && (
          <>
            <img
              src={userEventDetails?.nftUrl} // Replace with the actual NFT ticket URL
              alt="NFT Ticket"
              className="mx-auto w-40 h-40 mb-4 border-2 border-border rounded-base shadow-light"
            />
            <h2 className="text-xl font-heading text-text mb-4">
              🎉 Here is your NFT Ticket 🎉
            </h2>
            <button
              className="flex items-center justify-center gap-2 px-6 py-3 bg-main text-text font-base border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all mx-auto"
              onClick={() =>
                window.open(`https://etherscan.io/address/${address}`, "_blank")
              }
            >
              View on Chain
            </button>
          </>
        )}
        {userStatus === "rejected" && (
          <div className="text-xl w-90 font-bold text-text">
            Unfortunately, you did not get in this time 🥲
          </div>
        )}
      </div>

      {userStatus != "rejected" && (
        <></>
        // <button
        //   className="flex items-center justify-center gap-2 px-6 py-3 w-90 mb-5 bg-blue-600 text-white font-base border-2 border-border rounded-base shadow-light hover:bg-blue-600 hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all mx-auto"
        //   onClick={() =>
        //     window.open(
        //       `https://t.me/share/url?url=Check out this event! ${window.location.href}`,
        //       "_blank"
        //     )
        //   }
        // >
        //   <img
        //     src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg"
        //     alt="Telegram Logo"
        //     className="w-5 h-5"
        //   />
        //   Add Friends via Telegram
        // </button>
      )}

      {/* User Status Card */}
      <div className="bg-bg-secondary border-2 border-border shadow-light rounded-base p-6 w-90 text-center">
        <p className="text-xl font-bold text-text-primary mb-2">Status</p>
        {userStatus === "applied" && (
          <p className="text-lg font-base text-text-secondary">
            Thank you for applying, results will be out soon.
          </p>
        )}
        {userStatus === "accepted" && (
          <div>
            <p className="text-lg font-base text-text-secondary">
              🎉 Congratulations on getting in! 🎉 <br />
              We hope to see you at the Event.
            </p>
          </div>
        )}
        {userStatus === "rejected" && (
          <p className="text-lg font-base text-text-secondary">
            Better luck next time, ticket price will be refunded!
          </p>
        )}
      </div>
    </div>
  );
}
