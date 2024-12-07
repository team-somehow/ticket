import { useAccount } from "wagmi";
import { useEffect } from "react";

// Custom hook to manage user account state using wagmi
function useUserAccount() {
  const { address, isConnected, status } = useAccount();

  useEffect(() => {
    if (isConnected) {
      // Logic to handle when the user is connected
      localStorage.setItem("userAddress", address || "");
    } else {
      // Logic to handle when the user is not connected
      localStorage.removeItem("userAddress");
    }
  }, [address, isConnected]);

  const updateAddress = (newAddress: string) => {
    // This function might not be necessary if wagmi handles account updates
    // But you can still use it to manually set an account if needed
    localStorage.setItem("userAddress", newAddress);
  };

  return { address, updateAddress, status };
}

export default useUserAccount;
