#!/bin/bash

echo "🚀 Preparing for deployment..."

# Build client
echo "📦 Building client..."
cd client
npm install
npm run build
cd ..

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --only=production

echo "✅ Ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'Ready for deployment' && git push"
echo "2. Deploy on Railway: https://railway.app"
echo "3. Deploy on Render: https://render.com"
echo "4. Deploy on Vercel: https://vercel.com"
