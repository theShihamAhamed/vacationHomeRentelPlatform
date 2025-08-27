import React, { useState, useCallback, useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { GoogleMap } from "@react-google-maps/api";
import { useHomeStore } from "../stores/useHomeStore.js";
import PlacesAutocompleteInput from "../components/PlacesAutocompleteInput.jsx";
import { useMap } from "../../provider/GoogleMapsProvider.jsx";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

export default function AddNewHome() {
  const feature = [
    "AC Rooms",
    "Luxury Specs",
    "Hot Water",
    "Mainline Water",
    "3 Phase Electricity",
    "Colonial Architecture",
    "Garage",
    "Lawn/Garden",
    "Attached Toilets",
    "Maid's Toilet",
    "Overhead Water Storage",
    "24 Hour Security",
    "Internet",
  ];
  const methods = useForm({
    defaultValues: {
      title: "",
      description: "",
      province: "",
      district: "",
      city: "",
      address: "",
      latitude: defaultCenter.lat,
      longitude: defaultCenter.lng,
      price: "",
      bedrooms: "",
      bathrooms: "",
      floorArea: "",
      floors: "",
      landArea: "",
      parking: "",
      features: [],
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const createHome = useHomeStore((state) => state.createHome);
  const { isLoaded, loadError } = useMap();
  const loading = useHomeStore((state) => state.loading);
  const error = useHomeStore((state) => state.error);

  const [images, setImages] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const updateMarkerPosition = (lat, lng) => {
    setMarkerPosition({ lat, lng });
    setValue("latitude", lat);
    setValue("longitude", lng);
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
    }
  };

  const onMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      updateMarkerPosition(lat, lng);
    },
    [setValue]
  );

  useEffect(() => {
    if (isLoaded && mapRef.current && window.google) {
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          position: markerPosition,
          map: mapRef.current,
          title: "Property Location",
          draggable: true,
        });

        markerRef.current.addListener("dragend", (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          updateMarkerPosition(lat, lng);
        });
      } else {
        markerRef.current.setPosition(markerPosition);
      }
    }
  }, [isLoaded, markerPosition]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      alert("Max 10 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const homeData = { ...data, images };
    try {
      await createHome(homeData);
      alert("Home created successfully");
      setImages([]);
      window.location.reload();
    } catch (error) {
      console.error("Failed to create home:", error);
    }
  };

  if (loadError)
    return <p className="text-red-500 text-center">Map failed to load</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Add New Home</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Info */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">Basic Info</h2>
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Title"
              className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition rounded-lg p-3 w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
            <textarea
              {...register("description")}
              placeholder="Description"
              rows={4}
              className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition rounded-lg p-3 w-full"
            />
          </section>

          {/* Location */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PlacesAutocompleteInput
                name="province"
                label="Province"
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{ required: "Province required" }}
                options={{
                  types: ["administrative_area_level_1"],
                  componentRestrictions: { country: "lk" },
                }}
              />
              <PlacesAutocompleteInput
                name="district"
                label="District"
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{ required: "District required" }}
                options={{
                  types: ["administrative_area_level_2"],
                  componentRestrictions: { country: "lk" },
                }}
              />
              <PlacesAutocompleteInput
                name="city"
                label="City"
                register={register}
                setValue={setValue}
                watch={watch}
                validation={{ required: "City required" }}
                options={{
                  types: ["locality"],
                  componentRestrictions: { country: "lk" },
                }}
              />
            </div>

            <input
              {...register("address", { required: "Address required" })}
              placeholder="Address"
              className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition rounded-lg p-3 w-full"
            />

            <div className="h-[300px] rounded-lg overflow-hidden border border-slate-300">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={markerPosition}
                  zoom={10}
                  onClick={onMapClick}
                  onLoad={onMapLoad}
                />
              ) : (
                <p className="text-center text-slate-500">Loading map...</p>
              )}
            </div>
          </section>

          {/* Pricing & Capacity */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">
              Pricing & Capacity
            </h2>
            <input
              {...register("price", {
                required: "Price required",
                valueAsNumber: true,
              })}
              placeholder="Price"
              type="number"
              className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition rounded-lg p-3 w-full"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: "bedrooms", placeholder: "Bedrooms" },
                { name: "bathrooms", placeholder: "Bathrooms/WCs" },
                { name: "floorArea", placeholder: "Floor Area (sq.ft.)" },
                { name: "floors", placeholder: "No. of Floors" },
                { name: "landArea", placeholder: "Land Area" },
                { name: "parking", placeholder: "Car Parking Spaces" },
              ].map((field) => (
                <input
                  key={field.name}
                  {...register(field.name, { valueAsNumber: true })}
                  placeholder={field.placeholder}
                  type="number"
                  className="border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition rounded-lg p-3"
                />
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">
              Property Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {feature.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center gap-2 text-slate-600"
                >
                  <input
                    type="checkbox"
                    {...register("features")}
                    value={feature}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  {feature}
                </label>
              ))}
            </div>
          </section>

          {/* Images */}
          <section className="bg-white shadow-sm border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-700">Images</h2>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="flex flex-wrap gap-4 mt-2">
              {images.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg overflow-hidden shadow"
                  >
                    <img
                      src={url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 transition text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Submit */}
          <div className="flex gap-4 items-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 rounded-lg text-white font-medium shadow-sm transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
            {error && (
              <p className="text-red-500 text-sm">Failed to publish: {error}</p>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
