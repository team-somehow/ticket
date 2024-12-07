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
      <div className="font-neo-display text-center text-2xl text-neo-black p-8">
        Loading your tickets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-neo-display text-center text-2xl text-neo-black p-8">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-bg p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-neo-display text-neo-black mb-6 sm:mb-8 text-center uppercase tracking-tight">
        My Tickets
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
        {tickets.map((ticket) => (
          <div
            key={ticket.userEventDocId}
            className="bg-neo-white border-neo border-neo-black rounded-lg p-4 shadow-neo hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            <div className="aspect-square mb-4 rounded-lg border-neo border-neo-black overflow-hidden relative">
              <div className="absolute inset-0 bg-neo-primary/30 blur-xl scale-95"></div>
              {ticket.nftUrl ? (
                <img
                  src={ticket.nftUrl}
                  alt={`${ticket.eventName} NFT`}
                  className="w-full h-full object-cover relative z-10 rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-neo-white relative z-10 text-neo-black/60 font-neo uppercase">
                  No NFT Image
                </div>
              )}
            </div>

            <h2 className="text-xl font-neo-display text-neo-black mb-2 uppercase tracking-tight line-clamp-1">
              {ticket.eventName}
            </h2>
            
            <p className="text-sm font-neo text-neo-black mb-4 uppercase">
              📍 {ticket.city}
            </p>

            {ticket.isListed ? (
              <p className="font-neo text-neo-primary uppercase text-center border-neo border-neo-black rounded-lg p-2">
                Listed on Marketplace
              </p>
            ) : (
              <button
                onClick={() => handleSell(ticket.userEventDocId)}
                className="w-full px-6 py-3 text-base font-neo text-neo-black bg-neo-primary border-neo border-neo-black rounded-lg shadow-neo hover:bg-neo-accent hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all uppercase tracking-wider"
              >
                Sell Ticket
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
