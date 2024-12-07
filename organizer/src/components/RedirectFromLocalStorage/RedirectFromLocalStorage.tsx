import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RedirectFromLocalStorage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the redirect URL from localStorage
    const redirectUrl = localStorage.getItem("redirectUrl");

    if (redirectUrl) {
      // Get current search params
      const currentSearchParams = new URLSearchParams(location.search);

      // Create URL object from redirect URL to properly handle any existing query params
      const finalUrl = new URL(redirectUrl, window.location.origin);

      // Append all current search params to the redirect URL
      currentSearchParams.forEach((value, key) => {
        finalUrl.searchParams.append(key, value);
      });

      // Navigate to the stored URL with the search params
      navigate(finalUrl.pathname + finalUrl.search);
    } else {
      // If no redirect URL is found, navigate to home page with current search params
      navigate({
        pathname: "/",
        search: location.search,
      });
    }
  }, [navigate, location]);

  // Return null since this is just a redirect component
  return null;
};

export default RedirectFromLocalStorage;
