#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const imagesDir = './public/images';
const optimizedDir = './public/images/optimized';

// Ensure optimized directory exists
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

// Get all PNG files
const pngFiles = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.png'))
  .filter(file => !file.includes('favicon')); // Skip favicon

console.log('🖼️  Starting image optimization...');

pngFiles.forEach(file => {
  const inputPath = path.join(imagesDir, file);
  const baseName = path.basename(file, '.png');
  
  console.log(`Processing ${file}...`);
  
  // Create WebP versions
  const webpPath = path.join(optimizedDir, `${baseName}.webp`);
  const webp400Path = path.join(optimizedDir, `${baseName}_400.webp`);
  const webp800Path = path.join(optimizedDir, `${baseName}_800.webp`);
  
  try {
    // Original size WebP
    execSync(`cwebp -q 85 "${inputPath}" -o "${webpPath}"`);
    
    // 400px max WebP
    execSync(`magick "${webpPath}" -resize "400x400>" "${webp400Path}"`);
    
    // 800px max WebP  
    execSync(`magick "${webpPath}" -resize "800x800>" "${webp800Path}"`);
    
    console.log(`✅ Created: ${baseName}.webp, ${baseName}_400.webp, ${baseName}_800.webp`);
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

// Calculate savings
const originalSize = execSync(`du -sb ${imagesDir}/*.png | awk '{sum+=$1} END {print sum}'`).toString().trim();
const optimizedSize = execSync(`du -sb ${optimizedDir}/*.webp | awk '{sum+=$1} END {print sum}'`).toString().trim();

const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);

console.log('\n📊 Optimization Results:');
console.log(`Original PNG files: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
console.log(`Optimized WebP files: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
console.log(`Space saved: ${savings}% (${((originalSize - optimizedSize) / 1024 / 1024).toFixed(1)}MB)`);
console.log('\n🎉 Image optimization complete!');