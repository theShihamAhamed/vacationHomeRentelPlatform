import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHomeStore } from "../stores/useHomeStore";

export default function AllHomes() {
  const fetchAllHomes = useHomeStore((state) => state.fetchAllHomes);
  const homes = useHomeStore((state) => state.homes);
  const loading = useHomeStore((state) => state.loading);
  const error = useHomeStore((state) => state.error);

  useEffect(() => {
    fetchAllHomes();
  }, [fetchAllHomes]);

  if (loading) return <p>Loading homes...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!homes.length) return <p>No homes available.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Homes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {homes.map((home) => (
          <div key={home._id} className="bg-white shadow rounded overflow-hidden">
            <img
              src={home.images[0]}
              alt={home.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{home.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {home.location.city}, {home.location.province}
              </p>
              <p className="text-green-700 font-bold mb-2">Rs. {home.price}</p>
              <Link
                to={`/home/${home._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
