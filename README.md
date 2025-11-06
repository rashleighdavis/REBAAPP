# REBA - Real Estate Business Assistant

Voice-activated MLS property search app for realtors.

![REBA App](https://img.shields.io/badge/React-18.2-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.3-38bdf8)

## ✨ Features

- 🎤 **Voice-Activated Search** - Search properties by speaking addresses
- 🏠 **Complete Property Details** - Beds, baths, sqft, features
- 📊 **Sales History** - Full transaction timeline
- 💰 **Tax Information** - Annual taxes and assessed values  
- 📍 **Neighborhood Insights** - Schools, crime rates, appreciation
- 📱 **Mobile Responsive** - Works on any device
- 🚀 **Fast & Professional** - Built with React + Vite + Tailwind

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` to see the app.

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

**Quick Deploy to Vercel:**
```bash
npm run build
npx vercel
```

## 🔧 Setup Zillow API

1. Sign up at [RapidAPI](https://rapidapi.com/apimaker/api/zillow-com1)
2. Get your API key
3. Update `src/App.jsx` with your API key
4. Redeploy

## 📝 Browser Support

- ✅ Chrome/Edge (Full support including voice)
- ✅ Firefox (Manual search only)
- ⚠️ Safari (Limited voice support)

## 🛠️ Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React Icons
- Web Speech API

## 📄 License

MIT License - feel free to use for your real estate business!

## 💡 Tips

- Voice recognition requires HTTPS (all deployment platforms provide this)
- Works best on Chrome/Edge browsers
- Demo mode included - test without API key first

---

Built with ❤️ for realtors
