import React, { useState, useEffect } from 'react';
import { LucideContact, LucideAlertCircle } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Animal {
  id: number;
  name: string;
  age: string;
  size: string;
  type: string;
  imageurl: string;
  description: string;
  phonenumber: string;
  provincia: string;
  ciudad: string;
}

const AnimalCard: React.FC<{ animal: Animal }> = ({ animal }) => {
  const handleReportAdopted = () => {
    MySwal.fire({
      title: "¿Reportar que ya está adoptado?",
      text: "Esto enviará un mensaje por WhatsApp.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, reportar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(
          `https://wa.me/543764857987?text=El%20animal%20de%20ID%20${encodeURIComponent(
            animal.id
          )}%20ya%20fue%20adoptado.`,
          "_blank"
        );
        MySwal.fire(
          "¡Reportado!",
          "El mensaje ha sido enviado correctamente.",
          "success"
        );
      }
    });
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={animal.imageurl}
        alt={animal.name}
        className="w-full h-auto object-cover"
      />
      <div className="absolute top-0 left-0 bg-white px-2 py-1 m-2 rounded-md">
        <span className="font-bold text-gray-800">{animal.name}</span>
      </div>
      <div className="absolute bottom-0 left-0 bg-white px-2 py-1 m-2 rounded-md">
        <span className="text-sm text-gray-600">{animal.age}</span>
      </div>
      <div className="absolute top-0 right-0 bg-white p-2 m-2 flex space-x-2">
        <a
          href={`https://wa.me/${animal.phonenumber}?text=Quiero%20adoptar%20a%20${encodeURIComponent(
            animal.name
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LucideContact className="w-6 h-6 text-green-500" />
        </a>
        <button onClick={handleReportAdopted}>
          <LucideAlertCircle className="w-6 h-6 text-red-500" />
        </button>
      </div>
      <div className="absolute bottom-0 right-0 bg-blue-500 px-2 py-1 m-2 rounded-md">
        <span className="text-sm text-white">{animal.size}</span>
      </div>
    </div>
  );
};


const AnimalList: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [provinceFilter, setProvinceFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch('https://shelty-backend.onrender.com/api/animals');
        if (!response.ok) throw new Error('Error al cargar animales');
        const data = await response.json();
        setAnimals(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  const filteredAnimals = animals.filter(animal =>
    (animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm.split(' ').some(term => 
      animal.description.toLowerCase().includes(term.toLowerCase()) ||
      animal.size.toLowerCase().includes(term.toLowerCase())
    )) &&
    (speciesFilter === '' || animal.type.toLowerCase() === speciesFilter.toLowerCase()) &&
    (sizeFilter === '' || animal.size.toLowerCase() === sizeFilter.toLowerCase()) &&
    (provinceFilter === '' || animal.provincia.toLowerCase() === provinceFilter.toLowerCase()) &&
    (cityFilter === '' || animal.ciudad.toLowerCase() === cityFilter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <input
            type="text"
            placeholder="¿Qué tipo de animal estás buscando?"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {['speciesFilter', 'sizeFilter', 'provinceFilter', 'cityFilter'].map((filter) => (
              <select
                key={filter}
                className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                value={eval(filter)}
                onChange={(e) => eval(`set${filter.charAt(0).toUpperCase() + filter.slice(1)}`)(e.target.value)}
              >
                <option value="">
                  {filter === 'speciesFilter' ? 'Todas las especies' :
                   filter === 'sizeFilter' ? 'Todos los tamaños' :
                   filter === 'provinceFilter' ? 'Todas las provincias' :
                   'Todos los municipios'}
                </option>
                {filter === 'speciesFilter' ? 
                  ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  )) :
                 filter === 'sizeFilter' ?
                  ['Pequeño', 'Mediano', 'Grande'].map(option => (
                    <option key={option} value={option}>{option}</option>
                  )) :
                 filter === 'provinceFilter' ?
                  [...new Set(animals.map(animal => animal.provincia))].map(option => (
                    <option key={option} value={option}>{option}</option>
                  )) :
                  [...new Set(animals.map(animal => animal.ciudad))].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))
                }
              </select>
            ))}
          </div>
        </div>

        {filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
            <img 
              src="https://i.imgur.com/PWbuTUp.jpeg"
              alt="No hay resultados" 
              className="mb-6 w-48 h-48 object-contain"
            />
            <p className="text-2xl font-bold text-gray-800">¡No hay animales que sigan ese criterio!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalList;