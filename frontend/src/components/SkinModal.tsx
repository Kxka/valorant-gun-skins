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
                <span className={`detail-value cost ${typeof skin.cost === 'string' ? 'string-cost' : ''}`}>
                  {typeof skin.cost === 'number' ? `${skin.cost} VP` : 
                   skin.cost === 'Contract Reward' ? 
                     // Map agent contract skins to their agent names
                     (() => {
                       const agentMappings: { [key: string]: string } = {
                         'Eclipse Ghost': 'Astra',
                         'RagnaRocker Frenzy': 'Breach',
                         'Peacekeeper Sheriff': 'Brimstone',
                         'Finesse Classic': 'Chamber',
                         'Flutter Ghost': 'Clove',
                         'Hush Ghost': 'Cypher',
                         'Resolution Classic': 'Deadlock',
                         'Karabasan Shorty': 'Fade',
                         'Sidekick Shorty': 'Gekko',
                         'Wayfarer Sheriff': 'Harbor',
                         'Mythmaker Sheriff': 'Iso',
                         'Game Over Sheriff': 'Jett',
                         'FIRE/arm Classic': 'KAY/O',
                         'Wunderkind Shorty': 'Killjoy',
                         'Live Wire Frenzy': 'Neon',
                         'Soul Silencer Ghost': 'Omen',
                         'Spitfire Frenzy': 'Phoenix',
                         'Pistolinha Classic': 'Raze',
                         'Vendetta Ghost': 'Reyna',
                         'Final Chamber Classic': 'Sage',
                         'Swooping Frenzy': 'Skye',
                         'Protektor Sheriff': 'Sova',
                         'Snakebite Shorty': 'Viper',
                         'Steel Resolve Classic': 'Vyse',
                         'Hard Bargain Shorty': 'Tejo',
                         'Death Wish Sheriff': 'Yoru',
                         'Kaleidoscope Frenzy': 'Waylay'
                       };
                       return agentMappings[skin.name] || 'Contract Reward';
                     })() 
                   : skin.cost}
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Skin Variants:</span>
                <span className="detail-value">
                  {skin.hasColorVariants && skin.colorVariants && skin.colorVariants.length > 0 
                    ? (() => {
                        const extractColorName = (variantName: string): string => {
                          // Extract color from patterns like "(Variant 1 Black)" or "(Variant 2 Purple/Pink)"
                          const match = variantName.match(/\(Variant \d+ ([^)]+)\)/);
                          if (match) {
                            return match[1];
                          }
                          // If no variant pattern found and it's the base skin, return 'Default'
                          if (!variantName.includes('Variant') && variantName === skin.name) {
                            return 'Default';
                          }
                          return variantName;
                        };
                        
                        const colorNames = skin.colorVariants
                          .map(variant => extractColorName(variant.name))
                          .filter(name => name !== 'Default') // Remove default variant from display
                          .filter((name, index, array) => array.indexOf(name) === index); // Remove duplicates
                        
                        return colorNames.length > 0 ? colorNames.join(', ') : 'Default Only';
                      })()
                    : 'None'
                  }
                </span>
              </div>

              <div className="detail-row">
                <span className="detail-label">Unlockable Levels:</span>
                <span className="detail-value">
                  {skin.hasAnimations 
                    ? (() => {
                        // Extract level information from variant names
                        const extractLevels = (variants: any[]): number => {
                          const levelMatches = variants
                            .map(variant => variant.name.match(/Level (\d+)/))
                            .filter(match => match !== null)
                            .map(match => parseInt(match![1]));
                          
                          // Return the highest level found, or default to 1 if none found but hasAnimations is true
                          return levelMatches.length > 0 ? Math.max(...levelMatches) : 1;
                        };
                        
                        const maxLevel = extractLevels(skin.colorVariants || []);
                        return maxLevel > 1 ? `${maxLevel} Levels` : '1 Level';
                      })()
                    : 'None'
                  }
                </span>
              </div>
            </div>

            <div className="modal-description">
              <h4>Description</h4>
              <p>{skin.description}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinModal;