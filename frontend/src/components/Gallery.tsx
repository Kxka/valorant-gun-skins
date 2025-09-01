import React, { useState, useEffect, useCallback } from 'react';
import { Skin } from '../types';
import { skinApi } from '../api';
import SkinCard from './SkinCard';
import SkinModal from './SkinModal';
import FilterBar from './FilterBar';
import './Gallery.css';

interface GalleryProps {
  filters: {
    weapon: string;
    rarity: string;
    collection: string;
    search: string;
    priceMin: string;
    priceMax: string;
  };
  onFilterChange: (filters: any) => void;
}

const Gallery: React.FC<GalleryProps> = ({ filters, onFilterChange }) => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkins = async () => {
    try {
      setLoading(true);
      const data = await skinApi.getAllSkins();
      setSkins(data);
      setError(null);
    } catch (err) {
      setError('Failed to load skins. Please try again.');
      console.error('Error fetching skins:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    if (skins.length === 0) {
      return;
    }
    
    let filtered = [...skins];

    // Apply weapon filter (handles both navbar and filter bar selections)
    if (filters.weapon) {
      const weaponFilter = filters.weapon.toLowerCase();
      filtered = filtered.filter(skin => {
        const skinWeapon = skin.weaponType.toLowerCase();
        
        // Handle weapon categories from navbar
        switch (weaponFilter) {
          case 'rifle':
            return ['vandal', 'phantom', 'guardian', 'bulldog'].includes(skinWeapon);
          case 'sidearm':
            return ['sheriff', 'ghost', 'classic', 'frenzy', 'shorty'].includes(skinWeapon);
          case 'sniper':
            return ['operator', 'marshal', 'outlaw'].includes(skinWeapon);
          case 'smg':
            return ['spectre', 'stinger'].includes(skinWeapon);
          case 'shotgun':
            return ['bucky', 'judge'].includes(skinWeapon);
          case 'machinegun':
            return ['odin', 'ares'].includes(skinWeapon);
          case 'melee':
            return skinWeapon === 'melee';
          default:
            // Handle direct weapon name match from filter bar
            return skinWeapon === weaponFilter;
        }
      });
    }

    if (filters.rarity) {
      filtered = filtered.filter(skin => 
        skin.rarity.toLowerCase() === filters.rarity.toLowerCase()
      );
    }

    if (filters.collection) {
      filtered = filtered.filter(skin => 
        skin.collection.toLowerCase().includes(filters.collection.toLowerCase())
      );
    }

    if (filters.search) {
      filtered = filtered.filter(skin =>
        skin.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        skin.weaponType.toLowerCase().includes(filters.search.toLowerCase()) ||
        skin.collection.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.priceMin) {
      const minPrice = parseInt(filters.priceMin);
      filtered = filtered.filter(skin => skin.cost >= minPrice);
    }

    if (filters.priceMax) {
      const maxPrice = parseInt(filters.priceMax);
      filtered = filtered.filter(skin => skin.cost <= maxPrice);
    }

    // Sort by cost (highest to lowest) by default
    filtered.sort((a, b) => b.cost - a.cost);
    
    setFilteredSkins(filtered);
  }, [skins, filters]);

  useEffect(() => {
    fetchSkins();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSkinClick = (skin: Skin) => {
    setSelectedSkin(skin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkin(null);
  };

  // handleFilterChange is now passed as a prop from App.tsx


  if (loading) {
    return (
      <div className="gallery-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading skins...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-container">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchSkins} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">

      <FilterBar 
        filters={filters}
        onFilterChange={onFilterChange}
        totalSkins={skins.length}
        filteredCount={filteredSkins.length}
      />

      <div className="gallery gallery-grid">
        {filteredSkins.map((skin) => (
          <SkinCard
            key={skin.id}
            skin={skin}
            onClick={() => handleSkinClick(skin)}
          />
        ))}
      </div>

      {filteredSkins.length === 0 && !loading && (
        <div className="no-results">
          <h3>No skins found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}

      {selectedSkin && (
        <SkinModal
          skin={selectedSkin}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Gallery;