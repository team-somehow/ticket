import { firebaseFunctionBaseUrl } from "../../constants/constants";

type Props = {
  eventId: string;
};

const ConnectToSpotify = ({ eventId }: Props) => {
  const handleSpotifyLogin = () => {
    try {
      // Store the redirect URL in localStorage
      localStorage.setItem("redirectUrl", `/events/${eventId}`);

      //   return

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
      className="w-full px-4 py-2 mb-4 font-heading text-text dark:text-darkText rounded-base border-2 border-border dark:border-darkBorder shadow-light dark:shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none transition-all bg-mainAccent"
    >
      Login with Spotify
    </button>
  );
};

export default ConnectToSpotify;
