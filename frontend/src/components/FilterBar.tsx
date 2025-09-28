import React, { useState, useEffect } from 'react';
import { skinApi } from '../api';
import './FilterBar.css';

interface FilterBarProps {
  filters: {
    weapon: string;
    rarity: string;
    collection: string;
    search: string;
    priceMin: string;
    priceMax: string;
  };
  onFilterChange: (filters: any) => void;
  totalSkins: number;
  filteredCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFilterChange, 
  totalSkins, 
  filteredCount 
}) => {
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [availableRarities, setAvailableRarities] = useState<string[]>([]);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      // Fetch weapon types
      const types = await skinApi.getWeaponTypes();
      
      // Use only individual weapon types from API
      setWeaponTypes(types);

      // Fetch all skins to extract rarities and collections
      const allSkins = await skinApi.getAllSkins();
      
      // Extract unique rarities and sort by tier order (increasing rarity)
      const rarityOrder = ['Select', 'Deluxe', 'Premium', 'Exclusive', 'Ultra'];
      const uniqueRarities = Array.from(new Set(allSkins.map(skin => skin.rarity)));
      const rarities = uniqueRarities.sort((a, b) => {
        const indexA = rarityOrder.indexOf(a);
        const indexB = rarityOrder.indexOf(b);
        // If rarity not found in order, put it at the end
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
      setAvailableRarities(rarities);

      // Extract unique collections
      const collections = Array.from(new Set(allSkins.map(skin => skin.collection))).sort();
      setAvailableCollections(collections);

    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    onFilterChange({
      weapon: '',
      rarity: '',
      collection: '',
      search: '',
      priceMin: '',
      priceMax: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search skins..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <svg className="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
          </svg>
        </div>

        <div className="filter-selects">
          <select
            value={weaponTypes.includes(filters.weapon) ? filters.weapon : ''}
            onChange={(e) => handleFilterChange('weapon', e.target.value)}
            className="filter-select"
          >
            <option value="">All Weapons</option>
            {weaponTypes.map((weapon) => (
              <option key={weapon} value={weapon}>
                {weapon === 'Melee' ? 'Melee' : weapon}
              </option>
            ))}
          </select>

          <select
            value={filters.rarity}
            onChange={(e) => handleFilterChange('rarity', e.target.value)}
            className="filter-select"
          >
            <option value="">All Rarities</option>
            {availableRarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>

          <select
            value={filters.collection}
            onChange={(e) => handleFilterChange('collection', e.target.value)}
            className="filter-select"
          >
            <option value="">All Collections</option>
            {availableCollections.map((collection) => (
              <option key={collection} value={collection}>
                {collection.replace(/ COLLECTION$/i, '').replace(/ Collection$/i, '')}
              </option>
            ))}
          </select>

          <div className="price-range-container">
            <input
              type="number"
              placeholder="Min VP"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="price-input"
              min="0"
              max="5000"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max VP"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="price-input"
              min="0"
              max="5000"
            />
          </div>
        </div>

        <button 
          onClick={clearFilters} 
          className="clear-filters-button"
          style={{ opacity: hasActiveFilters ? 1 : 0.6 }}
        >
          Clear Filters
        </button>
      </div>

      <div className="filter-results">
        <span className="results-text">
          Showing {filteredCount} of {totalSkins} skins
        </span>
        <span className="legend-text">
          <img src="/variant-icon-transparent.png" alt="Skin Variants" className="legend-icon" /> Skin Variants • <img src="/lock-logo.png" alt="Unlockable Levels" className="legend-icon" /> Unlockable Levels
        </span>
      </div>
    </div>
  );
};

export default FilterBar;