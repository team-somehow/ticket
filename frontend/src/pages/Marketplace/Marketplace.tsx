"use client";

import React from "react";
import useUserAccount from "../../hooks/account/useUserAccount";
import useListedTickets from "../../hooks/get/tickets/useListedTickets";
import useBuyTicket from "../../hooks/write/tickets/useBuyTicket";

const weiToEther = (wei: string) => {
  return (parseInt(wei) / Math.pow(10, 18)).toFixed(4);
};

const Marketplace = () => {
  const { address } = useUserAccount();
  const { tickets, loading, error } = useListedTickets();

  const { buyTicket, loading: buyLoading, error: buyError } = useBuyTicket();

  const handleBuy = async (ticket: any) => {
    if (!address) {
      alert("Please connect your wallet to buy tickets.");
      return;
    }

    const result = await buyTicket({
      ticketId: ticket.docId,
      buyerAddress: address,
    });

    if (result.success) {
      alert("Ticket purchased successfully!");
      // Refresh the page or update the UI as needed
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="text-center text-2xl font-bold py-8">
        Loading tickets...
      </div>
    );
  }

  if (error || buyError) {
    return (
      <div className="text-center text-red-500 text-2xl font-bold py-8">
        {error || buyError}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-darkBg py-8 px-8">
      <h1 className="text-5xl font-heading text-text dark:text-darkText mb-7">
        Marketplace
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.docId}
            className="bg-bg-secondary border-2 border-border shadow-light rounded-base p-6"
          >
            <h2 className="text-2xl font-heading text-text mb-4">
              {ticket.eventDetails.name}
            </h2>
            <p className="text-lg font-base text-text-secondary mb-2">
              <strong>Location:</strong> {ticket.eventDetails.location}
            </p>
            <p className="text-text-muted mb-2">
              {ticket.eventDetails.description}
            </p>
            <p className="text-lg font-base text-text-secondary mb-4">
              <strong>Price:</strong>{" "}
              {weiToEther(ticket.eventDetails.ticketPrice)} ETH
            </p>
            <p className="text-sm font-base text-text-secondary mb-4">
              <strong>Owner:</strong> {ticket.userWalletAddress}
            </p>
            <button
              className="px-4 py-2 text-sm font-base text-text bg-main border-2 border-border rounded-base shadow-light hover:bg-mainAccent hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all"
              onClick={() => handleBuy(ticket)}
              disabled={buyLoading}
            >
              {buyLoading ? "Processing..." : "Buy"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
