import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./MovieContext";
import ErrorBoundary from "./ErrorBoundary";
import "./App.css";
import "./SearchList.css";

// Lazy load components for better performance
const SearchList = lazy(() => import("./SearchList"));
const WatchList = lazy(() => import("./WatchList"));

function App() {
  return (
    // ErrorBoundary catches and handles any errors that occur in child components
    <ErrorBoundary>
      {/* MovieProvider wraps the app to provide global state management */}
      <MovieProvider>
        <div className="App">
          {/* Suspense provides a fallback UI while lazy-loaded components are being loaded */}
          <Suspense fallback={<div>Loading...</div>}>
            {/* Routes define the navigation structure of the app */}
            <Routes>
              <Route path="/" element={<SearchList />} />
              <Route path="/watchlist" element={<WatchList />} />
            </Routes>
          </Suspense>
        </div>
      </MovieProvider>
    </ErrorBoundary>
  );
}

export default App;
