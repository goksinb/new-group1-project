import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./MovieContext";
import ErrorBoundary from "./ErrorBoundary";
import "./App.css";
import "./SearchList.css";
import CookieBanner from './CookieBanner';

// Lazy load components (makes the app load faster)
const SearchList = lazy(() => import("./SearchList"));
const WatchList = lazy(() => import("./WatchList"));

function App() {
  return (
    <div className="app-container">
      <CookieBanner />
      
      <ErrorBoundary>
        <MovieProvider>
          <div className="App">
            {/* Show "Loading..." when components are being loaded */}
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<SearchList />} />
                <Route path="/watchlist" element={<WatchList />} />
              </Routes>
            </Suspense>
          </div>
        </MovieProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;