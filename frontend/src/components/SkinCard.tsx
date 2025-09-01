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
      case 'select': return '#4a90e2';      // Official blue
      case 'deluxe': return '#27d545';      // Official green
      case 'premium': return '#d946ef';     // Official pink/magenta
      case 'exclusive': return '#ff8a00';   // Official orange
      case 'ultra': return '#ffd700';       // Official gold/yellow
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
            <div className="feature-icon variants" title="Variants Available">
              <img src="/variant-icon-transparent.png" alt="Variants" className="feature-icon-image" />
            </div>
          )}
          
          {skin.hasAnimations && (
            <div className="feature-icon levels" title="Levels Available">
              <img src="/lock-logo.png" alt="Levels" className="feature-icon-image" />
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
          <span className={`skin-cost ${typeof skin.cost === 'string' ? 'string-cost' : ''}`}>
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
        
        <div className="collection-name">{skin.collection}</div>
      </div>
    </div>
  );
};

export default SkinCard;