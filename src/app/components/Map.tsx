// src/app/components/Map.tsx
"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Location } from "./CustomMap"; // Ajusta la ruta de importación según sea necesario
import L from "leaflet"; // Import Leaflet

interface MapProps {
  userLocation: { lat: number; lng: number } | null;
  userAddress: string | null;
  locations: Location[];
  handleLocationClick: (location: Location) => void;
  targetLocation: { lat: number; lng: number } | null; // Asegúrate de que esto esté definido
}

// Icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icono para la ubicación del usuario
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para centrar el mapa
const CenterMap: React.FC<{ targetLocation: { lat: number; lng: number } | null; userLocation: { lat: number; lng: number } | null }> = ({ targetLocation, userLocation }) => {
  const map = useMap(); // Obtener la instancia del mapa

  useEffect(() => {
    if (targetLocation) {
      map.setView([targetLocation.lat, targetLocation.lng], 12); // Centrar el mapa en la ubicación seleccionada
    } else if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 12); // Centrar el mapa en la ubicación del usuario
    }
  }, [targetLocation, userLocation, map]);

  return null; // Este componente no renderiza nada
};

const Map: React.FC<MapProps> = ({
  userLocation,
  userAddress,
  locations,
  handleLocationClick,
  targetLocation, // Recibe targetLocation
}) => {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker key={location.id} position={[location.lat, location.lng]} icon={customIcon}>
          <Popup>
            <div className="max-w-sm">
              <h2 className="text-lg font-bold mb-2">{location.title}</h2>
              <img
                src={location.image}
                alt={location.title}
                className="w-full h-32 object-cover mb-2 rounded"
              />
              <p>{location.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="max-w-sm">
              <h2 className="text-lg font-bold mb-2">You are here</h2>
              <p>{userAddress ? userAddress : "Fetching address..."}</p>
            </div>
          </Popup>
        </Marker>
      )}
      <CenterMap targetLocation={targetLocation} userLocation={userLocation} /> {/* Agrega el componente CenterMap */}
    </MapContainer>
  );
};

export default Map;