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
  }: BuyTicketParams) => {
    setLoading(true);
    setError(null);

    try {
      const txResponse = await writeContract({
        abi: TicketProtocolImplementation.abi,
        functionName: "safeTransferWhileEnforcingPrice",
        address: sellerAddress as `0x${string}`,
        args: [sellerAddress, buyerAddress, tokenId, salePrice],
        value: salePrice as unknown as bigint,
      });

      const ticketRef = doc(db, "user_applied_events", ticketId);
      await updateDoc(ticketRef, {
        userWalletAddress: buyerAddress,
        is_listed: false,
      });

      return { success: true };
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
