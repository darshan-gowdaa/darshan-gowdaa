const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'assets', 'profile-picture.avif');
const destPath = path.join(__dirname, 'src', 'assets', 'profile-picture-small.avif');

if (fs.existsSync(srcPath)) {
    sharp(srcPath)
        .resize(350, 350)
        .toFile(destPath)
        .then(() => {
            console.log('Resized successfully');
            fs.renameSync(destPath, srcPath);
            console.log('Replaced original');
        })
        .catch(err => {
            console.error('Error resizing:', err);
        });
} else {
    console.log('File not found:', srcPath);
}
