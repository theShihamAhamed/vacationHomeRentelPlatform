import { useState } from "react";

import { Route, Routes } from "react-router-dom";
import Addhome from "./pages/addhome";
import HomeDetails from "./pages/HomeDetails";
import AllHomes from "./pages/AllHomes.jsx";
import { MapProvider } from "../provider/GoogleMapsProvider";
import BookHome from "./pages/BookHome";
import AdminDashboard from "./pages/adminDashboard";
import RoomOwnerDashboard from "./pages/RoomOwnerDashboard";
import HomePage from "./pages/HomePage";
import PropertyDetail from "./pages/test";
import Test from "./components/test";
import { Toaster } from "react-hot-toast";
import Wishlist from "./pages/whislistPage";
import Review from "./components/user/Review";

function App() {

  return (
    <>
      <MapProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/t" element={<Test />} />
          <Route path="/test/:id" element={<PropertyDetail />} />
          <Route path="/all-homes" element={<AllHomes />} />
          <Route path="/home/:id" element={<HomeDetails />} />
          <Route path="/add-home" element={<Addhome />} />
          <Route path="/book-home/:id" element={<BookHome />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/owner" element={<RoomOwnerDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/review/:bookingId" element={<Review />} />
        </Routes>
      </MapProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
