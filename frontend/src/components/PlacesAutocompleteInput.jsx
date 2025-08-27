import { useState, useEffect, useRef } from "react";
import { useMap } from "../../provider/GoogleMapsProvider";
import { useFormContext } from "react-hook-form";

export default function PlacesAutocompleteInput({
  name,
  label,
  register,
  options = {},
  validation = {},
  className = "",
}) {
  const [predictions, setPredictions] = useState([]);
  const autocompleteService = useRef(null);
  const inputRef = useRef(null);

  const { watch, setValue } = useFormContext();
  const value = watch(name);

  const { isLoaded } = useMap();

  useEffect(() => {
    if (isLoaded && !autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleChange = (e) => {
    const text = e.target.value;
    setValue(name, text);

    if (!text || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      { input: text, ...options },
      (preds, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Remove ", Sri Lanka" from descriptions before setting state
          const cleanedPreds = preds.map((p) => ({
            ...p,
            description: p.description.replace(/,\s*Sri Lanka$/i, ""),
          }));
          setPredictions(cleanedPreds);
        } else {
          setPredictions([]);
        }
      }
    );
  };

  const selectPrediction = (pred) => {
    setValue(name, pred.description, {
      shouldValidate: true,
    });
    setPredictions([]);
  };

  return (
    <div className="relative">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        value={value || ""} // controlled value
        {...register(name, validation)}
        onChange={handleChange}
        ref={inputRef}
        className={`border p-2 rounded w-full ${className}`}
        autoComplete="off"
      />

      {predictions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full max-h-60 overflow-auto">
          {predictions.map((p) => (
            <li
              key={p.place_id}
              onClick={() => selectPrediction(p)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
