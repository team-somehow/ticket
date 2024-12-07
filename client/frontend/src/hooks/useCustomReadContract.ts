import { useReadContract } from "wagmi";
import { useSource } from "../context/SourceContext";

const useCustomReadContract = (
  contractAddress: `0x${string}`,
  methodName: string,
  args: any[]
) => {
  const { source } = useSource();
  let data, isLoading, error;

  if (source === "wagmi") {
    ({ data, isLoading, error } = useReadContract({
      address: contractAddress,
      functionName: methodName,
      args,
    }));
  } else if (source === "stark") {
  }

  return { data, isLoading, error };
};

export default useCustomReadContract;
