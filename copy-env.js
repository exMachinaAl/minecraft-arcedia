const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '.env');
const destPath = path.resolve(__dirname, 'client', '.env');

if (fs.existsSync(sourcePath)) {
  fs.copyFileSync(sourcePath, destPath);
  console.log('.env file copied to react-app folder');
} else {
  console.error(`Error: .env file not found at ${sourcePath}`);
}
