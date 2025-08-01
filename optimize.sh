#!/bin/bash

echo "🚀 Starting FIATTIB Performance Optimization..."
echo "=================================================="

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p public/images/optimized public/js public/css

# Install dependencies if not present
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Optimize images
echo "🖼️  Optimizing images..."
cd public/images
for img in *.png; do
  if [ "$img" != "favicon.png" ] && [ -f "$img" ]; then
    echo "Processing $img..."
    cwebp -q 85 "$img" -o "optimized/${img%.png}.webp" 2>/dev/null || echo "⚠️  WebP conversion failed for $img"
  fi
done

# Create responsive image sizes
cd optimized
for img in *.webp; do
  if [ -f "$img" ]; then
    magick "$img" -resize "400x400>" "${img%.webp}_400.webp" 2>/dev/null || echo "⚠️  400px resize failed for $img"
    magick "$img" -resize "800x800>" "${img%.webp}_800.webp" 2>/dev/null || echo "⚠️  800px resize failed for $img"
  fi
done

cd ../../../

# Build optimized CSS
echo "🎨 Building optimized CSS..."
npx tailwindcss -i ./public/css/input.css -o ./public/css/tailwind.min.css --minify

# Download AlpineJS locally if not present
if [ ! -f "public/js/alpine.min.js" ]; then
  echo "⬇️  Downloading AlpineJS..."
  curl -s -o public/js/alpine.min.js https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js
fi

# Set executable permissions
chmod +x optimize-images.js performance-report.js

echo ""
echo "✅ Optimization complete!"
echo ""
echo "📊 Run 'node performance-report.js' to see detailed results"
echo "🚀 Start the server with 'npm start'"
echo ""
echo "🎉 Your FIATTIB site is now optimized for maximum performance!"