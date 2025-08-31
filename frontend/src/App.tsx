import React, { useState } from 'react';
import Header from './components/Header';
import Gallery from './components/Gallery';
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    weapon: '',
    rarity: '',
    collection: '',
    search: '',
    priceMin: '',
    priceMax: ''
  });

  const handleWeaponFilter = (weapon: string) => {
    setFilters({
      weapon: weapon,
      rarity: '',
      collection: '',
      search: '',
      priceMin: '',
      priceMax: ''
    });
    
    // Scroll to top when selecting from navbar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="App">
      <Header onWeaponFilter={handleWeaponFilter} />
      <main>
        <Gallery filters={filters} onFilterChange={handleFilterChange} />
      </main>
    </div>
  );
}

export default App;
