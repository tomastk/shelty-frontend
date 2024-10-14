'use client'

import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, Upload } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface Animal {
  id: number;
  name: string;
  age: string;
  size: string;
  description: string;
  imageUrl: string;
  phoneNumber: string;
  latLong: string;
  species: string;
}

export default function PublishAnimal() {
  const [formData, setFormData] = useState<Animal>({
    id: 0,
    name: '',
    age: '',
    size: '',
    description: '',
    imageUrl: '',
    phoneNumber: '',
    latLong: '',
    species: '',
  });

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Nuevo estado para la vista previa

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('https://shelty-backend.onrender.com/api/animals');
        if (!response.ok) {
          throw new Error('Failed to fetch animals');
        }
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error('Error fetching animals:', error);
        setErrorMessage('Hubo un problema al obtener la lista de animales.');
      }
    };

    fetchAnimals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prevState => ({
      ...prevState,
      phoneNumber: value || '',
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Crear la URL para la vista previa
    }
  };

  const uploadImageToCloudinary = async (file: File) => {
    const uploadPreset = "cuva9arb";
    const cloudName =  "dmfrjyvfv";
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset); // Replace with your Cloudinary upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, // Replace with your Cloudinary cloud name
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name || !formData.age || !formData.size || !formData.description || !imageFile || !formData.phoneNumber || !formData.species) {
      setErrorMessage('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    setLoading(true);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const latLong = `${latitude},${longitude}`;

      const imageUrl = await uploadImageToCloudinary(imageFile);

      const newAnimal = {
        ...formData,
        id: Date.now(),
        latLong,
        imageUrl,
      };

      const response = await fetch('https://shelty-backend.onrender.com/api/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAnimal),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al publicar el animal');
      }

      const result = await response.json();
      setAnimals([...animals, result.animal]);
      setSuccessMessage('¡Animal publicado con éxito!');

      setFormData({
        id: 0,
        name: '',
        age: '',
        size: '',
        description: '',
        imageUrl: '',
        phoneNumber: '',
        latLong: '',
        species: '',
      });
      setImageFile(null);
      setPreviewUrl(null); // Resetear la vista previa
    } catch (error: any) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Hubo un problema al publicar el animal.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La geolocalización no es compatible con este navegador.'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#0081a7] to-[#00afb9] text-white py-6 px-6">
        <h2 className="text-3xl font-bold">Publicar un Animal</h2>
        <p className="text-sm mt-2 opacity-80">Ayuda a un animal a encontrar un hogar</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00afb9]"></div>
            <span className="ml-2 text-[#0081a7] font-semibold">Publicando...</span>
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded" role="alert">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded" role="alert">
            <p>{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            id="name"
            label="Nombre"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nombre del animal"
          />
          <InputField
            id="age"
            label="Edad"
            value={formData.age}
            onChange={handleChange}
            placeholder="Ej: 2 años"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            id="species"
            label="Especie"
            value={formData.species}
            onChange={handleChange}
            options={[
              { value: "", label: "Seleccione especie" },
              { value: "Perro", label: "Perro" },
              { value: "Gato", label: "Gato" },
              { value: "Ave", label: "Ave" },
              { value: "Reptil", label: "Reptil" },
              { value: "Otro", label: "Otro" },
            ]}
          />
          <SelectField
            id="size"
            label="Tamaño"
            value={formData.size}
            onChange={handleChange}
            options={[
              { value: "", label: "Seleccione tamaño" },
              { value: "Pequeño", label: "Pequeño" },
              { value: "Mediano", label: "Mediano" },
              { value: "Grande", label: "Grande" },
            ]}
          />
        </div>

        <TextAreaField
          id="description"
          label="Descripción"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del animal"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Imagen</label>
          <div className="flex items-center mt-2">
            <label className="relative cursor-pointer">
              <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
              <span className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Camera className="mr-2 h-4 w-4" /> Seleccionar Imagen
              </span>
            </label>
            {imageFile && (
              <span className="ml-4 text-gray-600">{imageFile.name}</span>
            )}
          </div>

          {/* Contenedor de vista previa */}
          {previewUrl && (
            <div className="mt-4">
              <img src={previewUrl} alt="Vista previa" className="w-full h-auto rounded-md" />
            </div>
          )}
        </div>

        <PhoneInput
          placeholder="Número de teléfono"
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          className="mt-4"
        />

        <button
          type="submit"
          className="w-full py-2 bg-[#00afb9] text-white font-semibold rounded hover:bg-[#0081a7]"
        >
          Publicar Animal
        </button>
      </form>
    </div>
  );
}

const InputField = ({ id, label, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="text"
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-[#00afb9] focus:outline-none"
    />
  </div>
);

const SelectField = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-[#00afb9] focus:outline-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ id, label, value, onChange, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring focus:ring-[#00afb9] focus:outline-none"
    />
  </div>
);
