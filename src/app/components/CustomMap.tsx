'use client'

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import React from 'react'

// Definir la interfaz para las ubicaciones
interface Location {
  id: number
  title: string
  description: string
  lat: number
  lng: number
  image: string
}


// Icono personalizado para los marcadores
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Icono para la ubicación del usuario
const userIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Haversine formula to calculate distance between two points
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

const CenterMap = ({ userLocation, targetLocation }: { userLocation: { lat: number; lng: number } | null, targetLocation: { lat: number; lng: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      // Center the map around the user's location
      map.setView([userLocation.lat, userLocation.lng], 12); // Set zoom level to 12 for a closer view
    }
    if (targetLocation) {
      // Center the map around the clicked location
      map.setView([targetLocation.lat, targetLocation.lng], 12); // Set zoom level to 12 for a closer view
    }
  }, [userLocation, targetLocation, map]);

  return null;
};

export default function CustomMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Cargar las ubicaciones desde el archivo JSON
    if (typeof window !== 'undefined') {
      fetch('/locations.json')
        .then(response => response.json())
        .then(data => setLocations(data))
        .catch(error => console.error('Error loading locations:', error))

      // Obtener la ubicación del usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Obtener la dirección a partir de la ubicación del usuario
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(data => {
              if (data && data.display_name) {
                setUserAddress(data.address.road +'- '+data.address.neighbourhood );
              }
            })
            .catch(error => {
              console.error('Error fetching address:', error);
            });
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    }
  }, [])

  const handleLocationClick = (location: Location) => {
    setTargetLocation({ lat: location.lat, lng: location.lng });
  };

  // Sort locations by distance from user location
  const sortedLocations = userLocation
    ? [...locations].sort((a, b) => {
        const distanceA = haversineDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distanceB = haversineDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distanceA - distanceB; // Sort in ascending order
      })
    : locations;

  return (
    <div className="flex h-screen w-full">
      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Locations</h2>
        <ul>
          {userLocation && (
            <li className="cursor-pointer mb-2 bg-green-200 p-2 rounded" onClick={() => {
              const currentLocation: Location = {
                id: 0, // Assign a valid ID
                title: "Current Location", // Provide a title
                description: "You are currently here", // Provide a description
                lat: userLocation.lat,
                lng: userLocation.lng,
                image: "", // Provide a valid image URL
            };
            handleLocationClick(currentLocation)}}>
              You are here: {userAddress ? userAddress : "Fetching address..."}
            </li>
          )}
          {sortedLocations.map(location => {
            const distance = userLocation ? haversineDistance(userLocation.lat, userLocation.lng, location.lat, location.lng) : 0;
            return (
              <li key={location.id} className="flex justify-between cursor-pointer mb-2" onClick={() => handleLocationClick(location)}>
                <span>{location.title}</span>
                <span>{distance.toFixed(2)} km</span> {/* Distance aligned to the right */}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-3/4">
        <h1 className="text-center text-3xl font-bold mb-4">Places to Visit</h1>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map(location => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="max-w-sm">
                  <h2 className="text-lg font-bold mb-2">{location.title}</h2>
                  <img src={location.image} alt={location.title} className="w-full h-32 object-cover mb-2 rounded" />
                  <p>{location.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          {userLocation && (
            <>
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={userIcon}
              >
                <Popup>
                  <div className="max-w-sm">
                    <h2 className="text-lg font-bold mb-2">You are here</h2>
                    <p>{userAddress ? userAddress : "Fetching address..."}</p>
                  </div>
                </Popup>
              </Marker>
              <CenterMap userLocation={userLocation} targetLocation={targetLocation} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  )
}