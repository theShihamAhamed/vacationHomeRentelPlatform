import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHomeStore } from "../stores/useHomeStore";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useMap } from "../../provider/GoogleMapsProvider"; // ✅ use provider

const containerStyle = {
  width: "100%",
  height: "300px",
};

export default function HomeDetails() {
  const { id } = useParams();
  const getHomeById = useHomeStore((state) => state.getHomeById);
  const loading = useHomeStore((state) => state.loading);
  const error = useHomeStore((state) => state.error);

  const [home, setHome] = useState(null);
  const { isLoaded } = useMap(); // ✅ from context

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const data = await getHomeById(id);
        setHome(data);
      } catch (err) {
        console.error("Failed to fetch home:", err.message);
      }
    };

    fetchHome();
  }, [id, getHomeById]);

  if (loading) return <p>Loading home details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!home) return <p>No home found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{home.title}</h1>
      <p>{home.description}</p>

      <div className="mt-4">
        <h2 className="font-semibold">Location</h2>
        <p>
          {home.location.address}, {home.location.city},{" "}
          {home.location.district}, {home.location.province}
        </p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold">Price</h2>
        <p>Rs. {home.price}</p>
      </div>

      <div className="mt-4">
        <h2 className="font-semibold">Features</h2>
        <ul className="list-disc pl-5">
          {home.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
        {home.images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Home image ${index + 1}`}
            className="w-full h-48 object-cover rounded"
          />
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Map Location</h2>
        <p className="text-sm text-gray-600 mb-2">
          📍 <strong>Lat:</strong> {home.location.latitude},{" "}
          <strong>Lon:</strong> {home.location.longitude}
        </p>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={{
              lat: home.location.latitude,
              lng: home.location.longitude,
            }}
            zoom={14}
          >
            <Marker
              position={{
                lat: home.location.latitude,
                lng: home.location.longitude,
              }}
            />
          </GoogleMap>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
}
