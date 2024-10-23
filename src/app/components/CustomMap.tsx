"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Map from "./Map";

// Define the interface for locations
export interface Location {
  id: number;
  title: string;
  description: string;
  lat: number;
  lng: number;
  image: string;
}

export default function CustomMap() {
  const [showLocations, setShowLocations] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null); // Ensure this is defined

  useEffect(() => {
    if (typeof window !== "undefined") {
      fetch("/locations.json")
        .then((response) => response.json())
        .then((data) => setLocations(data))
        .catch((error) => console.error("Error loading locations:", error));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then((response) => response.json())
            .then((data) => {
              if (data && data.display_name) {
                setUserAddress(data.address.road + "- " + data.address.neighbourhood);
              }
            })
            .catch((error) => {
              console.error("Error fetching address:", error);
            });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  const handleLocationClick = (location: Location) => {
    setTargetLocation({ lat: location.lat, lng: location.lng }); // Update targetLocation
  };

  const toggleLocations = () => {
    setShowLocations(!showLocations);
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        showLocations={showLocations}
        userLocation={userLocation}
        userAddress={userAddress}
        locations={locations}
        handleLocationClick={handleLocationClick}
        toggleLocations={toggleLocations}
      />
      <div className="flex-1">
        <Header toggleLocations={toggleLocations} showLocations={showLocations} />
        <Map
          userLocation={userLocation}
          userAddress={userAddress}
          locations={locations}
          handleLocationClick={handleLocationClick}
          targetLocation={targetLocation} // Pass targetLocation here
        />
      </div>
    </div>
  );
}