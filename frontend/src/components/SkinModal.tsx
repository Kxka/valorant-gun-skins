import React from 'react';
import { Skin } from '../types';
import './SkinModal.css';

interface SkinModalProps {
  skin: Skin;
  isOpen: boolean;
  onClose: () => void;
}

const SkinModal: React.FC<SkinModalProps> = ({ skin, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getRarityColor = (rarity: string): string => {
    switch (rarity.toLowerCase()) {
      case 'select': return '#4a90e2';      // Official blue
      case 'deluxe': return '#27d545';      // Official green
      case 'premium': return '#d946ef';     // Official pink/magenta
      case 'exclusive': return '#ff8a00';   // Official orange
      case 'ultra': return '#ffd700';       // Official gold/yellow
      default: return '#ffffff';
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="skin-modal-backdrop" onClick={handleBackdropClick}>
      <div className="skin-modal">
        <button className="modal-close-button" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
          </svg>
        </button>

        <div className="modal-content">
          <div className="modal-image-section">
            <div className="modal-image-container">
              <img 
                src={skin.imageUrl} 
                alt={skin.name}
                className="modal-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-weapon-large.png';
                }}
              />
            </div>

            {skin.hasColorVariants && skin.colorVariants.length > 0 && (
              <div className="color-variants-section">
                <h4>Color Variants</h4>
                <div className="color-variants">
                  {skin.colorVariants.map((variant, index) => (
                    <div key={index} className="color-variant">
                      <div 
                        className="color-swatch"
                        style={{ backgroundColor: variant.color }}
                        title={variant.name}
                      ></div>
                      <span className="variant-name">{variant.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="modal-info-section">
            <div className="modal-header">
              <h2 className="modal-skin-name">{skin.name}</h2>
              <span 
                className="modal-rarity"
                style={{ color: getRarityColor(skin.rarity) }}
              >
                {skin.rarity}
              </span>
            </div>

            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Weapon Type:</span>
                <span className="detail-value">{skin.weaponType}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Collection:</span>
                <span className="detail-value">{skin.collection}</span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Cost:</span>
                <span className="detail-value cost">
                  {typeof skin.cost === 'number' ? `${skin.cost} VP` : skin.cost}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Color Variants:</span>
                <span className="detail-value">
                  {skin.hasColorVariants ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Special Animations:</span>
                <span className="detail-value">
                  {skin.hasAnimations ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            <div className="modal-description">
              <h4>Description</h4>
              <p>{skin.description}</p>
            </div>

            <div className="modal-features">
              {skin.hasColorVariants && (
                <div className="feature-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2C17.52,2 22,6.48 22,12C22,17.52 17.52,22 12,22C6.48,22 2,17.52 2,12C2,6.48 6.48,2 12,2M12,4C7.59,4 4,7.59 4,12C4,16.41 7.59,20 12,20C16.41,20 20,16.41 20,12C20,7.59 16.41,4 12,4M12,6L16,12H13V18H11V12H8L12,6Z"/>
                  </svg>
                  Color Variants
                </div>
              )}

              {skin.hasAnimations && (
                <div className="feature-badge">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C7.59,4 12,4M11,6V12L16.25,15.43L17.75,13.18L13.5,10.25V6H11Z"/>
                  </svg>
                  Special Animations
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinModal;