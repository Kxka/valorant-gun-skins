const service = require('./backend/services/valorantApiService');

// Test the agent detection directly
console.log('Testing agent detection:');
console.log('Final Chamber Classic:', service.getAgentFromSkin('Final Chamber Classic'));
console.log('Death Wish Sheriff:', service.getAgentFromSkin('Death Wish Sheriff'));
console.log('Game Over Sheriff:', service.getAgentFromSkin('Game Over Sheriff'));

// Test price calculation
console.log('\nTesting price calculation:');
console.log('Final Chamber Classic price:', service.calculatePrice('Select', 'Classic', 'Final Chamber Classic', 'Final Collection'));
console.log('Death Wish Sheriff price:', service.calculatePrice('Select', 'Sheriff', 'Death Wish Sheriff', 'Death Wish Collection'));

// Create a mock skin object to test transformSkinData
const mockWeapon = {
  uuid: 'test-weapon-uuid',
  displayName: 'Classic'
};

const mockSkin = {
  uuid: 'test-skin-uuid',
  displayName: 'Final Chamber Classic',
  contentTierUuid: 'test-tier-uuid',
  chromas: [{
    displayName: 'Final Chamber Classic',
    fullRender: 'test-image-url'
  }],
  levels: [{}] // Single level = no animations
};

const mockContentTiers = [{
  uuid: 'test-tier-uuid',
  displayName: 'Select Edition'
}];

console.log('\nTesting transformSkinData:');
const transformedSkin = service.transformSkinData(mockWeapon, mockSkin, mockContentTiers);
console.log('Transformed skin:', JSON.stringify(transformedSkin, null, 2));