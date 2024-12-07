import { useEffect } from "react";
import useUserAccount from "../../hooks/account/useUserAccount";
import useFetchTickets from "../../hooks/get/tickets/useFetchTickets";
import useHandleSell from "../../hooks/write/tickets/useHandleSell";

export default function MyTickets() {
  const { address } = useUserAccount();
  const { tickets, loading, error, fetchTickets } = useFetchTickets();
  const { handleSell } = useHandleSell();

  useEffect(() => {
    if (address) {
      fetchTickets(address);
    }
  }, [address]);

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold py-8">
        Loading your tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-2xl font-bold py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-bg p-8">
      <h1 className="text-4xl font-bold text-text mb-8 border-4 border-border p-4 bg-main rounded-base shadow-light">
        My Tickets
      </h1>
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.userEventDocId}
            className="bg-bg-secondary border-2 border-border shadow-light rounded-base p-6 flex"
          >
            <div className="flex-1">
              <h2 className="text-2xl font-heading text-text mb-4">
                {ticket.eventName}
              </h2>
              <p className="text-lg font-base text-text-secondary mb-2">
                <strong>City:</strong> {ticket.city}
              </p>
              {ticket.isListed ? (
                <p className="text-green-500 font-bold">
                  Listed on Marketplace
                </p>
              ) : (
                <button
                  className="px-4 py-2 w-full text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
                  onClick={() => handleSell(ticket.userEventDocId)}
                >
                  Sell
                </button>
              )}
            </div>
            {ticket.nftUrl && (
              <div className="flex-shrink-0 ml-4">
                <img
                  src={ticket.nftUrl}
                  alt={`${ticket.eventName} NFT`}
                  className="w-40 h-40 object-cover rounded-base"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
