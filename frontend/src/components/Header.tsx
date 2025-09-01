import React from 'react';
import './Header.css';

interface HeaderProps {
  onWeaponFilter?: (weapon: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onWeaponFilter }) => {
  const weaponCategories = {
    rifles: ['Vandal', 'Phantom', 'Guardian', 'Bulldog'],
    sidearms: ['Sheriff', 'Ghost', 'Classic', 'Frenzy', 'Shorty'],
    snipers: ['Operator', 'Marshal', 'Outlaw'],
    shotguns: ['Bucky', 'Judge'],
    machineguns: ['Odin', 'Ares', 'Spectre', 'Stinger']
  };

  const handleWeaponClick = (weapon: string) => {
    if (onWeaponFilter) {
      onWeaponFilter(weapon);
    }
  };

  const handleCategoryClick = (category: string) => {
    if (onWeaponFilter) {
      onWeaponFilter(category);
    }
  };

  const handleShowAll = () => {
    if (onWeaponFilter) {
      onWeaponFilter('');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={handleShowAll} role="button" tabIndex={0}>
          <h1>VALORANT SKINS</h1>
        </div>
        
        <nav className="navigation">
          
          <div className="weapon-dropdown">
            <button onClick={() => handleCategoryClick('rifle')} className="dropdown-button">
              Rifles
              <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,10L12,15L17,10H7Z"/>
              </svg>
            </button>
            <div className="dropdown-content">
              {weaponCategories.rifles.map((weapon) => (
                <button 
                  key={weapon}
                  onClick={() => handleWeaponClick(weapon)}
                  className="dropdown-link"
                >
                  {weapon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="weapon-dropdown">
            <button onClick={() => handleCategoryClick('sidearm')} className="dropdown-button">
              Sidearms
              <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,10L12,15L17,10H7Z"/>
              </svg>
            </button>
            <div className="dropdown-content">
              {weaponCategories.sidearms.map((weapon) => (
                <button 
                  key={weapon}
                  onClick={() => handleWeaponClick(weapon)}
                  className="dropdown-link"
                >
                  {weapon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="weapon-dropdown">
            <button onClick={() => handleCategoryClick('sniper')} className="dropdown-button">
              Snipers
              <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,10L12,15L17,10H7Z"/>
              </svg>
            </button>
            <div className="dropdown-content">
              {weaponCategories.snipers.map((weapon) => (
                <button 
                  key={weapon}
                  onClick={() => handleWeaponClick(weapon)}
                  className="dropdown-link"
                >
                  {weapon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="weapon-dropdown">
            <button onClick={() => handleCategoryClick('shotgun')} className="dropdown-button">
              Shotguns
              <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,10L12,15L17,10H7Z"/>
              </svg>
            </button>
            <div className="dropdown-content">
              {weaponCategories.shotguns.map((weapon) => (
                <button 
                  key={weapon}
                  onClick={() => handleWeaponClick(weapon)}
                  className="dropdown-link"
                >
                  {weapon}
                </button>
              ))}
            </div>
          </div>
          
          <div className="weapon-dropdown">
            <button onClick={() => handleCategoryClick('machinegun')} className="dropdown-button">
              Machine Guns
              <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7,10L12,15L17,10H7Z"/>
              </svg>
            </button>
            <div className="dropdown-content">
              {weaponCategories.machineguns.map((weapon) => (
                <button 
                  key={weapon}
                  onClick={() => handleWeaponClick(weapon)}
                  className="dropdown-link"
                >
                  {weapon}
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={() => handleCategoryClick('melee')} className="nav-link">
            Melee
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;