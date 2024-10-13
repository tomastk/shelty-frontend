import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
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

const PublishAnimal: React.FC = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name || !formData.age || !formData.size || !formData.description || !formData.imageUrl || !formData.phoneNumber || !formData.species) {
      setErrorMessage('Por favor, completa todos los campos antes de enviar.');
      return;
    }

    setLoading(true);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const latLong = `${latitude},${longitude}`;

      const newAnimal = {
        ...formData,
        id: Date.now(),
        latLong,
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

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00afb9] transition"
            rows={3}
            placeholder="Describe al animal"
          ></textarea>
        </div>

        <InputField
          id="imageUrl"
          label="URL de la Imagen"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="URL de la imagen del animal"
          icon={<Camera className="h-5 w-5 text-gray-400" />}
        />

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <PhoneInput
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00afb9] transition"
            placeholder="Número de teléfono"
            defaultCountry="AR"
            international
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-[#0081a7] hover:bg-[#00afb9] text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00afb9] focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};

interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, value, onChange, placeholder, icon }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type="text"
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00afb9] transition"
        placeholder={placeholder}
      />
      {icon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  </div>
);

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, value, onChange, options }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00afb9] transition"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </div>
);

export default PublishAnimal;
