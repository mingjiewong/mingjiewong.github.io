import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * A component that scrolls the window to the top of the page
 * whenever the location (URL path) changes.
 */
export default function ScrollToTop() {
  // Extracts the pathname from the current location.
  const { pathname } = useLocation();

  // The useEffect hook runs after every render, but we only want it to run
  // when the pathname changes.
  useEffect(() => {
    // Scrolls the window to the top-left corner.
    window.scrollTo(0, 0);
  }, [pathname]); // The effect depends on the pathname.

  // This component does not render any visible UI.
  return null;
}