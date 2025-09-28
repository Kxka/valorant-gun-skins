import React, { useState, useCallback } from 'react';
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

  const handleWeaponFilter = useCallback((weapon: string) => {
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
  }, []);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="App">
      <Header onWeaponFilter={handleWeaponFilter} />
      <main>
        <Gallery filters={filters} onFilterChange={handleFilterChange} />
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        fontSize: '12px',
        color: '#888',
        opacity: 0.85
      }}>
        Contact me on X <a
          href="https://x.com/kxka1200?s=21&t=e1PccuS0q2e0yZXdGJjyew"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#999',
            textDecoration: 'none',
            fontSize: '12px',
            transition: 'color 0.2s ease'
          }}
          onMouseOver={(e) => (e.target as HTMLAnchorElement).style.color = '#bbb'}
          onMouseOut={(e) => (e.target as HTMLAnchorElement).style.color = '#999'}
        >
          @kxka1200
        </a>
      </footer>
    </div>
  );
}

export default App;
