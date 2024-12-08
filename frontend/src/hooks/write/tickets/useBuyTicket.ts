import { useState } from "react";

import { doc, updateDoc } from "firebase/firestore";

import { useWriteContract } from "wagmi";

import TicketProtocolImplementation from "../../../artifacts/TicketProtocol.json";
import { db } from "../../../lib/firebase.config";

interface BuyTicketParams {
  ticketId: string;
  buyerAddress: string;
  sellerAddress: string;
  tokenId: string;
  salePrice: string;
  contractAddress: string;
}

const useBuyTicket = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { writeContract } = useWriteContract();

  const buyTicket = async ({
    ticketId,
    buyerAddress,
    sellerAddress,
    tokenId,
    salePrice,
    contractAddress,
  }: BuyTicketParams) => {
    setLoading(true);
    setError(null);

    try {
      // writeContract({
      //   abi: TicketProtocolImplementation.abi,
      //   functionName: "safeTransferWhileEnforcingPrice",
      //   address: sellerAddress as `0x${string}`,
      //   args: [sellerAddress, buyerAddress, tokenId, salePrice],
      //   value: salePrice as unknown as bigint,
      // });
      writeContract({
        abi: TicketProtocolImplementation.abi,
        functionName: "stakeAndApply",
        address: contractAddress as `0x${string}`,
        account: buyerAddress,
        value: salePrice as unknown as bigint,
      });

      setTimeout(async () => {
        const ticketRef = doc(db, "tickets", ticketId);
        await updateDoc(ticketRef, { isListed: false });
        window.location.reload();

        return { success: true };
      }, 2000);
    } catch (err) {
      console.error("Error purchasing ticket:", err);
      setError("Failed to purchase the ticket. Please try again.");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return { buyTicket, loading, error };
};

export default useBuyTicket;
