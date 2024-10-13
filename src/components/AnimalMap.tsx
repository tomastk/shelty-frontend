'use client'

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Animal {
  id: number;
  name: string;
  age: string;
  size: string;
  type: string;
  imageurl: string;
  description: string;
  phoneNumber: string;
  latlong: string;
}

// Define the paw icon for grouped animals
const pawIcon = L.icon({
  iconUrl: 'https://i.pinimg.com/originals/ba/f0/6f/baf06f35c1f7b474b0ab7e54de1a3f3c.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Function to create a rounded icon for individual animals
const createRoundedIcon = (imageUrl: string) => {
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      ">
        <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
    `,
    className: 'rounded-pet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

export default function AnimalMap() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const apiUrl = 'https://shelty-backend.onrender.com/api/animals';

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Error al obtener los datos de los animales');
        }
        const data = await response.json();
        console.log(data);
        setAnimals(data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };

    fetchAnimals();
  }, [apiUrl]);

  // Group animals by coordinates
  const groupedAnimals: Record<string, Animal[]> = animals.reduce((acc, animal) => {
    const [lat, lng] = animal.latlong.split(',');
    const key = `${lat},${lng}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(animal);
    return acc;
  }, {} as Record<string, Animal[]>);

  return (
    <div className="h-[calc(100vh-200px)]">
      <MapContainer center={[-27.3665, -55.8969]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {Object.entries(groupedAnimals).map(([coords, animals]) => {
          const [lat, lng] = coords.split(',').map(Number);
          const icon = animals.length > 1 ? pawIcon : createRoundedIcon(animals[0].imageurl);

          return (
            <Marker key={coords} position={[lat, lng]} icon={icon}>
              <Popup>
                <div className="flex flex-col space-y-4 max-h-[300px] overflow-y-auto p-4">
                  {animals.map((animal) => (
                    <div key={animal.id} className="flex items-center border-b pb-2 last:border-b-0">
                      <div className="flex-none w-24 h-24 mr-4">
                        <img
                          src={animal.imageurl}
                          alt={animal.name}
                          className="w-full h-full object-cover rounded-full shadow-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{animal.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {animal.description.length > 50 ? `${animal.description.substring(0, 50)}...` : animal.description}
                        </p>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition duration-300 w-full"
                          onClick={() => {
                            console.log(animal);
                            const message = `¡Hola! Estoy interesado en adoptar a ${animal.name}`;
                            const whatsappUrl = `https://wa.me/${animal.phonenumber}?text=${encodeURIComponent(message)}`;
                            window.open(whatsappUrl, '_blank');
                          }}
                        >
                          Quiero adoptarlo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}