// Import core React and ReactDOM libraries.
import React from 'react'
import ReactDOM from 'react-dom/client'

// Import BrowserRouter to enable client-side routing using the HTML5 history API.
import { BrowserRouter } from 'react-router-dom';

// Import the root component of the application.
import App from './App.jsx'

// Import the ScrollToTop component to ensure the page scrolls to the top on route changes.
import ScrollToTop from './ScrollToTop.jsx';

// Import global CSS styles that apply to the entire application.
import './index.css'

// Find the root DOM node (typically a <div id="root"> in index.html)
// and create a React root to render the application into.
ReactDOM.createRoot(document.getElementById('root')).render(
  // React.StrictMode is a wrapper that checks for potential problems in the app during development.
  // It does not render any visible UI and is removed in production builds.
  <React.StrictMode>
    {/* BrowserRouter provides routing capabilities to the entire application.
        It must be an ancestor of any component that uses routing features like <Route> or <Link>. */}
    <BrowserRouter>
      {/* ScrollToTop ensures that the page scrolls to the top when the route changes. */}
      <ScrollToTop />
      {/* The <App /> component is the main entry point for the application's UI. */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
