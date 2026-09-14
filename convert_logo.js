const sharp = require('sharp');
const fs = require('fs');

sharp('public/icons/travingat-logo.svg')
  .png()
  .toFile('public/icons/travingat-logo.png')
  .then(() => console.log('Successfully converted SVG to PNG'))
  .catch(err => console.error('Error converting SVG to PNG:', err));
