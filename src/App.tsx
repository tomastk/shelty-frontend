import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimalList from './components/AnimalList';
import PublishAnimal from './components/PublishAnimal';
import AnimalMap from './components/AnimalMap';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<AnimalList />} />
            <Route path="/publicar" element={<PublishAnimal />} />
            <Route path="/mapa" element={<AnimalMap />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;