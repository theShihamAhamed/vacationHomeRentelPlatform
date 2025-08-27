import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";

const Test = () => {
  const ownerId = "64f5a2d9f2d7b23e5a1f2b22";
  const [bookings, setBookings] = useState([]);

  // Load active bookings
  useEffect(() => {
    axiosInstance
      .get(`/booking/owner/${ownerId}`)
      .then((res) => {
        console.log("API response:", res.data);
        setBookings(res.data.data); // ✅ fix
      })
      .catch((err) => console.error(err));
  }, [ownerId]);

  useEffect(() => {
    console.log("bookings", bookings);
  }, [bookings]); // ✅ fix

  return <div>test</div>;
};

export default Test;
