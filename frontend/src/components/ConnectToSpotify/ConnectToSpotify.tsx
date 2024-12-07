import { firebaseFunctionBaseUrl } from "../../constants/constants";
import { cn } from "../../lib/utils";

type Props = {
  eventId: string;
};

const ConnectToSpotify = ({ eventId }: Props) => {
  const handleSpotifyLogin = () => {
    try {
      // Store the redirect URL in localStorage
      localStorage.setItem("redirectUrl", `/events/${eventId}`);

      // Hardcoded Firebase Emulator URL for testing
      const firebaseUrl = firebaseFunctionBaseUrl;
      console.log("Redirecting to Firebase login URL:", `${firebaseUrl}/login`);

      // Redirect the browser directly to the login URL
      window.location.href = `${firebaseUrl}/login`;
    } catch (error) {
      console.error("Error during Spotify login:", error);
      alert("Failed to initiate Spotify login.");
    }
  };

  return (
    <button
      onClick={handleSpotifyLogin}
      className={cn(
        "w-full px-6 py-3 text-base font-neo text-neo-black border-neo border-neo-black rounded-lg shadow-neo uppercase tracking-wider transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-none mb-4",
        "bg-[#1DB954]" // Spotify brand color
      )}
    >
      Login with Spotify
    </button>
  );
};

export default ConnectToSpotify;
