"use client";

import React from "react";
import { Location } from "./CustomMap"; // Adjust the import path as necessary
import { haversineDistance } from "./Utils"; // Import the function

interface SidebarProps {
  showLocations: boolean;
  userLocation: { lat: number; lng: number } | null;
  userAddress: string | null;
  locations: Location[];
  handleLocationClick: (location: Location) => void;
  toggleLocations: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  showLocations,
  userLocation,
  userAddress,
  locations,
  handleLocationClick,
}) => {
  return (
    <>
      {showLocations && (
        <div className="bg-white p-4 overflow-y-auto w-1/4 h-full shadow-lg">
          <h2 className="text-xl font-bold mb-4">Locations</h2>
          <ul>
            {userLocation && (
              <li
                className="cursor-pointer mb-2 bg-green-200 p-2 rounded"
                onClick={() => {
                  const currentLocation: Location = {
                    id: 0,
                    title: "Current Location",
                    description: "You are currently here",
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                    image: "",
                  };
                  handleLocationClick(currentLocation);
                }}
              >
                You are here: {userAddress ? userAddress : "Fetching address..."}
              </li>
            )}
            {locations.map((location) => {
              const distance = userLocation
                ? haversineDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)
                : 0;
              return (
                <li
                  key={location.id}
                  className="flex justify-between cursor-pointer mb-2"
                  onClick={() => handleLocationClick(location)}
                >
                  <span>{location.title}</span>
                  <span>{distance.toFixed(2)} km</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;