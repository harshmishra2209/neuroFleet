import { useState } from "react";

function LocationSearch({ placeholder, onSelect }) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchLocation = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&limit=5`
      );

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed");
    }
  };

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setResults([]);

    onSelect({
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      name: place.display_name,
    });
  };

  return (
    <div className="location-search">

      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => searchLocation(e.target.value)}
      />

      {results.length > 0 && (
        <div className="search-results">

          {results.map((place, index) => (
            <div
              key={index}
              className="search-item"
              onClick={() => handleSelect(place)}
            >
              {place.display_name}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default LocationSearch;