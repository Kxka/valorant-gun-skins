import React from 'react';
import { Skin } from '../types';
import './SkinCard.css';

interface SkinCardProps {
  skin: Skin;
  onClick: () => void;
}

const SkinCard: React.FC<SkinCardProps> = ({ skin, onClick }) => {
  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'select': return '#5e9bd1';
      case 'deluxe': return '#2eb398';
      case 'premium': return '#e374c7';
      case 'ultra': return '#f1975a';
      default: return '#ffffff';
    }
  };

  return (
    <div className="skin-card" onClick={onClick}>
      <div className="skin-card-image-container">
        <img 
          src={skin.thumbnailUrl} 
          alt={skin.name}
          className="skin-card-image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== window.location.origin + '/placeholder-weapon.png') {
              target.src = '/placeholder-weapon.png';
            }
          }}
        />
        
        <div className="skin-card-features">
          {skin.hasColorVariants && (
            <div className="feature-icon color-variants" title="Color Variants Available">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4C7.59,4 4,7.59 4,12C4,16.41 7.59,20 12,20C16.41,20 20,16.41 20,12C20,7.59 16.41,4 12,4M12,6L16,12H13V18H11V12H8L12,6Z"/>
              </svg>
            </div>
          )}
          
          {skin.hasAnimations && (
            <div className="feature-icon animations" title="Special Animations">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M11,6V12L16.25,15.43L17.75,13.18L13.5,10.25V6H11Z"/>
              </svg>
            </div>
          )}
        </div>

      </div>

      <div className="skin-card-info">
        <div className="skin-card-header">
          <h3 className="skin-name">{skin.name}</h3>
          <span 
            className="skin-rarity"
            style={{ color: getRarityColor(skin.rarity) }}
          >
            {skin.rarity}
          </span>
        </div>
        
        <div className="skin-card-details">
          <span className="weapon-type">{skin.weaponType}</span>
          <span className="skin-cost">{skin.cost} VP</span>
        </div>
        
        <div className="collection-name">{skin.collection}</div>
      </div>
    </div>
  );
};

export default SkinCard;